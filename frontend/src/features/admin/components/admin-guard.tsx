'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { authService } from '@/api/services/auth.service'
import { useAuthStore } from '@/store/authStore'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { setAuth, logout } = useAuthStore()
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>(
    'checking'
  )

  useEffect(() => {
    let active = true

    async function verifyAdmin() {
      if (!useAuthStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
            unsubscribe()
            resolve()
          })
        })
      }

      if (!active) return

      try {
        // Luôn xác minh lại với máy chủ. Zustand chỉ dùng để hiển thị nhanh,
        // không phải nguồn quyết định quyền quản trị.
        const response = await authService.getMe()
        const user = response?.data || response
        const isAdmin =
          user?.roles?.some((role: any) => role.name === 'admin') ||
          user?.is_superuser === true

        if (!active) return

        if (!isAdmin) {
          if (user) setAuth(user)
          setStatus('denied')
          router.replace('/dashboard')
          return
        }

        setAuth(user)
        setStatus('allowed')
      } catch {
        if (!active) return
        logout()
        setStatus('denied')
        router.replace(`/admin-login?redirect=${encodeURIComponent(pathname)}`)
      }
    }

    verifyAdmin()
    return () => {
      active = false
    }
  }, [logout, pathname, router, setAuth])

  if (status !== 'allowed') {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground flex flex-col items-center gap-3 text-center">
          <Loader2 className="text-primary h-7 w-7 animate-spin" />
          <p className="text-sm">
            {status === 'checking'
              ? 'Đang xác minh quyền quản trị...'
              : 'Đang chuyển hướng...'}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
