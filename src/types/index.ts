import { FC } from 'react'

export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  component: FC
}