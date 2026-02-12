import { useState } from 'react'
import { Category } from '../types'
import './Search.css'

interface SearchProps {
  categories: Category[]
  onSelectTool: (toolId: string) => void
}

function Search({ categories, onSelectTool }: SearchProps) {
  const [query, setQuery] = useState('')

  const allTools = categories.flatMap(c => c.tools)
  const filteredTools = query 
    ? allTools.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
      )
    : allTools

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>搜索工具</h1>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="搜索工具名称、功能或描述..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="search-shortcut">
            <kbd>Ctrl</kbd><kbd>K</kbd>
          </div>
        </div>
      </div>

      <div className="search-results">
        {filteredTools.length === 0 ? (
          <div className="search-empty">
            <span className="empty-icon">🔍</span>
            <p>未找到相关工具</p>
          </div>
        ) : (
          <div className="tools-grid">
            {filteredTools.map(tool => (
              <button
                key={tool.id}
                className="tool-card"
                onClick={() => onSelectTool(tool.id)}
              >
                <span className="tool-icon">{tool.icon}</span>
                <div className="tool-info">
                  <span className="tool-name">{tool.name}</span>
                  <span className="tool-desc">{tool.description}</span>
                </div>
                {tool.hot && <span className="hot-badge">🔥</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
