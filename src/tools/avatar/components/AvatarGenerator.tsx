import { useState } from 'react'
import '../../common/ToolStyles.css'

const avatarStyles = ['🎨', '👤', '🤖', '🐱', '🐶', '🦊', '🐼', '🐨']
const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

function AvatarGenerator() {
  const [style, setStyle] = useState(0)
  const [color, setColor] = useState(0)
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000))
  
  const generate = () => {
    setSeed(Math.floor(Math.random() * 1000))
  }
  
  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">👤</div>
        <h2>头像生成</h2>
        <p>生成趣味头像</p>
      </div>
      
      <div className="tool-card-container">
        <div 
          style={{ 
            width: '120px', 
            height: '120px', 
            background: colors[color],
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            margin: '0 auto 24px'
          }}
        >
          {avatarStyles[style]}
        </div>
        
        <div className="tool-input-group">
          <label>样式</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {avatarStyles.map((s, i) => (
              <button
                key={i}
                onClick={() => setStyle(i)}
                style={{
                  width: '44px',
                  height: '44px',
                  fontSize: '24px',
                  border: style === i ? '2px solid #3b82f6' : '1px solid #374151',
                  borderRadius: '8px',
                  background: style === i ? 'rgba(59, 130, 246, 0.2)' : '#111827',
                  cursor: 'pointer'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        
        <div className="tool-input-group">
          <label>颜色</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {colors.map((c, i) => (
              <button
                key={i}
                onClick={() => setColor(i)}
                style={{
                  width: '44px',
                  height: '44px',
                  background: c,
                  border: color === i ? '2px solid white' : 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>
        
        <button className="tool-button" onClick={generate} style={{ width: '100%', marginTop: '12px' }}>
          重新生成
        </button>
      </div>
    </div>
  )
}

export default AvatarGenerator
