import { useState } from 'react'
import '../../common/ToolStyles.css'

function HTMLEscape() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape')

  const escapeHTML = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  const unescapeHTML = (str: string) => {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
  }

  const handleConvert = () => {
    if (mode === 'escape') {
      setOutput(escapeHTML(input))
    } else {
      setOutput(unescapeHTML(input))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">🔤</div>
        <h2>HTML转义</h2>
        <p>HTML特殊字符转义和反转义</p>
      </div>

      <div className="tool-card-container">
        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'escape' ? 'active' : ''}`}
            onClick={() => setMode('escape')}
          >
            转义
          </button>
          <button
            className={`mode-btn ${mode === 'unescape' ? 'active' : ''}`}
            onClick={() => setMode('unescape')}
          >
            反转义
          </button>
        </div>

        <div className="tool-input-group">
          <label>输入</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'escape' ? '<div>Hello &quot;World&quot;</div>' : '&lt;div&gt;Hello &amp;quot;World&amp;quot;&lt;/div&gt;'}
            rows={6}
          />
        </div>

        <button className="tool-button primary" onClick={handleConvert} style={{ width: '100%' }}>
          转换
        </button>

        {output && (
          <div className="tool-result">
            <div className="tool-result-label">
              结果
              <button className="copy-link" onClick={handleCopy}>复制</button>
            </div>
            <pre className="tool-result-value" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{output}</pre>
          </div>
        )}

        <div className="escape-reference">
          <h4>转换对照表</h4>
          <table>
            <thead>
              <tr>
                <th>字符</th>
                <th>转义后</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>&</td><td>&amp;amp;</td></tr>
              <tr><td>&lt;</td><td>&amp;lt;</td></tr>
              <tr><td>&gt;</td><td>&amp;gt;</td></tr>
              <tr><td>&quot;</td><td>&amp;quot;</td></tr>
              <tr><td>'</td><td>&amp;#x27;</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default HTMLEscape
