"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Newspaper, Tag, Settings, LogOut, Coffee, Users, Shield, ChevronRight, Store, ShoppingCart, Package, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

const SIDEBAR_ITEMS = [
  { name: "Tổng quan",    href: "/admin",            icon: Home,     exact: true },
  { name: "Tin tức",      href: "/admin/news",        icon: Newspaper },
  { name: "Giá Nông sản", href: "/admin/prices",      icon: Tag },
  { name: "Kho Sản Phẩm", href: "/admin/products",    icon: Package },
  { name: "Đơn hàng B2C", href: "/admin/orders",      icon: ShoppingCart },
  { name: "Phản hồi KH",  href: "/admin/contacts",    icon: Mail },
  { name: "Sàn Giao Dịch", href: "/admin/market",      icon: Store },
  { name: "Quản lý Coffee",href: "/admin/coffee",     icon: Coffee },
  { name: "Người dùng",   href: "/admin/users",       icon: Users },
  { name: "Lịch sử HĐ",  href: "/admin/audit-logs",  icon: Shield },
  { name: "Cài đặt",      href: "/admin/settings",    icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (item: typeof SIDEBAR_ITEMS[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-background flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b gap-2">
        <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-white text-sm font-bold">N</span>
        </div>
        <Link href="/admin" className="font-bold text-lg text-foreground tracking-tight">
          NoroFarm <span className="text-primary">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider px-2 mb-1">Menu chính</p>
        </div>
        <nav className="grid items-start px-3 text-sm font-medium gap-0.5">
          {SIDEBAR_ITEMS.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 group relative",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {/* Active bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary" />
                )}
                <item.icon className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  active ? "text-primary" : "group-hover:scale-105"
                )} />
                <span className="flex-1">{item.name}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-primary opacity-60" />}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer - Logout */}
      <div className="p-3 mt-auto border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
