import { useState } from 'react'
import '../../common/ToolStyles.css'

function RegexTester() {
  const [pattern, setPattern] = useState('[a-z]+')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('Hello World 123')
  const [matches, setMatches] = useState<string[]>([])
  const [error, setError] = useState('')

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, flags)
      const result = text.match(regex)
      setMatches(result || [])
      setError('')
    } catch (e) {
      setError('无效的正则表达式')
      setMatches([])
    }
  }

  const commonPatterns = [
    { name: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' },
    { name: '手机号', pattern: '1[3-9]\d{9}' },
    { name: 'URL', pattern: 'https?://[^\s]+' },
    { name: 'IP地址', pattern: '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' },
    { name: '中文字符', pattern: '[\u4e00-\u9fa5]+' },
    { name: '数字', pattern: '\d+' },
  ]

  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">🔍</div>
        <h2>正则测试</h2>
        <p>测试和调试正则表达式</p>
      </div>

      <div className="tool-card-container">
        <div className="tool-input-group">
          <label>正则表达式</label>
          <div className="regex-input-row">
            <span className="regex-slash">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="输入正则表达式"
              className="regex-pattern"
            />
            <span className="regex-slash">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="flags"
              className="regex-flags"
            />
          </div>
        </div>

        <div className="common-patterns">
          <label>常用表达式</label>
          <div className="pattern-tags">
            {commonPatterns.map((p, i) => (
              <button
                key={i}
                className="pattern-tag"
                onClick={() => setPattern(p.pattern)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="tool-input-group">
          <label>测试文本</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入要测试的文本..."
            rows={4}
          />
        </div>

        <button className="tool-button primary" onClick={testRegex} style={{ width: '100%' }}>
          测试匹配
        </button>

        {error && (
          <div className="regex-error">
            {error}
          </div>
        )}

        {matches.length > 0 && !error && (
          <div className="regex-result">
            <div className="result-header">
              匹配结果 ({matches.length}个)
            </div>
            <div className="match-list">
              {matches.map((match, index) => (
                <div key={index} className="match-item">
                  <span className="match-number">#{index + 1}</span>
                  <span className="match-text">{match}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {matches.length === 0 && !error && pattern && (
          <div className="regex-no-match">
            未找到匹配项
          </div>
        )}
      </div>
    </div>
  )
}

export default RegexTester
