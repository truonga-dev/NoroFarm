"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useCurrentUser } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const { data: user, isLoading } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated (from local store), redirect immediately
    if (!isAuthenticated) {
      router.push("/admin-login")
      return
    }

    // Wait for user fetch, then verify role
    if (!isLoading && user) {
      const isAdmin = user.roles?.some((r: any) => r.name === "admin")
      if (!isAdmin) {
        router.push("/dashboard") // Non-admins go to standard dashboard
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  const isAdmin = user?.roles?.some((r: any) => r.name === "admin")
  if (!isAuthenticated || isLoading || (user && !isAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
