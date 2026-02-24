import '../../common/ToolStyles.css'

function OCRTool() {
  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">📷</div>
        <h2>OCR 识别</h2>
        <p>图片文字提取与识别</p>
      </div>
      
      <div className="tool-card-container">
        <div className="placeholder-notice">
          <span className="icon">🔧</span>
          <h3>功能开发中</h3>
          <p>OCR 识别功能需要 AI 模型支持，正在开发中...</p>
        </div>
      </div>
    </div>
  )
}

export default OCRTool
