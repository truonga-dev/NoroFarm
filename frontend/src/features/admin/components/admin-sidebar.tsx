"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coffee, Home, LogOut, Mail, Newspaper, Package, Settings, Shield, ShoppingCart, Store, Tag, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

const SIDEBAR_ITEMS = [
  { name: "Tổng quan", shortName: "Tổng quan", href: "/admin", icon: Home, exact: true },
  { name: "Tin tức", shortName: "Tin tức", href: "/admin/news", icon: Newspaper },
  { name: "Giá nông sản", shortName: "Bảng giá", href: "/admin/prices", icon: Tag },
  { name: "Kho sản phẩm", shortName: "Sản phẩm", href: "/admin/products", icon: Package },
  { name: "Đơn hàng B2C", shortName: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Phản hồi khách hàng", shortName: "Phản hồi", href: "/admin/contacts", icon: Mail },
  { name: "Sàn giao dịch", shortName: "B2B", href: "/admin/market", icon: Store },
  { name: "Dữ liệu cà phê", shortName: "Cà phê", href: "/admin/coffee", icon: Coffee },
  { name: "Người dùng", shortName: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Nhật ký hệ thống", shortName: "Nhật ký", href: "/admin/audit-logs", icon: Shield },
  { name: "Cài đặt", shortName: "Cài đặt", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const isActive = (item: (typeof SIDEBAR_ITEMS)[number]) => item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)

  const navigation = (compact = false) => SIDEBAR_ITEMS.map((item) => {
    const active = isActive(item)
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          compact
            ? "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
            : "flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-medium",
          active ? "border-primary/15 bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        )}
      >
        <Icon className={compact ? "h-4 w-4" : "h-[18px] w-[18px]"} aria-hidden="true" />
        {compact ? item.shortName : item.name}
      </Link>
    )
  })

  return (
    <>
      <div className="border-b bg-background md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">N</span>
            NoroFarm <span className="font-medium text-primary">Quản trị</span>
          </Link>
        </div>
        <nav aria-label="Điều hướng quản trị" className="flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navigation(true)}
        </nav>
      </div>

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r bg-background md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">N</span>
          <Link href="/admin" className="font-semibold tracking-tight">
            NoroFarm <span className="font-medium text-primary">Quản trị</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Vận hành hệ thống</p>
          <nav aria-label="Điều hướng quản trị" className="space-y-1">{navigation()}</nav>
        </div>
        <div className="border-t p-3">
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  )
}
