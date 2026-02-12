import './Help.css'

function Help() {
  return (
    <div className="help-page">
      <div className="page-header">
        <h1>❓ 帮助中心</h1>
        <p>了解如何使用 ToolsOne</p>
      </div>

      <section className="help-section">
        <h2>📖 常见问题</h2>
        <div className="faq-list">
          <details className="faq-item">
            <summary>如何开始使用？</summary>
            <p>从左侧边栏选择一个工具即可开始使用。您也可以使用搜索功能快速找到需要的工具。</p>
          </details>
          <details className="faq-item">
            <summary>数据是否安全？</summary>
            <p>ToolsOne 在本地处理所有数据，不会上传到服务器。您的隐私安全受到保护。</p>
          </details>
          <details className="faq-item">
            <summary>如何收藏工具？</summary>
            <p>点击工具卡片上的星标图标即可收藏。收藏的工具会显示在"我的收藏"页面中。</p>
          </details>
        </div>
      </section>

      <section className="help-section">
        <h2>⌨️ 快捷键</h2>
        <div className="shortcut-list">
          <div className="shortcut-item">
            <span className="shortcut-name">全局搜索</span>
            <div className="shortcut-keys">
              <kbd>Ctrl</kbd><kbd>K</kbd>
            </div>
          </div>
        </div>
      </section>

      <section className="help-section">
        <h2>📞 联系我们</h2>
        <div className="contact-info">
          <p>如有问题或建议，请通过 GitHub 反馈。</p>
          <a href="#" className="github-link">📱 GitHub 仓库</a>
        </div>
      </section>
    </div>
  )
}

export default Help
