import { Category } from '../types'
import './History.css'

interface HistoryProps {
  categories: Category[]
  onSelectTool: (toolId: string) => void
}

const defaultHistory = [
  { id: 'pdf-convert', name: 'PDF转Word', time: '10分钟前' },
  { id: 'timestamp', name: 'Unix时间戳', time: '25分钟前' },
  { id: 'color', name: '屏幕取色器', time: '1小时前' },
  { id: 'password-gen', name: '密码生成器', time: '2小时前' }
]

function History({ categories, onSelectTool }: HistoryProps) {
  const allTools = categories.flatMap(c => c.tools)

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>📚 使用历史</h1>
        <p>您最近使用的工具记录</p>
      </div>

      <div className="history-list">
        {defaultHistory.map((item, index) => (
          <button
            key={index}
            className="history-item"
            onClick={() => onSelectTool(item.id)}
          >
            <span className="history-icon">📄</span>
            <div className="history-info">
              <span className="history-name">{item.name}</span>
              <span className="history-time">{item.time}</span>
            </div>
            <span className="chevron">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default History
