import { Category, Tool } from '../types'
import './Dashboard.css'

interface DashboardProps {
  categories: Category[]
  onSelectTool: (toolId: string) => void
}

const recentTools = [
  { id: 'pdf-convert', name: 'PDF转Word', time: '10分钟前' },
  { id: 'timestamp', name: 'Unix时间戳', time: '25分钟前' },
  { id: 'color', name: '屏幕取色器', time: '1小时前' },
  { id: 'password-gen', name: '密码生成器', time: '2小时前' }
]

const favorites = ['password-gen', 'timestamp', 'qrcode', 'json-format', 'encrypt']

function Dashboard({ categories, onSelectTool }: DashboardProps) {
  const allTools = categories.flatMap(c => c.tools)
  const hotTools = allTools.filter(t => t.hot)
  const favoriteTools = favorites
    .map(id => allTools.find(t => t.id === id))
    .filter(Boolean)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" 
            alt="User" 
            className="welcome-avatar"
          />
          <div className="welcome-text">
            <h1>欢迎回来，张三</h1>
            <p>今天已使用 <span>12</span> 个工具，处理 <span>28</span> 个任务</p>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🔧</span>
            <span className="stat-value">156</span>
            <span className="stat-label">总使用次数</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <span className="stat-value">98%</span>
            <span className="stat-label">成功率</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">2.3s</span>
            <span className="stat-label">平均处理时间</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💾</span>
            <span className="stat-value">1.2GB</span>
            <span className="stat-label">节省存储空间</span>
          </div>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>⚡ 快捷工具</h2>
        <div className="quick-tools-grid">
          <button className="quick-tool-card" onClick={() => onSelectTool('password-gen')}>
            <span className="quick-tool-icon">🔑</span>
            <span className="quick-tool-name">密码生成</span>
            <span className="quick-tool-desc">安全随机</span>
          </button>
          <button className="quick-tool-card" onClick={() => onSelectTool('timestamp')}>
            <span className="quick-tool-icon">🕐</span>
            <span className="quick-tool-name">时间戳</span>
            <span className="quick-tool-desc">快速转换</span>
          </button>
          <button className="quick-tool-card" onClick={() => onSelectTool('qrcode')}>
            <span className="quick-tool-icon">📱</span>
            <span className="quick-tool-name">二维码</span>
            <span className="quick-tool-desc">扫码分享</span>
          </button>
          <button className="quick-tool-card" onClick={() => onSelectTool('json-format')}>
            <span className="quick-tool-icon">📋</span>
            <span className="quick-tool-name">JSON</span>
            <span className="quick-tool-desc">格式化</span>
          </button>
          <button className="quick-tool-card" onClick={() => onSelectTool('encrypt')}>
            <span className="quick-tool-icon">🔐</span>
            <span className="quick-tool-name">加密解密</span>
            <span className="quick-tool-desc">AES/RSA</span>
          </button>
          <button className="quick-tool-card" onClick={() => onSelectTool('base64')}>
            <span className="quick-tool-icon">📦</span>
            <span className="quick-tool-name">Base64</span>
            <span className="quick-tool-desc">编码解码</span>
          </button>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>📁 所有工具</h2>
        <div className="tools-grid">
          {allTools.map(tool => (
            <button
              key={tool.id}
              className={`tool-card ${tool.hot ? 'hot' : ''}`}
              onClick={() => onSelectTool(tool.id)}
            >
              <span className="tool-card-icon">{tool.icon}</span>
              <span className="tool-card-name">{tool.name}</span>
              <span className="tool-card-desc">{tool.description}</span>
              <span className="tool-card-category">{categories.find(c => c.id === tool.categoryId)?.name}</span>
              {tool.hot && <span className="hot-badge">🔥</span>}
            </button>
          ))}
        </div>
      </section>

      <div className="bottom-grid">
        <div className="recent-section">
          <div className="section-header">
            <h3>📚 最近使用</h3>
            <a href="#" className="more-link">查看全部 →</a>
          </div>
          <div className="recent-list">
            {recentTools.map((item, index) => (
              <button key={index} className="recent-item" onClick={() => onSelectTool(item.id)}>
                <span className="recent-icon">📄</span>
                <div className="recent-info">
                  <span className="recent-name">{item.name}</span>
                  <span className="recent-time">{item.time}</span>
                </div>
                <span>›</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="favorites-section">
          <div className="section-header">
            <h3>⭐ 我的收藏</h3>
            <a href="#" className="more-link">查看全部 →</a>
          </div>
          <div className="favorites-grid">
            {favoriteTools.slice(0, 4).map((tool, index) => tool && (
              <button key={index} className="favorite-item" onClick={() => onSelectTool(tool.id)}>
                <span className="favorite-icon">⭐</span>
                <span className="favorite-name">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
