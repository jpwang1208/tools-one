import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import Help from './components/Help'
import Favorites from './components/Favorites'
import History from './components/History'
import Search from './components/Search'
import { tools, getToolById, categories } from './tools'
import './App.css'

function App() {
  const [activeTool, setActiveTool] = useState<string>('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const currentTool = activeTool ? getToolById(activeTool) : null
  const ToolComponent = currentTool?.component

  const showPage = (page: string) => {
    if (page === 'dashboard') setActiveTool('')
    else if (page === 'search' || page === 'favorites' || page === 'history' || page === 'settings' || page === 'help' || page === 'about') {
      setActiveTool(page)
    } else {
      setActiveTool(page)
    }
  }

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        categories={categories}
        activeTool={activeTool}
        onSelectTool={(toolId: string) => setActiveTool(toolId)}
        onShowDashboard={() => setActiveTool('')}
        onShowSearch={() => setActiveTool('search')}
        onShowFavorites={() => setActiveTool('favorites')}
        onShowHistory={() => setActiveTool('history')}
        onShowSettings={() => setActiveTool('settings')}
        onShowHelp={() => setActiveTool('help')}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="main-content">
        {!activeTool ? (
          <Dashboard 
            categories={categories}
            onSelectTool={(toolId: string) => setActiveTool(toolId)}
          />
        ) : activeTool === 'search' ? (
          <Search categories={categories} onSelectTool={(toolId: string) => setActiveTool(toolId)} />
        ) : activeTool === 'favorites' ? (
          <Favorites categories={categories} onSelectTool={(toolId: string) => setActiveTool(toolId)} />
        ) : activeTool === 'history' ? (
          <History categories={categories} onSelectTool={(toolId: string) => setActiveTool(toolId)} />
        ) : activeTool === 'settings' ? (
          <Settings />
        ) : activeTool === 'help' ? (
          <Help />
        ) : activeTool === 'about' ? (
          <Help />
        ) : ToolComponent ? (
          <ToolComponent />
        ) : (
          <div className="empty-state">
            <p>请选择一个工具</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
