"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const PAGE_NAMES: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/news": "Tin tức",
  "/admin/prices": "Giá nông sản",
  "/admin/products": "Kho sản phẩm",
  "/admin/orders": "Đơn hàng B2C",
  "/admin/contacts": "Phản hồi khách hàng",
  "/admin/market": "Sàn giao dịch",
  "/admin/coffee": "Dữ liệu cà phê",
  "/admin/users": "Người dùng",
  "/admin/audit-logs": "Nhật ký hệ thống",
  "/admin/settings": "Cài đặt",
}

export function AdminHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const basePath = Object.keys(PAGE_NAMES).filter((path) => path !== "/admin" && pathname.startsWith(path)).sort((a, b) => b.length - a.length)[0]
  const pageName = PAGE_NAMES[pathname] || PAGE_NAMES[basePath] || "Quản trị"
  const fullName = user?.profile?.full_name || "Quản trị viên"

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">NoroFarm CMS</p>
        <p className="truncate text-sm font-semibold text-foreground">{pageName}</p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <Button variant="ghost" size="sm" asChild className="hidden gap-2 text-muted-foreground sm:flex">
          <Link href="/" target="_blank">
            Xem trang chính
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Đổi giao diện</span>
        </Button>
        <div className="flex items-center gap-2 border-l pl-3">
          <div className="hidden text-right sm:block">
            <p className="max-w-40 truncate text-sm font-medium leading-none">{fullName}</p>
            <p className="mt-1 text-xs text-muted-foreground">Quản trị hệ thống</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-sm font-semibold text-foreground">
            {fullName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
