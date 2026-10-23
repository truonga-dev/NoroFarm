"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  CloudSun,
  Coffee,
  Contact,
  Newspaper,
  Search,
  ShoppingCart,
  Sprout,
  Store,
  TrendingUp,
  User,
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/useCartStore"
import { Container } from "./container"
import { MobileNav } from "./mobile-nav"
import { NotificationBell } from "./notification-bell"
import { SearchBar } from "./search-bar"

const DATA_NAV_ITEMS = [
  { title: "Giá cà phê", description: "Giá trong nước và thế giới", href: "/coffee", icon: Coffee },
  { title: "Giá nông sản", description: "Theo dõi giá theo thị trường", href: "/commodities", icon: Sprout },
  { title: "Thời tiết", description: "Dự báo phục vụ sản xuất", href: "/weather", icon: CloudSun },
  { title: "Xu hướng", description: "Phân tích biến động thị trường", href: "/market", icon: TrendingUp },
]

const DISCOVER_NAV_ITEMS = [
  { title: "Tin tức", description: "Tin nông nghiệp mới nhất", href: "/news", icon: Newspaper },
  { title: "Marketplace", description: "Kết nối người mua và người bán", href: "/marketplace", icon: Store },
  { title: "Liên hệ", description: "Nhận hỗ trợ từ NoroFarm", href: "/contact", icon: Contact },
]

type NavItem = (typeof DATA_NAV_ITEMS)[number]

function NavDropdown({ label, items, pathname }: { label: string; items: NavItem[]; pathname: string }) {
  const [open, setOpen] = React.useState(false)
  const active = items.some((item) => pathname.startsWith(item.href))

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          "flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-muted",
          active ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground"
        )}
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-3">
          <div className="rounded-2xl border bg-card/95 p-2 shadow-2xl backdrop-blur-xl">
            {items.map((item) => {
              const Icon = item.icon
              const itemActive = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted",
                    itemActive && "bg-primary/10"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary",
                      itemActive && "bg-primary/15 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const { getItemCount } = useCartStore()
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const cartCount = mounted ? getItemCount() : 0
  const isAdmin = user?.roles?.some((role: any) => role.name === "admin") || (user as any)?.is_superuser

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <MobileNav />
            <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="NoroFarm - Trang chủ">
              <Image src="/logo.png" alt="NoroFarm" width={34} height={34} className="rounded-full ring-1 ring-border" />
              <span className="hidden text-base font-bold tracking-tight sm:inline-block">NoroFarm</span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
              <Link
                href="/"
                className={cn(
                  "relative flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-muted",
                  pathname === "/" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground"
                )}
              >
                Trang chủ
                {pathname === "/" && (
                  <motion.span layoutId="header-active-tab" className="absolute inset-x-3 -bottom-[14px] h-0.5 bg-primary" />
                )}
              </Link>
              <NavDropdown label="Dữ liệu" items={DATA_NAV_ITEMS} pathname={pathname} />
              <NavDropdown label="Khám phá" items={DISCOVER_NAV_ITEMS} pathname={pathname} />
            </nav>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1.5 lg:gap-2">
            <div className="hidden w-52 2xl:block">
              <SearchBar />
            </div>
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <Link href="/search" aria-label="Tìm kiếm">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/checkout" aria-label="Giỏ hàng">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
            {isAuthenticated && user && <NotificationBell />}
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setShowUserMenu((value) => !value)} className="gap-2 rounded-full">
                  <User className="h-4 w-4" />
                  <span className="hidden max-w-[100px] truncate md:inline">
                    {user.profile?.full_name || user.email?.split("@")[0] || "Tài khoản"}
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 md:block" />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 z-50 mt-3 w-60 rounded-2xl border bg-card p-2 text-sm shadow-2xl">
                    <div className="mb-1 border-b px-3 py-2.5">
                      <p className="truncate font-semibold">{user.profile?.full_name || "Tài khoản"}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="block rounded-xl px-3 py-2.5 font-medium hover:bg-muted">
                      Bảng điều khiển
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setShowUserMenu(false)} className="block rounded-xl px-3 py-2.5 font-semibold text-primary hover:bg-muted">
                        Trang quản trị
                      </Link>
                    )}
                    <button
                      onClick={() => { setShowUserMenu(false); logout() }}
                      className="mt-1 w-full rounded-xl border-t px-3 py-2.5 text-left font-medium text-red-500 hover:bg-red-500/10"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button size="sm" asChild className="rounded-full px-4">
                <Link href="/login"><User className="mr-2 h-4 w-4" /> Đăng nhập</Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}
