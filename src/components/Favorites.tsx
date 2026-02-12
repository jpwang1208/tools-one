import { Category } from '../types'
import './Favorites.css'

interface FavoritesProps {
  categories: Category[]
  onSelectTool: (toolId: string) => void
}

const defaultFavorites = ['password-gen', 'timestamp', 'qrcode', 'json-format', 'encrypt']

function Favorites({ categories, onSelectTool }: FavoritesProps) {
  const allTools = categories.flatMap(c => c.tools)
  const favoriteTools = defaultFavorites
    .map(id => allTools.find(t => t.id === id))
    .filter(Boolean)

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1>⭐ 我的收藏</h1>
        <p>您收藏的工具将显示在这里</p>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">⭐</span>
          <p>暂无收藏的工具</p>
          <button onClick={() => {}}>去收藏一些工具</button>
        </div>
      ) : (
        <div className="tools-grid">
          {favoriteTools.map(tool => tool && (
            <button
              key={tool.id}
              className="tool-card"
              onClick={() => onSelectTool(tool.id)}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-name">{tool.name}</span>
              <span className="tool-desc">{tool.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
