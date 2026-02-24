import { useState } from 'react'
import '../../common/ToolStyles.css'
import './TextDiff.css'

function TextDiff() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diffResult, setDiffResult] = useState<{type: 'same' | 'added' | 'removed', text: string}[]>([])

  const calculateDiff = () => {
    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    const result: {type: 'same' | 'added' | 'removed', text: string}[] = []
    
    const maxLines = Math.max(lines1.length, lines2.length)
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || ''
      const line2 = lines2[i] || ''
      
      if (line1 === line2) {
        result.push({ type: 'same', text: line1 })
      } else {
        if (line1) result.push({ type: 'removed', text: '- ' + line1 })
        if (line2) result.push({ type: 'added', text: '+ ' + line2 })
      }
    }
    
    setDiffResult(result)
  }

  const clearAll = () => {
    setText1('')
    setText2('')
    setDiffResult([])
  }

  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">📊</div>
        <h2>文本对比</h2>
        <p>对比两段文本的差异</p>
      </div>

      <div className="tool-card-container">
        <div className="diff-inputs">
          <div className="diff-input-group">
            <label>原文本</label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="输入第一段文本..."
              rows={8}
            />
          </div>
          <div className="diff-input-group">
            <label>对比文本</label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="输入第二段文本..."
              rows={8}
            />
          </div>
        </div>

        <div className="tool-button-group">
          <button className="tool-button primary" onClick={calculateDiff}>
            对比差异
          </button>
          <button className="tool-button" onClick={clearAll}>
            清空
          </button>
        </div>

        {diffResult.length > 0 && (
          <div className="diff-result">
            <div className="diff-result-header">
              <span className="legend">
                <span className="dot removed"></span>删除
                <span className="dot added"></span>新增
              </span>
            </div>
            <div className="diff-lines">
              {diffResult.map((line, index) => (
                <div key={index} className={`diff-line ${line.type}`}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TextDiff
