"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Bookmark, Headphones, LayoutDashboard, LogOut, Settings, ShoppingBag, Store } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

const SIDEBAR_ITEMS = [
  { title: "Tổng quan", shortTitle: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { title: "Quản lý tin đăng", shortTitle: "Tin đăng", href: "/dashboard/my-posts", icon: Store },
  { title: "Mục đã lưu", shortTitle: "Đã lưu", href: "/dashboard/saved", icon: Bookmark },
  { title: "Đơn mua", shortTitle: "Đơn mua", href: "/dashboard/orders", icon: ShoppingBag },
  { title: "Cảnh báo giá", shortTitle: "Cảnh báo", href: "/dashboard/alerts", icon: Bell },
  { title: "Cài đặt", shortTitle: "Cài đặt", href: "/settings", icon: Settings },
]

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const isActive = (href: string) => href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <div className="w-full border-b bg-background md:hidden">
        <nav aria-label="Điều hướng tài khoản" className="flex gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.shortTitle}
              </Link>
            )
          })}
        </nav>
      </div>

      <aside className={cn("sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r bg-background md:flex", className)} {...props}>
        <div className="flex-1 px-4 py-6">
          <div className="mb-5 border-b px-2 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Khu vực của tôi</p>
            <p className="mt-1 text-sm text-foreground/80">Quản lý hoạt động NoroFarm</p>
          </div>
          <nav aria-label="Điều hướng tài khoản" className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-medium transition-colors", active ? "border-primary/15 bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground")}>
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="border-t p-4">
          <Link href="/contact" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground">
            <Headphones className="h-[18px] w-[18px]" aria-hidden="true" />
            Trung tâm hỗ trợ
          </Link>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  )
}
