// Runtime validation coverage for: public price requests and chat response handling.
import { afterEach, describe, expect, it, vi } from 'vitest'

import { API_URL, apiClient } from './client'
import { aiService } from './services/ai.service'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('API client', () => {
  it('preserves the response envelope and sends commodity query parameters', async () => {
    const payload = { success: true, data: { items: [], total: 0 } }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiClient.get('/commodities', { size: 3 })).resolves.toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/commodities?size=3`,
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    )
  })

  it('reads chat data from the backend response envelope', async () => {
    const chat = { reply: 'Xin chào', suggestions: ['Giá cà phê'] }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: chat }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(aiService.chat('Giá cà phê?')).resolves.toEqual(chat)
  })

  it('reads suggestion data from the backend response envelope', async () => {
    const suggestions = ['Giá cà phê', 'Thời tiết']
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: suggestions }),
    }))

    await expect(aiService.getSuggestions()).resolves.toEqual(suggestions)
  })
})
