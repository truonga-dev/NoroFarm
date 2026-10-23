"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Bookmark, 
  Settings, 
  MessageSquare,
  LogOut,
  Bell,
  Store,
  ShoppingBag,
  Save
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const SIDEBAR_ITEMS = [
  {
    title: "Tổng quan",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý tin đăng",
    href: "/dashboard/my-posts",
    icon: Store,
  },
  {
    title: "Mục đã lưu",
    href: "/dashboard/saved",
    icon: Save,
  },
  {
    title: "Đơn mua (B2C)",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Cảnh báo giá",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    title: "Cài đặt",
    href: "/settings",
    icon: Settings,
  },
]

const BOTTOM_ITEMS = [
  {
    title: "Hỗ trợ",
    href: "/contact",
    icon: MessageSquare,
  },
  {
    title: "Đăng xuất",
    href: "/login",
    icon: LogOut,
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 flex-col justify-between border-r bg-card/50 backdrop-blur-xl px-4 py-6 md:flex h-[calc(100vh-4rem)] sticky top-16",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-8">
        <div>
          <h4 className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </h4>
          <nav className="grid gap-1">
            {SIDEBAR_ITEMS.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:text-primary",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      
      <div>
        <nav className="grid gap-1">
          {BOTTOM_ITEMS.map((item, index) => {
            const Icon = item.icon
            
            if (item.title === "Đăng xuất") {
              return (
                <button
                  key={index}
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-500"
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </button>
              )
            }
            
            return (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
