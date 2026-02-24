import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'
import '../../common/ToolStyles.css'

function QRCodeTool() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).catch(() => {})
    }
  }, [text, size])
  
  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    }
  }
  
  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">📱</div>
        <h2>二维码生成</h2>
        <p>将文本或链接生成二维码</p>
      </div>
      
      <div className="tool-card-container">
        <div className="tool-input-group">
          <label>内容</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入文本或链接..."
            rows={4}
          />
        </div>
        
        <div className="tool-input-group">
          <label>尺寸: {size}px</label>
          <input 
            type="range" 
            min="128" 
            max="512" 
            step="64"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <canvas ref={canvasRef} style={{ borderRadius: '8px' }} />
        </div>
        
        <button className="tool-button" onClick={downloadQR} style={{ width: '100%' }}>
          下载二维码
        </button>
      </div>
    </div>
  )
}

export default QRCodeTool
