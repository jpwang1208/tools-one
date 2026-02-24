import { useState } from 'react'
import '../../common/ToolStyles.css'

function ColorPicker() {
  const [color, setColor] = useState('#3b82f6')
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }
  
  const rgb = hexToRgb(color)
  
  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon" style={{ background: color }}>🎨</div>
        <h2>取色器</h2>
        <p>屏幕颜色拾取与转换</p>
      </div>
      
      <div className="tool-card-container">
        <div className="tool-input-group">
          <label>选择颜色</label>
          <input 
            type="color" 
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ height: '60px', cursor: 'pointer' }}
          />
        </div>
        
        <div className="tool-result">
          <div className="tool-result-label">HEX</div>
          <div className="tool-result-value">{color.toUpperCase()}</div>
        </div>
        
        <div className="tool-result">
          <div className="tool-result-label">RGB</div>
          <div className="tool-result-value">rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
        </div>
      </div>
    </div>
  )
}

export default ColorPicker
