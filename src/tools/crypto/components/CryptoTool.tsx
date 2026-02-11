import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import './CryptoTool.css'

type TabType = 'hash' | 'encode' | 'aes' | 'rsa' | 'generator'

interface KeyPair {
  public_key: string
  private_key: string
}

function CryptoTool() {
  const [activeTab, setActiveTab] = useState<TabType>('hash')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null)

  const [aesKey, setAesKey] = useState('')
  const [aesIv, setAesIv] = useState('')
  const [rsaPublicKey, setRsaPublicKey] = useState('')
  const [rsaPrivateKey, setRsaPrivateKey] = useState('')
  const [rsaKeySize, setRsaKeySize] = useState(2048)

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 2000)
  }

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
    } catch (e) {
      setError(`哈希计算失败: ${e}`)
    }
  }

  const handleEncode = async (type: 'base64' | 'hex' | 'url', mode: 'encode' | 'decode') => {
    if (!input) {
      setError('请输入需要处理的内容')
      return
    }
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
    } catch (e) {
      setError(`${mode === 'encode' ? '编码' : '解码'}失败: ${e}`)
    }
  }

  const handleAesEncrypt = async () => {
    if (!input || !aesKey || !aesIv) {
      setError('请输入内容、密钥和 IV')
      return
    }
    try {
      const result = await invoke('aes_encrypt', {
        text: input,
        key: aesKey,
        iv: aesIv
      })
      setOutput(result as string)
      setError('')
    } catch (e) {
      setError(`AES 加密失败: ${e}`)
    }
  }

  const handleAesDecrypt = async () => {
    if (!input || !aesKey || !aesIv) {
      setError('请输入密文、密钥和 IV')
      return
    }
    try {
      const result = await invoke('aes_decrypt', {
        encryptedText: input,
        key: aesKey,
        iv: aesIv
      })
      setOutput(result as string)
      setError('')
    } catch (e) {
      setError(`AES 解密失败: ${e}`)
    }
  }

  const handleRsaEncrypt = async () => {
    if (!input || !rsaPublicKey) {
      setError('请输入内容和公钥')
      return
    }
    try {
      const result = await invoke('rsa_encrypt', {
        text: input,
        publicKeyPem: rsaPublicKey
      })
      setOutput(result as string)
      setError('')
    } catch (e) {
      setError(`RSA 加密失败: ${e}`)
    }
  }

  const handleRsaDecrypt = async () => {
    if (!input || !rsaPrivateKey) {
      setError('请输入密文和私钥')
      return
    }
    try {
      const result = await invoke('rsa_decrypt', {
        encryptedText: input,
        privateKeyPem: rsaPrivateKey
      })
      setOutput(result as string)
      setError('')
    } catch (e) {
      setError(`RSA 解密失败: ${e}`)
    }
  }

  const generateAesKey = async () => {
    try {
      const result = await invoke('generate_aes_key')
      setAesKey(result as string)
      showNotification('AES 密钥已生成', 'success')
    } catch (e) {
      setError(`生成密钥失败: ${e}`)
    }
  }

  const generateAesIv = async () => {
    try {
      const result = await invoke('generate_aes_iv')
      setAesIv(result as string)
      showNotification('AES IV 已生成', 'success')
    } catch (e) {
      setError(`生成 IV 失败: ${e}`)
    }
  }

  const generateRsaKeypair = async () => {
    try {
      const result = await invoke('generate_rsa_keypair', { bits: rsaKeySize }) as KeyPair
      setRsaPublicKey(result.public_key)
      setRsaPrivateKey(result.private_key)
      showNotification(`RSA ${rsaKeySize} 位密钥对已生成`, 'success')
    } catch (e) {
      setError(`生成密钥对失败: ${e}`)
    }
  }

  const generateRandomKey = async (length: number) => {
    try {
      const result = await invoke('generate_random_key', { length })
      setInput(result as string)
      setOutput('')
      showNotification(`随机密钥已生成 (${length} 字节)`, 'success')
    } catch (e) {
      setError(`生成随机密钥失败: ${e}`)
    }
  }

  const tabs = [
    { id: 'hash', name: '哈希', icon: '#' },
    { id: 'encode', name: '编码', icon: '⇄' },
    { id: 'aes', name: 'AES', icon: '🔐' },
    { id: 'rsa', name: 'RSA', icon: '🔑' },
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
                  <button onClick={() => handleEncode('base64', 'encode')} className="action-btn small">编码</button>
                  <button onClick={() => handleEncode('base64', 'decode')} className="action-btn small">解码</button>
                </div>
              </div>
              <div className="encode-item">
                <label>Hex</label>
                <div className="btn-group">
                  <button onClick={() => handleEncode('hex', 'encode')} className="action-btn small">编码</button>
                  <button onClick={() => handleEncode('hex', 'decode')} className="action-btn small">解码</button>
                </div>
              </div>
              <div className="encode-item">
                <label>URL</label>
                <div className="btn-group">
                  <button onClick={() => handleEncode('url', 'encode')} className="action-btn small">编码</button>
                  <button onClick={() => handleEncode('url', 'decode')} className="action-btn small">解码</button>
                </div>
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
              <select value={rsaKeySize} onChange={(e) => setRsaKeySize(Number(e.target.value))}>
                <option value={1024}>1024 位</option>
                <option value={2048}>2048 位</option>
                <option value={4096}>4096 位</option>
              </select>
              <button onClick={generateRsaKeypair} className="action-btn">生成密钥对</button>
              <button onClick={handleRsaEncrypt} className="action-btn primary">加密</button>
              <button onClick={handleRsaDecrypt} className="action-btn">解密</button>
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
