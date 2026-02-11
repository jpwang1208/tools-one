export interface JSONResult {
  success: boolean
  data?: string
  error?: string
}

export interface JSONHistoryItem {
  id: string
  timestamp: number
  preview: string
  content: string
}
