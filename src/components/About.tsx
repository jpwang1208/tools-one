import './About.css'

function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="about-logo">
          <span className="logo-icon">🔧</span>
          <h1>ToolsOne</h1>
        </div>
        <p className="about-tagline">您的数字瑞士军刀</p>
        <span className="about-version">v1.1.0</span>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>关于 ToolsOne</h2>
          <p>
            ToolsOne 是一款功能强大的桌面工具集合应用，致力于为用户提供便捷的数字化工具。
            无论是日常办公、数据安全、开发辅助还是生活实用，ToolsOne 都能满足您的需求。
          </p>
        </section>

        <section className="about-section">
          <h2>主要功能</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">💼</span>
              <span className="feature-name">办公效率</span>
              <span className="feature-count">5 个工具</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <span className="feature-name">数据安全</span>
              <span className="feature-count">3 个工具</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💻</span>
              <span className="feature-name">开发工具</span>
              <span className="feature-count">3 个工具</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏠</span>
              <span className="feature-name">生活实用</span>
              <span className="feature-count">6 个工具</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <span className="feature-name">创意设计</span>
              <span className="feature-count">5 个工具</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎬</span>
              <span className="feature-name">媒体处理</span>
              <span className="feature-count">4 个工具</span>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>技术特点</h2>
          <ul className="tech-list">
            <li>🔒 本地处理，保护隐私</li>
            <li>⚡ 快速响应，高效处理</li>
            <li>🎨 精美界面，简洁易用</li>
            <li>🔧 持续更新，不断完善</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>联系我们</h2>
          <p>
            如有问题或建议，欢迎通过 GitHub 反馈。
          </p>
          <a href="#" className="github-link">
            📱 访问 GitHub 仓库
          </a>
        </section>
      </div>

      <div className="about-footer">
        <p>© 2024 ToolsOne. All rights reserved.</p>
      </div>
    </div>
  )
}

export default About
