import { Tool } from '../types'
import { useTheme } from '../context/ThemeContext'
import './Sidebar.css'

interface SidebarProps {
  tools: Tool[]
  activeTool: string
  onSelectTool: (toolId: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

function Sidebar({ tools, activeTool, onSelectTool, collapsed, onToggleCollapse }: SidebarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="header-top">
          {!collapsed && <h2>Tools One</h2>}
          <button 
            className="collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            <span className="collapse-icon">{collapsed ? '→' : '←'}</span>
          </button>
        </div>
        {!collapsed && <p>开发者工具集</p>}
      </div>

      <nav className="tool-list">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tool-item ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => onSelectTool(tool.id)}
            title={collapsed ? tool.name : ''}
          >
            <span className="tool-icon">{tool.icon}</span>
            {!collapsed && (
              <div className="tool-info">
                <span className="tool-name">{tool.name}</span>
                <span className="tool-desc">{tool.description}</span>
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
          >
            <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="theme-text">{theme === 'dark' ? '浅色' : '深色'}</span>
          </button>
        )}
        <span className="version">{collapsed ? 'v1' : 'v1.0.1'}</span>
      </div>
    </div>
  )
}

export default Sidebar