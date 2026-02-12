import { FC } from 'react'

export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  component: FC
  categoryId?: string
  hot?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  tools: Tool[]
}