import { Tool } from '../types'
import JSONFormatter from './json/components/JSONFormatter'

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: 'JSON 格式化、验证、压缩工具',
    icon: '🔧',
    component: JSONFormatter
  }
]

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id)
}
