import { apiClient } from '../client'

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  reply: string
  suggestions: string[]
  model?: string
  timestamp?: string
}

export const aiService = {
  chat: async (
    message: string,
    history: ChatMessage[] = []
  ): Promise<ChatResponse> => {
    try {
      // First try NoroFarm Backend API: POST /api/v1/ai/chat
      const response = await apiClient.post<{ data: ChatResponse }>(
        '/ai/chat',
        {
          message,
          history,
        }
      )
      return response.data
    } catch (backendError) {
      console.warn(
        'Backend /ai/chat failed, falling back to Next.js API route:',
        backendError
      )
      // Fallback to Next.js API Route /api/ai/chat
      const fallbackRes = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      })
      if (!fallbackRes.ok) {
        throw new Error('Không thể kết nối tới NoroFarm AI lúc này.')
      }
      const data = await fallbackRes.json()
      return data
    }
  },

  getSuggestions: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<{ data: string[] }>(
        '/ai/suggestions'
      )
      return response.data || []
    } catch {
      return [
        'Giá cà phê Tây Nguyên hôm nay thế nào?',
        'Thời tiết tuần này có thích hợp bón phân không?',
        'Cách phòng ngừa rệp sáp và nấm hồng?',
        'So sánh giá nông sản nội địa và sàn thế giới',
      ]
    }
  },
}
