import { useState } from 'react'
import './Settings.css'

function Settings() {
  const [theme, setTheme] = useState('dark')

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>⚙️ 系统设置</h1>
        <p>自定义您的使用偏好</p>
      </div>

      <section className="settings-section">
        <h2>🎨 外观设置</h2>
        <div className="setting-item">
          <label>主题模式</label>
          <div className="theme-options">
            <button 
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <span>🌙</span>
              <span>暗色</span>
            </button>
            <button 
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <span>☀️</span>
              <span>亮色</span>
            </button>
            <button 
              className={`theme-btn ${theme === 'auto' ? 'active' : ''}`}
              onClick={() => setTheme('auto')}
            >
              <span>💻</span>
              <span>跟随系统</span>
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>⌨️ 快捷键</h2>
        <div className="shortcut-list">
          <div className="shortcut-item">
            <span className="shortcut-name">全局搜索</span>
            <div className="shortcut-keys">
              <kbd>Ctrl</kbd><kbd>K</kbd>
            </div>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-name">显示主窗口</span>
            <div className="shortcut-keys">
              <kbd>Ctrl</kbd><kbd>\</kbd>
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>ℹ️ 关于</h2>
        <div className="about-info">
          <div className="app-info">
            <span className="app-icon">🔧</span>
            <div>
              <h3>ToolsOne</h3>
              <p>您的数字瑞士军刀</p>
              <span className="version">v1.1.0</span>
            </div>
          </div>
          <button className="check-update-btn">检查更新</button>
        </div>
      </section>
    </div>
  )
}

export default Settings
