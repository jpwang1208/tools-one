import { useState, useEffect, useCallback, useRef } from 'react'
import './JSONFormatter.css'
import {
  formatJSON,
  validateJSON,
  minifyJSON,
  escapeJSON,
  unescapeJSON,
  toUnicode,
  fromUnicode,
  sortJSON,
  parseJSONSafely
} from '../../../utils/jsonUtils'
import type { JSONHistoryItem } from '../types'
import JSONTreeView, { type JSONTreeViewRef } from './JSONTreeView'
import SyntaxHighlighter from './SyntaxHighlighter'
import CodeEditor from './CodeEditor'

const HISTORY_KEY = 'json-formatter-history'
const MAX_HISTORY_ITEMS = 20

function generatePreview(content: string): string {
  try {
    const parsed = JSON.parse(content)
    if (typeof parsed === 'object' && parsed !== null) {
      const keys = Object.keys(parsed)
      if (keys.length > 0) {
        const firstKey = keys[0]
        const firstValue = parsed[firstKey]
        if (typeof firstValue === 'string' && firstValue.length < 30) {
          return `{${firstKey}: "${firstValue}"...}`
        }
        if (Array.isArray(parsed)) {
          return `[${parsed.length} items]`
        }
        return `{${keys.length} keys}`
      }
    }
  } catch {
  }
  return content.slice(0, 60).replace(/\s+/g, ' ')
}

