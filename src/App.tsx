import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { tools, getToolById } from './tools'
import './App.css'

function App() {
  const [activeTool, setActiveTool] = useState(tools[0]?.id || '')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const currentTool = getToolById(activeTool)
  const ToolComponent = currentTool?.component

  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        tools={tools}
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="main-content">
        {ToolComponent ? (
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
