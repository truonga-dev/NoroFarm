"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Loader2 } from "lucide-react"
import { authService } from "@/api/services/auth.service"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, setAuth, logout } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // 1. Chờ Zustand persist hydrate xong
      if (!useAuthStore.persist.hasHydrated()) {
        await new Promise<void>(resolve => {
          const unsub = useAuthStore.persist.onFinishHydration(() => {
            unsub()
            resolve()
          })
        })
      }

      if (!isMounted) return;

      const currentState = useAuthStore.getState()
      
      // 2. Kiểm tra nếu localStorage không có auth
      if (!currentState.isAuthenticated) {
        // Do có thể middleware bắt cookie và cho qua, ta thử fetch profile lại
        try {
          const response = await authService.getMe()
          const userData = response?.data || response
          if (userData && isMounted) {
            setAuth(userData)
            setIsChecking(false)
            return
          }
        } catch (error) {
          // Xóa cookie bên phía server nếu token hết hạn / không hợp lệ
          try {
             await authService.logout()
          } catch(e) {}
          if (isMounted) logout()
        }
        
        // 3. Redirect về login nếu thực sự chưa đăng nhập
        if (isMounted) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
        }
      } else {
        if (isMounted) setIsChecking(false)
      }
    }

    checkAuth()

    return () => {
      isMounted = false;
    }
  }, [pathname, router, setAuth, logout])

  if (isChecking) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Đang kiểm tra thông tin đăng nhập...</p>
        </div>
      </div>
    )
  }

  // Tránh render UI một khoảnh khắc trước khi redirect hoàn thành
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
