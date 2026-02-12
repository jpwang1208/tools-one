import { Tool, Category } from '../types'
import JSONFormatter from './json/components/JSONFormatter'
import CryptoTool from './crypto/components/CryptoTool'

// 定义所有工具
const allTools: Tool[] = [
  // JSON 工具
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: 'JSON 格式化、验证、压缩工具',
    icon: '🔧',
    component: JSONFormatter,
    categoryId: 'office',
    hot: true
  },
  // 加密工具
  {
    id: 'crypto',
    name: '加密工具',
    description: '常用算法加解密、编码转换、密钥生成',
    icon: '🔐',
    component: CryptoTool,
    categoryId: 'security',
    hot: true
  },
  {
    id: 'password-gen',
    name: '密码生成',
    description: '安全随机密码生成',
    icon: '🔑',
    component: CryptoTool, // 复用 crypto 组件
    categoryId: 'security',
    hot: true
  },
  {
    id: 'timestamp',
    name: '时间戳',
    description: 'Unix时间戳与日期格式转换',
    icon: '🕐',
    component: CryptoTool,
    categoryId: 'dev',
    hot: true
  },
  {
    id: 'uuid',
    name: 'UUID生成',
    description: '唯一标识符生成',
    icon: '🆔',
    component: CryptoTool,
    categoryId: 'dev',
    hot: true
  },
  {
    id: 'qrcode',
    name: '二维码',
    description: 'QR码生成',
    icon: '📱',
    component: CryptoTool,
    categoryId: 'creative',
    hot: true
  }
]

// 定义分类
export const categories: Category[] = [
  {
    id: 'office',
    name: '办公效率',
    icon: '💼',
    color: 'blue',
    tools: allTools.filter(t => t.categoryId === 'office')
  },
  {
    id: 'security',
    name: '数据安全',
    icon: '🛡️',
    color: 'green',
    tools: allTools.filter(t => t.categoryId === 'security')
  },
  {
    id: 'dev',
    name: '开发工具',
    icon: '💻',
    color: 'purple',
    tools: allTools.filter(t => t.categoryId === 'dev')
  },
  {
    id: 'lifestyle',
    name: '生活实用',
    icon: '🏠',
    color: 'orange',
    tools: []
  },
  {
    id: 'creative',
    name: '创意设计',
    icon: '🎨',
    color: 'pink',
    tools: allTools.filter(t => t.categoryId === 'creative')
  },
  {
    id: 'media',
    name: '媒体处理',
    icon: '🎬',
    color: 'red',
    tools: []
  }
]

// 展平工具列表（保持向后兼容）
export const tools: Tool[] = allTools

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id)
}
