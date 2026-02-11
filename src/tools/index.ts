import { Tool } from '../types'
import JSONFormatter from './json/components/JSONFormatter'
import CryptoTool from './crypto/components/CryptoTool'

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: 'JSON 格式化、验证、压缩工具',
    icon: '🔧',
    component: JSONFormatter
  },
  {
    id: 'crypto',
    name: '加密工具',
    description: '常用算法加解密、编码转换、密钥生成',
    icon: '🔐',
    component: CryptoTool
  }
]

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id)
}
