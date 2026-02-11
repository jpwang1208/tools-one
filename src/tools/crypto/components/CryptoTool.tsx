import { useState, useCallback, useRef, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import './CryptoTool.css'

type TabType = 'hash' | 'encode' | 'aes' | 'rsa' | 'ecc' | 'hmac' | 'timestamp' | 'uuid' | 'qrcode' | 'generator'

interface KeyPair {
  public_key: string
  private_key: string
}

function CryptoTool() {
  const [activeTab, setActiveTab] = useState<TabType>('hash')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | 'info' | 'warning'} | null>(null)

  const [aesKey, setAesKey] = useState('')
  const [aesIv, setAesIv] = useState('')
  const [rsaPublicKey, setRsaPublicKey] = useState('')
  const [rsaPrivateKey, setRsaPrivateKey] = useState('')
  const [rsaKeySize, setRsaKeySize] = useState(2048)
  const [eccPublicKey, setEccPublicKey] = useState('')
  const [eccPrivateKey, setEccPrivateKey] = useState('')

  // 新增状态
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [keyStrength, setKeyStrength] = useState<{text: string; level: number} | null>(null)
  const [hmacKey, setHmacKey] = useState('')
  const [hmacAlgorithm, setHmacAlgorithm] = useState<'sha256' | 'sha512'>('sha256')
  const [qrContent, setQrContent] = useState('')
  const [qrSize, setQrSize] = useState(256)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (qrContent && qrCanvasRef.current) {
      import('qrcode').then(({ default: QRCode }) => {
        QRCode.toCanvas(qrCanvasRef.current, qrContent, {
          width: qrSize - 16,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }).catch(() => {})
      })
    }
  }, [qrContent, qrSize])

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 2000)
  }, [])

  const setLoadingState = useCallback((key: string, state: boolean) => {
    setLoading(prev => ({ ...prev, [key]: state }))
  }, [])

  const toggleVisibility = useCallback((key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const checkKeyStrength = useCallback((key: string) => {
    if (!key) {
      setKeyStrength(null)
      return
    }
    const hexPattern = /^[a-fA-F0-9]+$/
    const hasLower = /[a-z]/.test(key)
    const hasUpper = /[A-Z]/.test(key)
    const hasDigit = /\d/.test(key)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(key)

    let score = 0
    if (hexPattern.test(key)) score += 1
    if (hasLower) score += 1
    if (hasUpper) score += 1
    if (hasDigit) score += 1
    if (hasSpecial) score += 1
    if (key.length >= 32) score += 1

    let level = 0
    let text = '弱'
    if (score >= 4) { level = 3; text = '强' }
    else if (score >= 2) { level = 2; text = '中等' }
    else { level = 1; text = '弱' }

    setKeyStrength({ text, level })
  }, [])

  const handleCopy = async (text: string) => {
    if (text) {
      await navigator.clipboard.writeText(text)
      showNotification('已复制到剪贴板', 'success')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleHash = async (algorithm: 'md5' | 'sha256' | 'sha512') => {
    if (!input) {
      setError('请输入需要哈希的内容')
      return
    }
    setLoadingState('hash', true)
    try {
      let result: string
      switch (algorithm) {
        case 'md5':
          result = await invoke('md5_hash', { text: input })
          break
        case 'sha256':
          result = await invoke('sha256_hash', { text: input })
          break
        case 'sha512':
          result = await invoke('sha512_hash', { text: input })
          break
      }
      setOutput(result)
      setError('')
      showNotification('哈希计算完成', 'success')
    } catch (e) {
      setError(`哈希计算失败: ${e}`)
    } finally {
      setLoadingState('hash', false)
    }
  }

  const handleHmac = async () => {
    if (!input || !hmacKey) {
      setError('请输入内容和密钥')
      return
    }
    setLoadingState('hmac', true)
    try {
      const result = await invoke('hmac_hash', { text: input, key: hmacKey, algorithm: hmacAlgorithm })
      setOutput(result as string)
      setError('')
      showNotification('HMAC 计算完成', 'success')
    } catch (e) {
      setError(`HMAC 计算失败: ${e}`)
    } finally {
      setLoadingState('hmac', false)
    }
  }

  const handleEncode = async (type: 'base64' | 'hex' | 'url', mode: 'encode' | 'decode') => {
    if (!input) {
      setError('请输入需要处理的内容')
      return
    }
    setLoadingState(`encode-${type}-${mode}`, true)
    try {
      let result: string
      const commandMap = {
        base64: { encode: 'base64_encode', decode: 'base64_decode' },
        hex: { encode: 'hex_encode', decode: 'hex_decode' },
        url: { encode: 'url_encode', decode: 'url_decode' }
      }
      const command = commandMap[type][mode]
      if (mode === 'encode') {
        result = await invoke(command, { text: input })
      } else {
        result = await invoke(command, { encoded: input })
      }
      setOutput(result)
      setError('')
      showNotification(`${mode === 'encode' ? '编码' : '解码'}完成`, 'success')
    } catch (e) {
      setError(`${mode === 'encode' ? '编码' : '解码'}失败: ${e}`)
    } finally {
      setLoadingState(`encode-${type}-${mode}`, false)
    }
  }

  const handleAesEncrypt = async () => {
    if (!input || !aesKey || !aesIv) {
      setError('请输入内容、密钥和 IV')
      return
    }
    setLoadingState('aes-encrypt', true)
    try {
      const result = await invoke('aes_encrypt', {
        text: input,
        key: aesKey,
        iv: aesIv
      })
      setOutput(result as string)
      setError('')
      showNotification('AES 加密完成', 'success')
    } catch (e) {
      setError(`AES 加密失败: ${e}`)
    } finally {
      setLoadingState('aes-encrypt', false)
    }
  }

  const handleAesDecrypt = async () => {
    if (!input || !aesKey || !aesIv) {
      setError('请输入密文、密钥和 IV')
      return
    }
    setLoadingState('aes-decrypt', true)
    try {
      const result = await invoke('aes_decrypt', {
        encryptedText: input,
        key: aesKey,
        iv: aesIv
      })
      setOutput(result as string)
      setError('')
      showNotification('AES 解密完成', 'success')
    } catch (e) {
      setError(`AES 解密失败: ${e}`)
    } finally {
      setLoadingState('aes-decrypt', false)
    }
  }

  const handleRsaEncrypt = async () => {
    if (!input || !rsaPublicKey) {
      setError('请输入内容和公钥')
      return
    }
    setLoadingState('rsa-encrypt', true)
    try {
      const result = await invoke('rsa_encrypt', {
        text: input,
        publicKeyPem: rsaPublicKey
      })
      setOutput(result as string)
      setError('')
      showNotification('RSA 加密完成', 'success')
    } catch (e) {
      setError(`RSA 加密失败: ${e}`)
    } finally {
      setLoadingState('rsa-encrypt', false)
    }
  }

  const handleRsaDecrypt = async () => {
    if (!input || !rsaPrivateKey) {
      setError('请输入密文和私钥')
      return
    }
    setLoadingState('rsa-decrypt', true)
    try {
      const result = await invoke('rsa_decrypt', {
        encryptedText: input,
        privateKeyPem: rsaPrivateKey
      })
      setOutput(result as string)
      setError('')
      showNotification('RSA 解密完成', 'success')
    } catch (e) {
      setError(`RSA 解密失败: ${e}`)
    } finally {
      setLoadingState('rsa-decrypt', false)
    }
  }

  const handleEccEncrypt = async () => {
    if (!input || !eccPublicKey) {
      setError('请输入内容和公钥')
      return
    }
    setLoadingState('ecc-encrypt', true)
    try {
      const result = await invoke('ecc_encrypt', {
        text: input,
        publicKeyPem: eccPublicKey
      })
      setOutput(result as string)
      setError('')
      showNotification('ECC 加密完成', 'success')
    } catch (e) {
      setError(`ECC 加密失败: ${e}`)
    } finally {
      setLoadingState('ecc-encrypt', false)
    }
  }

  const handleEccDecrypt = async () => {
    if (!input || !eccPrivateKey) {
      setError('请输入密文和私钥')
      return
    }
    setLoadingState('ecc-decrypt', true)
    try {
      const result = await invoke('ecc_decrypt', {
        encryptedText: input,
        privateKeyPem: eccPrivateKey
      })
      setOutput(result as string)
      setError('')
      showNotification('ECC 解密完成', 'success')
    } catch (e) {
      setError(`ECC 解密失败: ${e}`)
    } finally {
      setLoadingState('ecc-decrypt', false)
    }
  }

  const generateAesKey = async () => {
    setLoadingState('generate-aes-key', true)
    try {
      const result = await invoke('generate_aes_key')
      setAesKey(result as string)
      checkKeyStrength(result as string)
      showNotification('AES 密钥已生成', 'success')
    } catch (e) {
      setError(`生成密钥失败: ${e}`)
    } finally {
      setLoadingState('generate-aes-key', false)
    }
  }

  const generateAesIv = async () => {
    setLoadingState('generate-aes-iv', true)
    try {
      const result = await invoke('generate_aes_iv')
      setAesIv(result as string)
      showNotification('AES IV 已生成', 'success')
    } catch (e) {
      setError(`生成 IV 失败: ${e}`)
    } finally {
      setLoadingState('generate-aes-iv', false)
    }
  }

  const generateRsaKeypair = async () => {
    setLoadingState('generate-rsa-keypair', true)
    try {
      const result = await invoke('generate_rsa_keypair', { bits: rsaKeySize }) as KeyPair
      setRsaPublicKey(result.public_key)
      setRsaPrivateKey(result.private_key)
      showNotification(`RSA ${rsaKeySize} 位密钥对已生成`, 'success')
    } catch (e) {
      setError(`生成密钥对失败: ${e}`)
    } finally {
      setLoadingState('generate-rsa-keypair', false)
    }
  }

  const generateEccKeypair = async () => {
    setLoadingState('generate-ecc-keypair', true)
    try {
      const result = await invoke('generate_ecc_keypair') as KeyPair
      setEccPublicKey(result.public_key)
      setEccPrivateKey(result.private_key)
      showNotification('ECC (P-256) 密钥对已生成', 'success')
    } catch (e) {
      setError(`生成密钥对失败: ${e}`)
    } finally {
      setLoadingState('generate-ecc-keypair', false)
    }
  }

  const generateRandomKey = async (length: number) => {
    setLoadingState(`generate-random-${length}`, true)
    try {
      const result = await invoke('generate_random_key', { length })
      setInput(result as string)
      setOutput('')
      showNotification(`随机密钥已生成 (${length} 字节)`, 'success')
    } catch (e) {
      setError(`生成随机密钥失败: ${e}`)
    } finally {
      setLoadingState(`generate-random-${length}`, false)
    }
  }

  // 时间戳相关
  const getTimestamps = useCallback(() => {
    const now = Date.now()
    return {
      unix: Math.floor(now / 1000),
      unixMs: now,
      iso: new Date(now).toISOString(),
      utc: new Date(now).toUTCString(),
      local: new Date(now).toLocaleString('zh-CN'),
    }
  }, [])

  const [timestamps, setTimestamps] = useState(getTimestamps())

  const refreshTimestamps = useCallback(() => {
    setTimestamps(getTimestamps())
    showNotification('时间戳已刷新', 'info')
  }, [getTimestamps])

  const copyTimestamp = useCallback((value: string) => {
    navigator.clipboard.writeText(value.toString())
    showNotification('已复制到剪贴板', 'success')
  }, [])

  // UUID 生成
  const generateUuid = useCallback((version: 1 | 4 | 5) => {
    // v1: 基于时间戳
    if (version === 1) {
      return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
    // v4: 随机生成
    if (version === 4) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
    // v5: 基于名称和命名空间
    return 'xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }, [])

  const [uuids, setUuids] = useState<Record<string, string>>({
    v1: generateUuid(1),
    v4: generateUuid(4),
    v5: generateUuid(5),
  })

  const refreshUuids = useCallback(() => {
    setUuids({
      v1: generateUuid(1),
      v4: generateUuid(4),
      v5: generateUuid(5),
    })
    showNotification('UUID 已刷新', 'success')
  }, [generateUuid])

  const tabs = [
    { id: 'hash', name: '哈希', icon: '#' },
    { id: 'encode', name: '编码', icon: '⇄' },
    { id: 'hmac', name: 'HMAC', icon: '🔑' },
    { id: 'aes', name: 'AES', icon: '🔐' },
    { id: 'rsa', name: 'RSA', icon: '🔑' },
    { id: 'ecc', name: 'ECC', icon: '📊' },
    { id: 'timestamp', name: '时间戳', icon: '🕐' },
    { id: 'uuid', name: 'UUID', icon: '🆔' },
    { id: 'qrcode', name: '二维码', icon: '📱' },
    { id: 'generator', name: '生成器', icon: '⚙️' }
  ]

  return (
    <div className="crypto-tool">
      <div className="crypto-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id as TabType)
              setError('')
              setOutput('')
            }}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="crypto-content">
        {activeTab === 'hash' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>哈希算法</h3>
              <p className="panel-desc">计算文本的 MD5、SHA256、SHA512 哈希值</p>
            </div>
            <div className="action-buttons">
              <button onClick={() => handleHash('md5')} className="action-btn">MD5</button>
              <button onClick={() => handleHash('sha256')} className="action-btn">SHA256</button>
              <button onClick={() => handleHash('sha512')} className="action-btn">SHA512</button>
            </div>
          </div>
        )}

        {activeTab === 'encode' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>编码/解码</h3>
              <p className="panel-desc">Base64、Hex、URL 编码转换</p>
            </div>
            <div className="encode-grid">
              <div className="encode-item">
                <label>Base64</label>
                <div className="btn-group">
                  <button onClick={() => handleEncode('base64', 'encode')} className="action-btn small" disabled={loading['encode-base64-encode']}>
                    {loading['encode-base64-encode'] ? <span className="spinner" /> : '编码'}
                  </button>
                  <button onClick={() => handleEncode('base64', 'decode')} className="action-btn small" disabled={loading['encode-base64-decode']}>
                    {loading['encode-base64-decode'] ? <span className="spinner" /> : '解码'}
                  </button>
                </div>
              </div>
              <div className="encode-item">
                <label>Hex</label>
                <div className="btn-group">
                  <button onClick={() => handleEncode('hex', 'encode')} className="action-btn small" disabled={loading['encode-hex-encode']}>
                    {loading['encode-hex-encode'] ? <span className="spinner" /> : '编码'}
                  </button>
                  <button onClick={() => handleEncode('hex', 'decode')} className="action-btn small" disabled={loading['encode-hex-decode']}>
                    {loading['encode-hex-decode'] ? <span className="spinner" /> : '解码'}
                  </button>
                </div>
              </div>
              <div className="encode-item">
                <label>URL</label>
                <div className="btn-group">
                  <button onClick={() => handleEncode('url', 'encode')} className="action-btn small" disabled={loading['encode-url-encode']}>
                    {loading['encode-url-encode'] ? <span className="spinner" /> : '编码'}
                  </button>
                  <button onClick={() => handleEncode('url', 'decode')} className="action-btn small" disabled={loading['encode-url-decode']}>
                    {loading['encode-url-decode'] ? <span className="spinner" /> : '解码'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hmac' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>HMAC 消息认证码</h3>
              <p className="panel-desc">基于哈希的消息认证码，支持 SHA256/SHA512</p>
            </div>
            <div className="key-field">
              <label>密钥</label>
              <div className="input-with-btn">
                <input
                  type={showKeys['hmac'] ? 'text' : 'password'}
                  value={hmacKey}
                  onChange={(e) => {
                    setHmacKey(e.target.value)
                    checkKeyStrength(e.target.value)
                  }}
                  placeholder="输入 HMAC 密钥..."
                />
                <button onClick={() => toggleVisibility('hmac')} className="toggle-btn">
                  {showKeys['hmac'] ? '隐藏' : '显示'}
                </button>
              </div>
              {keyStrength && (
                <div className="key-strength">
                  <div className="strength-bar">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`strength-segment ${i <= keyStrength.level ? keyStrength.text : ''}`} />
                    ))}
                  </div>
                  <span className="strength-text">强度: {keyStrength.text}</span>
                </div>
              )}
            </div>
            <div className="rsa-controls">
              <select value={hmacAlgorithm} onChange={(e) => setHmacAlgorithm(e.target.value as 'sha256' | 'sha512')}>
                <option value="sha256">SHA256</option>
                <option value="sha512">SHA512</option>
              </select>
              <button onClick={handleHmac} className="action-btn primary" disabled={loading['hmac']}>
                {loading['hmac'] ? <span className="spinner" /> : '计算 HMAC'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'timestamp' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>时间戳转换</h3>
              <p className="panel-desc">Unix 时间戳与日期时间相互转换</p>
            </div>
            <div className="timestamp-grid">
              <div className="timestamp-item">
                <label>Unix 时间戳 (秒)</label>
                <div className="timestamp-value">{timestamps.unix}</div>
                <button onClick={() => copyTimestamp(String(timestamps.unix))} className="action-btn small">复制</button>
              </div>
              <div className="timestamp-item">
                <label>Unix 时间戳 (毫秒)</label>
                <div className="timestamp-value">{timestamps.unixMs}</div>
                <button onClick={() => copyTimestamp(String(timestamps.unixMs))} className="action-btn small">复制</button>
              </div>
              <div className="timestamp-item">
                <label>ISO 8601</label>
                <div className="timestamp-value">{timestamps.iso}</div>
                <button onClick={() => copyTimestamp(timestamps.iso)} className="action-btn small">复制</button>
              </div>
              <div className="timestamp-item">
                <label>UTC 时间</label>
                <div className="timestamp-value">{timestamps.utc}</div>
                <button onClick={() => copyTimestamp(timestamps.utc)} className="action-btn small">复制</button>
              </div>
            </div>
            <div className="timestamp-actions">
              <button onClick={refreshTimestamps} className="action-btn">刷新时间戳</button>
            </div>
          </div>
        )}

        {activeTab === 'uuid' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>UUID 生成器</h3>
              <p className="panel-desc">生成符合 RFC 4122 标准的 UUID</p>
            </div>
            <div className="uuid-grid">
              <div className="uuid-item">
                <label>UUID v1 (基于时间戳)</label>
                <div className="uuid-value">{uuids.v1}</div>
                <button onClick={() => {
                  const newUuid = generateUuid(1)
                  setUuids(prev => ({ ...prev, v1: newUuid }))
                  showNotification('已生成新 UUID', 'success')
                }} className="action-btn small">重新生成</button>
              </div>
              <div className="uuid-item">
                <label>UUID v4 (随机生成)</label>
                <div className="uuid-value">{uuids.v4}</div>
                <button onClick={() => {
                  const newUuid = generateUuid(4)
                  setUuids(prev => ({ ...prev, v4: newUuid }))
                  showNotification('已生成新 UUID', 'success')
                }} className="action-btn small">重新生成</button>
              </div>
              <div className="uuid-item">
                <label>UUID v5 (基于名称)</label>
                <div className="uuid-value">{uuids.v5}</div>
                <button onClick={() => {
                  const newUuid = generateUuid(5)
                  setUuids(prev => ({ ...prev, v5: newUuid }))
                  showNotification('已生成新 UUID', 'success')
                }} className="action-btn small">重新生成</button>
              </div>
            </div>
            <div className="timestamp-actions">
              <button onClick={refreshUuids} className="action-btn">刷新所有 UUID</button>
            </div>
          </div>
        )}

        {activeTab === 'qrcode' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>二维码生成</h3>
              <p className="panel-desc">将文本或 URL 生成二维码</p>
            </div>
            <div className="qr-section">
              <div className="qr-input-area">
                <div className="key-field">
                  <label>二维码内容</label>
                  <textarea
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                    placeholder="输入文本或 URL..."
                    rows={4}
                  />
                </div>
                <div className="key-field">
                  <label>二维码大小</label>
                  <div className="input-with-btn">
                    <select value={String(qrSize)} onChange={(e) => setQrSize(Number(e.target.value))}>
                      <option value="128">128x128</option>
                      <option value="256">256x256</option>
                      <option value="512">512x512</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="qr-preview">
                {qrContent ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: qrSize, 
                      height: qrSize, 
                      background: 'white', 
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'inline-block'
                    }}>
                      <canvas ref={qrCanvasRef} />
                    </div>
                    <div className="qr-download">
                      <button 
                        onClick={async () => {
                          const canvas = document.querySelector('.qr-preview canvas') as HTMLCanvasElement
                          if (canvas) {
                            const link = document.createElement('a')
                            link.download = 'qrcode.png'
                            link.href = canvas.toDataURL('image/png')
                            link.click()
                            showNotification('二维码已下载', 'success')
                          }
                        }} 
                        className="action-btn"
                      >
                        下载二维码
                      </button>
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#888' }}>输入内容后生成二维码</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'aes' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>AES 加密/解密</h3>
              <p className="panel-desc">AES-256-CBC 对称加密</p>
            </div>
            <div className="key-inputs">
              <div className="key-field">
                <label>密钥 (Key - 32字节/64位Hex)</label>
                <div className="input-with-btn">
                  <input
                    type="text"
                    value={aesKey}
                    onChange={(e) => setAesKey(e.target.value)}
                    placeholder="输入或生成密钥..."
                  />
                  <button onClick={generateAesKey} className="gen-btn">生成</button>
                </div>
              </div>
              <div className="key-field">
                <label>初始向量 (IV - 16字节/32位Hex)</label>
                <div className="input-with-btn">
                  <input
                    type="text"
                    value={aesIv}
                    onChange={(e) => setAesIv(e.target.value)}
                    placeholder="输入或生成IV..."
                  />
                  <button onClick={generateAesIv} className="gen-btn">生成</button>
                </div>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={handleAesEncrypt} className="action-btn primary">加密</button>
              <button onClick={handleAesDecrypt} className="action-btn">解密</button>
            </div>
          </div>
        )}

        {activeTab === 'rsa' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>RSA 加密/解密</h3>
              <p className="panel-desc">RSA 非对称加密 (PKCS1v15)</p>
            </div>
            <div className="key-areas">
              <div className="key-area">
                <label>公钥 (Public Key)</label>
                <textarea
                  value={rsaPublicKey}
                  onChange={(e) => setRsaPublicKey(e.target.value)}
                  placeholder="输入或生成公钥..."
                  rows={6}
                />
              </div>
              <div className="key-area">
                <label>私钥 (Private Key)</label>
                <textarea
                  value={rsaPrivateKey}
                  onChange={(e) => setRsaPrivateKey(e.target.value)}
                  placeholder="输入或生成私钥..."
                  rows={6}
                />
              </div>
            </div>
            <div className="rsa-controls">
              <select value={String(rsaKeySize)} onChange={(e) => setRsaKeySize(Number(e.target.value))}>
                <option value="1024">1024 位</option>
                <option value="2048">2048 位</option>
                <option value="4096">4096 位</option>
              </select>
              <button onClick={generateRsaKeypair} className="action-btn">生成密钥对</button>
              <button onClick={handleRsaEncrypt} className="action-btn primary">加密</button>
              <button onClick={handleRsaDecrypt} className="action-btn">解密</button>
            </div>
          </div>
        )}

        {activeTab === 'ecc' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>ECC 加密/解密</h3>
              <p className="panel-desc">ECC (P-256) 椭圆曲线非对称加密 (ECIES)</p>
            </div>
            <div className="key-areas">
              <div className="key-area">
                <label>公钥 (Public Key)</label>
                <textarea
                  value={eccPublicKey}
                  onChange={(e) => setEccPublicKey(e.target.value)}
                  placeholder="输入或生成公钥..."
                  rows={6}
                />
              </div>
              <div className="key-area">
                <label>私钥 (Private Key)</label>
                <textarea
                  value={eccPrivateKey}
                  onChange={(e) => setEccPrivateKey(e.target.value)}
                  placeholder="输入或生成私钥..."
                  rows={6}
                />
              </div>
            </div>
            <div className="rsa-controls">
              <button onClick={generateEccKeypair} className="action-btn">生成密钥对</button>
              <button onClick={handleEccEncrypt} className="action-btn primary">加密</button>
              <button onClick={handleEccDecrypt} className="action-btn">解密</button>
            </div>
          </div>
        )}

        {activeTab === 'generator' && (
          <div className="tab-panel">
            <div className="panel-header">
              <h3>密钥生成器</h3>
              <p className="panel-desc">生成随机密钥和密钥对</p>
            </div>
            <div className="generator-grid">
              <div className="generator-item">
                <label>AES 密钥</label>
                <button onClick={generateAesKey} className="action-btn">生成 256 位密钥</button>
              </div>
              <div className="generator-item">
                <label>AES IV</label>
                <button onClick={generateAesIv} className="action-btn">生成 128 位 IV</button>
              </div>
              <div className="generator-item">
                <label>随机密钥</label>
                <div className="btn-group">
                  <button onClick={() => generateRandomKey(16)} className="action-btn small">16字节</button>
                  <button onClick={() => generateRandomKey(32)} className="action-btn small">32字节</button>
                  <button onClick={() => generateRandomKey(64)} className="action-btn small">64字节</button>
                </div>
              </div>
              <div className="generator-item">
                <label>RSA 密钥对</label>
                <div className="input-with-select">
                  <select value={rsaKeySize} onChange={(e) => setRsaKeySize(Number(e.target.value))}>
                    <option value={1024}>1024 位</option>
                    <option value={2048}>2048 位</option>
                    <option value={4096}>4096 位</option>
                  </select>
                  <button onClick={generateRsaKeypair} className="action-btn">生成</button>
                </div>
              </div>
              <div className="generator-item">
                <label>ECC 密钥对</label>
                <button onClick={generateEccKeypair} className="action-btn">生成 P-256 密钥对</button>
              </div>
            </div>
          </div>
        )}

        <div className="io-section">
          <div className="input-section">
            <div className="section-header">
              <label>输入</label>
              <button onClick={handleClear} className="text-btn danger">清空</button>
            </div>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                if (error) setError('')
              }}
              placeholder="在此输入内容..."
              rows={8}
            />
          </div>

          <div className="output-section">
            <div className="section-header">
              <label>输出</label>
              <button onClick={() => handleCopy(output)} className="text-btn" disabled={!output}>
                复制
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="结果将显示在这里..."
              rows={8}
            />
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button onClick={() => setError('')} className="close-btn">✕</button>
          </div>
        )}
      </div>

      {notification && (
        <div className={`toast ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default CryptoTool
