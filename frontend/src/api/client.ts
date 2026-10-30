// Native fetch-based API client — no axios dependency required

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'

export const getAssetUrl = (url?: string | null) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const baseUrl = API_URL.replace('/api/v1', '')
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

class ApiError extends Error {
  status: number
  data: any
  constructor(message: string, status: number, data?: any) {
    super(message)
    this.status = status
    this.data = data
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path}`

  const isFormData = options.body instanceof FormData
  const hasBody = options.body !== undefined && options.body !== null
  // GET/HEAD không cần Content-Type. Tránh tạo CORS preflight không cần thiết
  // cho các truy vấn đọc dữ liệu như watchlist và thông tin dashboard.
  const defaultHeaders: HeadersInit =
    !isFormData && hasBody
      ? {
          'Content-Type': 'application/json',
        }
      : {}

  const config: RequestInit = {
    credentials: 'include', // Sends HttpOnly cookies automatically
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage')
        if (!window.location.pathname.startsWith('/login')) {
          // Call logout endpoint to clear HttpOnly cookies from the browser
          fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          }).finally(() => {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
          })
        }
      }
    }

    let errorData: any = {}
    try {
      errorData = await response.json()
    } catch {}
    throw new ApiError(
      errorData?.detail || errorData?.message || `HTTP ${response.status}`,
      response.status,
      errorData
    )
  }

  // Handle 204 No Content
  if (response.status === 204) return {} as T

  return response.json()
}

export const apiClient = {
  get: <T = any>(path: string, params?: Record<string, any>) => {
    let url = path
    if (params) {
      const qs = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString()
      if (qs) url = `${path}?${qs}`
    }
    return request<T>(url, { method: 'GET' })
  },

  post: <T = any>(path: string, body?: any) =>
    request<T>(path, {
      method: 'POST',
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    }),

  put: <T = any>(path: string, body?: any) =>
    request<T>(path, {
      method: 'PUT',
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    }),

  patch: <T = any>(path: string, body?: any) =>
    request<T>(path, {
      method: 'PATCH',
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
    }),

  delete: <T = any>(path: string) => request<T>(path, { method: 'DELETE' }),
}