function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [viewMode, setViewMode] = useState<'text' | 'tree'>('text')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showLineNumbers] = useState(true)
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null)
  const [history, setHistory] = useState<JSONHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const treeViewRef = useRef<JSONTreeViewRef>(null)

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    console.log('Loading history from localStorage:', saved ? 'found' : 'not found')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        console.log('Loaded history items:', parsed.length)
        setHistory(parsed)
      } catch (e) {
        console.error('Failed to parse history:', e)
        setHistory([])
      }
    }
  }, [])

  const addToHistory = useCallback((content: string) => {
    if (!content.trim()) {
      console.log('addToHistory: empty content, skipping')
      return
    }

    const preview = generatePreview(content)
    const newItem: JSONHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      preview,
      content
    }
    console.log('addToHistory: adding item', newItem.id, 'preview:', preview)

    setHistory(prev => {
      const filtered = prev.filter(item => item.content !== content)
      const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      console.log('addToHistory: saved to localStorage, total items:', newHistory.length)
      return newHistory
    })
  }, [])

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }, [])

  const loadHistoryItem = useCallback((item: JSONHistoryItem) => {
    console.log('Loading history item:', item.id, 'content length:', item.content?.length)
    setInput(item.content)
    setOutput(item.content)
    setError('')
  }, [])

  // Auto format
  useEffect(() => {
    if (input && !error) {
      const timeout = setTimeout(() => {
        const result = formatJSON(input, indentSize)
        if (result.success && result.data) {
          setOutput(result.data)
          setError('')
        }
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [input, indentSize, error])

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 2000)
  }

  const processJSON = useCallback((processor: () => { success: boolean; data?: string; error?: string }) => {
    setIsProcessing(true)
    const result = processor()
    setIsProcessing(false)
    
    if (result.success && result.data !== undefined) {
      setOutput(result.data)
      setError('')
    } else {
      setError(result.error || 'Processing failed')
    }
  }, [])

  const handleFormat = () => {
    const result = formatJSON(input, indentSize)
    if (result.success && result.data) {
      setInput(result.data)
      setOutput(result.data)
      setError('')
      addToHistory(result.data)
    }
  }
  const handleMinify = () => processJSON(() => minifyJSON(input))
  const handleSort = () => processJSON(() => sortJSON(input, indentSize))
  
  const handleValidate = () => {
    const result = validateJSON(input)
    if (result.success) {
      setError('')
      showNotification('JSON 格式有效', 'success')
    } else {
      setError(result.error || '格式无效')
    }
  }

  const handleEscape = () => processJSON(() => escapeJSON(input))
  const handleUnescape = () => processJSON(() => unescapeJSON(input))
  
  const handleToUnicode = () => {
    setOutput(toUnicode(input))
    setError('')
  }
  
  const handleFromUnicode = () => {
    setOutput(fromUnicode(input))
    setError('')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      showNotification('已复制到剪贴板', 'success')
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'formatted.json'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const loadExample = () => {
    const example = JSON.stringify({
      "name": "JSON Formatter Tool",
      "version": "1.0.0",
      "features": ["Format", "Validate", "Minify", "Escape"],
      "config": {
        "theme": "dark",
        "autoFormat": true
      },
      "stats": {
        "users": 1000,
        "rating": 4.8
      }
    }, null, 2)
    setInput(example)
    setOutput(example)
    setError('')
  }

  // Stats
  const stats = {
    lines: output.split('\n').length,
    chars: output.length,
    bytes: new Blob([output]).size
  }

  const parsedJSON = parseJSONSafely(output)

  return (
    <div className="json-formatter">
      {/* Top Toolbar */}
      <div className="json-toolbar">
        <div className="toolbar-section main-actions">
          <button onClick={handleFormat} className="action-btn primary" disabled={isProcessing}>
            <span className="icon">✨</span>
            <span>格式化</span>
          </button>
          <button onClick={handleMinify} className="action-btn">
            <span className="icon">📦</span>
            <span>压缩</span>
          </button>
          <button onClick={handleSort} className="action-btn">
            <span className="icon">🔤</span>
            <span>排序</span>
          </button>
          <button onClick={handleValidate} className="action-btn">
            <span className="icon">✓</span>
            <span>验证</span>
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-section convert-actions">
          <button onClick={handleEscape} className="action-btn small">转义</button>
          <button onClick={handleUnescape} className="action-btn small">去转义</button>
          <button onClick={handleToUnicode} className="action-btn small">中文→Unicode</button>
          <button onClick={handleFromUnicode} className="action-btn small">Unicode→中文</button>
        </div>

        <div className="toolbar-spacer" />

        <div className="toolbar-section settings">
          <select 
            value={indentSize} 
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="setting-select"
          >
            <option value={2}>2 空格</option>
            <option value={4}>4 空格</option>
            <option value={8}>8 空格</option>
            <option value={0}>制表符</option>
          </select>

          <div className="view-tabs">
            <button
              className={viewMode === 'text' ? 'active' : ''}
              onClick={() => setViewMode('text')}
            >
              文本
            </button>
            <button
              className={viewMode === 'tree' ? 'active' : ''}
              onClick={() => setViewMode('tree')}
            >
              树视图
            </button>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`history-toggle-btn ${showHistory ? 'active' : ''}`}
            title="历史记录"
          >
            <span>🕐</span>
            <span>历史</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="json-main-wrapper">
        {showHistory && (
          <div className="history-sidebar">
            <div className="history-header">
              <span>历史记录</span>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-btn small danger">
                  清空
                </button>
              )}
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="history-empty">暂无历史记录</div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="history-item"
                    onClick={() => loadHistoryItem(item)}
                  >
                    <div className="history-item-content">
                      <div className="history-item-time">{formatTime(item.timestamp)}</div>
                      <div className="history-item-preview">{item.preview}</div>
                    </div>
                    <button
                      className="history-item-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteHistoryItem(item.id)
                      }}
                      title="删除"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="json-content">
          {/* Input Panel */}
        <div className="json-panel input-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span className="title-icon">📄</span>
              <span>输入 JSON</span>
            </div>
            <div className="panel-actions">
              <button onClick={loadExample} className="text-btn">示例</button>
              <button onClick={handleClear} className="text-btn danger">清空</button>
            </div>
          </div>
          
          <div className="editor-container">
            {showLineNumbers && (
              <div className="line-numbers-gutter">
                {Array.from({ length: Math.max(input.split('\n').length, 1) }, (_, i) => (
                  <div key={i} className="line-num">{i + 1}</div>
                ))}
              </div>
            )}
            <CodeEditor
              ref={inputRef}
              value={input}
              onChange={(value) => {
                setInput(value)
                if (error) setError('')
              }}
              placeholder="在此粘贴 JSON..."
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="json-panel output-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span className="title-icon">✨</span>
              <span>格式化结果</span>
            </div>
            <div className="panel-actions">
              {viewMode === 'tree' && (
                <>
                  <button
                    onClick={() => treeViewRef.current?.expandAll()}
                    className="text-btn"
                    disabled={!output}
                  >
                    全展开
                  </button>
                  <button
                    onClick={() => treeViewRef.current?.collapseAll()}
                    className="text-btn"
                    disabled={!output}
                  >
                    全折叠
                  </button>
                </>
              )}
              <button onClick={handleCopy} className="text-btn" disabled={!output}>
                复制
              </button>
              <button onClick={handleDownload} className="text-btn" disabled={!output}>
                下载
              </button>
            </div>
          </div>
          
          <div className="editor-container">
            {viewMode === 'text' ? (
              <>
                {showLineNumbers && (
                  <div className="line-numbers-gutter">
                    {Array.from({ length: Math.max(output.split('\n').length, 1) }, (_, i) => (
                      <div key={i} className="line-num">{i + 1}</div>
                    ))}
                  </div>
                )}
                <div className="json-output-wrapper">
                  <SyntaxHighlighter code={output} />
                </div>
              </>
            ) : (
              <div className="tree-view-container">
                {showLineNumbers && (
                  <div className="line-numbers-gutter">
                    {Array.from({ length: Math.max(output.split('\n').length, 1) }, (_, i) => (
                      <div key={i} className="line-num">{i + 1}</div>
                    ))}
                  </div>
                )}
                <div className="tree-view-wrapper">
                  {parsedJSON ? (
                    <JSONTreeView ref={treeViewRef} data={parsedJSON} />
                  ) : (
                    <div className="empty-placeholder">
                      {output ? '无效的 JSON' : '输入 JSON 以查看树状结构'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-toast">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button onClick={() => setError('')} className="close-btn">✕</button>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Status Bar */}
      <div className="json-statusbar">
        <div className="status-left">
          <span className="stat-item">
            <span className="stat-label">Lines:</span>
            <span className="stat-value">{stats.lines}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Chars:</span>
            <span className="stat-value">{stats.chars}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Size:</span>
            <span className="stat-value">{formatBytes(stats.bytes)}</span>
          </span>
        </div>
        <div className="status-right">
          {isProcessing && <span className="processing-indicator">Processing...</span>}
        </div>
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default JSONFormatter
