import { useState } from 'react'
import { Category } from '../types'
import { useTheme } from '../context/ThemeContext'
import { APP_VERSION, APP_NAME, APP_DESCRIPTION } from '../config/version'
import './Sidebar.css'

interface SidebarProps {
  categories: Category[]
  activeTool: string
  onSelectTool: (toolId: string) => void
  onShowDashboard: () => void
  onShowSearch: () => void
  onShowFavorites: () => void
  onShowHistory: () => void
  onShowSettings: () => void
  onShowHelp: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

function Sidebar({ 
  categories, activeTool, onSelectTool, onShowDashboard, onShowSearch, 
  onShowFavorites, onShowHistory, onShowSettings, onShowHelp,
  collapsed, onToggleCollapse 
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({})

  const toggleCategory = (catId: string) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="header-top">
          {!collapsed && <h2>{APP_NAME}</h2>}
          <button
            className="collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            <span className="collapse-icon">{collapsed ? '→' : '←'}</span>
          </button>
        </div>
        {!collapsed && <p>{APP_DESCRIPTION}</p>}
      </div>

      {!collapsed && (
        <div className="search-box">
          <button className="search-btn" onClick={onShowSearch}>
            <span className="search-icon">🔍</span>
            <span className="search-placeholder">搜索工具... (Ctrl+K)</span>
          </button>
        </div>
      )}

      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <div className="nav-section-title">收藏与历史</div>}
          <button
            className={`nav-item ${activeTool === 'favorites' ? 'active' : ''}`}
            onClick={onShowFavorites}
            title={collapsed ? '我的收藏' : ''}
          >
            <span className="nav-icon">⭐</span>
            {!collapsed && <><span className="nav-text">我的收藏</span><span className="nav-badge yellow">5</span></>}
          </button>
          <button
            className={`nav-item ${activeTool === 'history' ? 'active' : ''}`}
            onClick={onShowHistory}
            title={collapsed ? '使用历史' : ''}
          >
            <span className="nav-icon">📚</span>
            {!collapsed && <><span className="nav-text">使用历史</span><span className="nav-badge blue">28</span></>}
          </button>
        </div>

        <div className="nav-section">
          {!collapsed && <div className="nav-section-title">工具分类</div>}
          
          <button
            className={`nav-item ${!activeTool ? 'active' : ''}`}
            onClick={onShowDashboard}
            title={collapsed ? '首页' : ''}
          >
            <span className="nav-icon">🏠</span>
            {!collapsed && <span className="nav-text">首页</span>}
          </button>

          {categories.map(category => (
            <div key={category.id} className="category-group">
              <button
                className="category-toggle"
                onClick={() => toggleCategory(category.id)}
                title={collapsed ? category.name : ''}
              >
                <span className="nav-icon">{category.icon}</span>
                {!collapsed && (
                  <>
                    <span className="nav-text">{category.name}</span>
                    <span className="chevron">{expandedCats[category.id] ? '▼' : '▶'}</span>
                  </>
                )}
              </button>
              
              {(!collapsed && expandedCats[category.id]) && (
                <div className="category-tools">
                  {category.tools.map(tool => (
                    <button
                      key={tool.id}
                      className={`tool-item ${activeTool === tool.id ? 'active' : ''}`}
                      onClick={() => onSelectTool(tool.id)}
                    >
                      <span className="tool-icon">{tool.icon}</span>
                      <span className="tool-name">{tool.name}</span>
                      {tool.hot && <span className="hot-badge">🔥</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <>
            <button className="footer-item" onClick={onShowSettings}>
              <span className="footer-icon">⚙️</span>
              <span className="footer-text">设置</span>
            </button>
            <button className="footer-item" onClick={onShowHelp}>
              <span className="footer-icon">❓</span>
              <span className="footer-text">帮助中心</span>
            </button>
            <button className="footer-item" onClick={() => {}}>
              <span className="footer-icon">ℹ️</span>
              <span className="footer-text">关于</span>
            </button>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
              <span className="theme-text">{theme === 'dark' ? '浅色主题' : '暗色主题'}</span>
            </button>
          </>
        )}
        <span className="version">{collapsed ? 'v1' : `v${APP_VERSION}`}</span>
      </div>
    </div>
  )
}

export default Sidebar
