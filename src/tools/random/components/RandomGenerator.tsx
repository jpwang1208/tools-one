import { useState } from 'react'
import '../../common/ToolStyles.css'
import './RandomGenerator.css'

function RandomGenerator() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(1)
  const [unique, setUnique] = useState(false)
  const [results, setResults] = useState<number[]>([])

  const generateRandom = () => {
    const newResults: number[] = []
    const range = max - min + 1
    
    if (unique && count > range) {
      alert(`范围 ${min}-${max} 只能生成 ${range} 个不重复的数字`)
      return
    }
    
    while (newResults.length < count) {
      const num = Math.floor(Math.random() * range) + min
      if (!unique || !newResults.includes(num)) {
        newResults.push(num)
      }
    }
    
    setResults(newResults)
  }

  const generateUUID = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
    setResults([uuid as any])
  }

  const generateString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < (count || 16); i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setResults([result as any])
  }

  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">🎲</div>
        <h2>随机生成</h2>
        <p>生成随机数、UUID、随机字符串</p>
      </div>

      <div className="tool-card-container">
        <div className="quick-actions">
          <button className="quick-btn" onClick={generateUUID}>
            <span>🆔</span>
            生成UUID
          </button>
          <button className="quick-btn" onClick={generateString}>
            <span>🔤</span>
            随机字符串
          </button>
        </div>

        <div className="random-options">
          <div className="option-row">
            <div className="option-group">
              <label>最小值</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="option-group">
              <label>最大值</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="option-group">
              <label>数量</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                min={1}
                max={100}
              />
            </div>
          </div>

          <div className="option-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={unique}
                onChange={(e) => setUnique(e.target.checked)}
              />
              <span>不重复</span>
            </label>
          </div>
        </div>

        <button className="tool-button primary" onClick={generateRandom} style={{ width: '100%' }}>
          生成随机数
        </button>

        {results.length > 0 && (
          <div className="random-results">
            <div className="results-header">
              生成结果
              <button 
                className="copy-all"
                onClick={() => navigator.clipboard.writeText(results.join('\n'))}
              >
                复制全部
              </button>
            </div>
            <div className="results-list">
              {results.map((result, index) => (
                <div key={index} className="result-item">
                  <span className="result-index">#{index + 1}</span>
                  <span className="result-value">{String(result)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RandomGenerator
