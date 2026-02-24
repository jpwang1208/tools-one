import { Tool, Category } from '../types'
import JSONFormatter from './json/components/JSONFormatter'
import CryptoTool from './crypto/components/CryptoTool'
import Converter from './converter/components/Converter'
import Calculator from './calculator/components/Calculator'
import BMICalculator from './bmi/components/BMICalculator'
import Calendar from './calendar/components/Calendar'
import ColorPicker from './colorpicker/components/ColorPicker'
import CurrencyConverter from './currency/components/CurrencyConverter'
import TaxCalculator from './tax/components/TaxCalculator'
import QRCodeTool from './qrcode/components/QRCodeTool'
import AvatarGenerator from './avatar/components/AvatarGenerator'
import TextDiff from './textdiff/components/TextDiff'
import RegexTester from './regex/components/RegexTester'
import HTMLEscape from './htmlescape/components/HTMLEscape'
import RandomGenerator from './random/components/RandomGenerator'

const allTools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: 'JSON 格式化、验证、压缩工具',
    icon: '🔧',
    component: JSONFormatter,
    categoryId: 'office',
    hot: true
  },
  {
    id: 'text-diff',
    name: '文本对比',
    description: '对比两段文本的差异，高亮显示增删改',
    icon: '📊',
    component: TextDiff,
    categoryId: 'office',
    hot: true
  },
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
    component: CryptoTool,
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
    id: 'color',
    name: '取色器',
    description: '屏幕颜色拾取与转换',
    icon: '🎨',
    component: ColorPicker,
    categoryId: 'dev',
    hot: true
  },
  {
    id: 'regex',
    name: '正则测试',
    description: '正则表达式测试与调试',
    icon: '🔍',
    component: RegexTester,
    categoryId: 'dev',
    hot: true
  },
  {
    id: 'html-escape',
    name: 'HTML转义',
    description: 'HTML实体编码与解码',
    icon: '📝',
    component: HTMLEscape,
    categoryId: 'dev',
    hot: false
  },
  {
    id: 'converter',
    name: '单位换算',
    description: '长度、重量、温度、面积、体积转换',
    icon: '📏',
    component: Converter,
    categoryId: 'lifestyle',
    hot: true
  },
  {
    id: 'calculator',
    name: '计算器',
    description: '科学计算器',
    icon: '🧮',
    component: Calculator,
    categoryId: 'lifestyle',
    hot: true
  },
  {
    id: 'calendar',
    name: '日历',
    description: '日程管理',
    icon: '📅',
    component: Calendar,
    categoryId: 'lifestyle',
    hot: false
  },
  {
    id: 'bmi',
    name: 'BMI计算',
    description: '体重指数计算器',
    icon: '⚖️',
    component: BMICalculator,
    categoryId: 'lifestyle',
    hot: false
  },
  {
    id: 'currency',
    name: '汇率换算',
    description: '货币汇率换算',
    icon: '💱',
    component: CurrencyConverter,
    categoryId: 'lifestyle',
    hot: false
  },
  {
    id: 'tax',
    name: '个税计算',
    description: '工资个人所得税计算',
    icon: '💰',
    component: TaxCalculator,
    categoryId: 'lifestyle',
    hot: false
  },
  {
    id: 'qrcode',
    name: '二维码',
    description: 'QR码生成与下载',
    icon: '📱',
    component: QRCodeTool,
    categoryId: 'creative',
    hot: true
  },
  {
    id: 'avatar',
    name: '头像生成',
    description: '趣味头像生成器',
    icon: '👤',
    component: AvatarGenerator,
    categoryId: 'creative',
    hot: false
  },
  {
    id: 'random',
    name: '随机生成',
    description: '随机数、字符串、列表生成',
    icon: '🎲',
    component: RandomGenerator,
    categoryId: 'creative',
    hot: false
  }
]

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
    tools: allTools.filter(t => t.categoryId === 'lifestyle')
  },
  {
    id: 'creative',
    name: '创意设计',
    icon: '🎨',
    color: 'pink',
    tools: allTools.filter(t => t.categoryId === 'creative')
  }
]

export const tools: Tool[] = allTools

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id)
}
