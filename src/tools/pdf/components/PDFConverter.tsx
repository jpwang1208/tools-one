import '../../common/ToolStyles.css'

function PDFConverter() {
  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">📄</div>
        <h2>PDF 转换</h2>
        <p>PDF 与 Word、Excel、PPT 互转</p>
      </div>
      
      <div className="tool-card-container">
        <div className="placeholder-notice">
          <span className="icon">🔧</span>
          <h3>功能开发中</h3>
          <p>PDF 转换功能需要后端支持，正在开发中...</p>
        </div>
      </div>
    </div>
  )
}

export default PDFConverter
