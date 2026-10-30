'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Bookmark,
  ChevronDown,
  CloudSun,
  Coffee,
  Headset,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sprout,
  Store,
  TrendingUp,
  User,
} from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'
import { Container } from './container'
import { MobileNav } from './mobile-nav'
import { NotificationBell } from './notification-bell'
import { SearchBar } from './search-bar'

interface DropdownItem {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const DATA_DROPDOWN_ITEMS: DropdownItem[] = [
  {
    title: 'Giá Cà phê 2026',
    description: 'Giá nhân xô Tây Nguyên & sàn London/New York',
    href: '/coffee',
    icon: Coffee,
    badge: 'HOT',
  },
  {
    title: 'Bảng giá Nông sản',
    description: 'Hồ tiêu, sầu riêng, lúa gạo, cao su, mắc ca',
    href: '/commodities',
    icon: TrendingUp,
  },
  {
    title: 'Thời tiết Nông vụ',
    description: 'Dự báo khí tượng & khuyến nghị canh tác',
    href: '/weather',
    icon: CloudSun,
  },
  {
    title: 'Cảnh báo Giá tự động',
    description: 'Nhận thông báo khi chạm ngưỡng mục tiêu',
    href: '/dashboard/alerts',
    icon: Bell,
  },
]

const EXPLORE_DROPDOWN_ITEMS: DropdownItem[] = [
  {
    title: 'Sàn Giao dịch B2B',
    description: 'Kết nối thương lái, hợp tác xã và nhà nông',
    href: '/marketplace',
    icon: Store,
  },
  {
    title: 'Cửa hàng Vật tư',
    description: 'Phân bón, thuốc BVTV, giống cây trồng chính hãng',
    href: '/shop',
    icon: Sprout,
  },
  {
    title: 'Tin tức & Phân tích',
    description: 'Bản tin thị trường và kỹ thuật canh tác',
    href: '/news',
    icon: Newspaper,
  },
  {
    title: 'Liên hệ & Hỗ trợ',
    description: 'Kết nối chuyên gia tư vấn NoroFarm',
    href: '/contact',
    icon: Headset,
  },
]

function NavDropdown({
  label,
  items,
  pathname,
}: {
  label: string
  items: DropdownItem[]
  pathname: string
}) {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isAnyActive = items.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 140)
  }

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'relative flex h-9 shrink-0 items-center gap-1 rounded-lg px-3.5 text-sm font-medium whitespace-nowrap transition-colors',
          isAnyActive || open
            ? 'bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            : 'text-foreground/75 hover:bg-emerald-50/70 hover:text-emerald-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300'
        )}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            'text-muted-foreground h-3.5 w-3.5 transition-transform duration-200',
            open && 'rotate-180 text-emerald-700 dark:text-emerald-400'
          )}
        />
        {isAnyActive && (
          <motion.span
            layoutId="header-active-indicator"
            className="absolute inset-x-3 -bottom-[14px] h-[2px] bg-emerald-700 dark:bg-emerald-400"
          />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 pt-2.5">
          <div className="w-80 rounded-2xl border border-emerald-900/10 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-emerald-800/30 dark:bg-slate-900">
            <div className="grid gap-1">
              {items.map((item) => {
                const Icon = item.icon
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'group flex items-start gap-3 rounded-xl p-2.5 transition-colors',
                      active
                        ? 'bg-emerald-50/90 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                        : 'hover:bg-emerald-50/60 dark:hover:bg-slate-800/70'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors',
                        active
                          ? 'border-emerald-300 bg-emerald-700 text-white'
                          : 'border-emerald-900/10 bg-emerald-50/80 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-300'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-semibold group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="rounded-full border border-amber-300/80 bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-900 uppercase">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
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
  const userMenuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const cartCount = mounted && isAuthenticated && user ? getItemCount() : 0
  const isAdmin =
    user?.roles?.some((role: any) => role.name === 'admin') ||
    (user as any)?.is_superuser
  const displayName =
    user?.profile?.full_name || user?.email?.split('@')[0] || 'Tài khoản'
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <header className="border-border bg-background/95 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <Container className="px-3 sm:px-5 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-1.5 sm:gap-4">
          {/* Left: Brand & Primary Navigation */}
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-4 lg:gap-5 xl:gap-7">
            <MobileNav />
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-1.5 sm:gap-2.5 focus:outline-none"
              aria-label="NoroFarm - Trang chủ"
            >
              <Image
                src="/logo.png"
                alt="NoroFarm"
                width={32}
                height={32}
                className="ring-border rounded-full ring-1 sm:h-9 sm:w-9"
              />
              <span className="text-foreground text-base sm:text-lg font-bold tracking-[-0.02em] whitespace-nowrap">
                NoroFarm
              </span>
            </Link>

            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="Điều hướng chính"
            >
              <Link
                href="/"
                className={cn(
                  'relative flex h-9 shrink-0 items-center rounded-lg px-3.5 text-sm font-medium whitespace-nowrap transition-colors',
                  pathname === '/'
                    ? 'bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'text-foreground/75 hover:bg-emerald-50/70 hover:text-emerald-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300'
                )}
              >
                <span>Trang chủ</span>
                {pathname === '/' && (
                  <motion.span
                    layoutId="header-active-indicator"
                    className="absolute inset-x-3 -bottom-[14px] h-[2px] bg-emerald-700 dark:bg-emerald-400"
                  />
                )}
              </Link>

              <NavDropdown
                label="Dữ liệu"
                items={DATA_DROPDOWN_ITEMS}
                pathname={pathname}
              />

              <NavDropdown
                label="Khám phá"
                items={EXPLORE_DROPDOWN_ITEMS}
                pathname={pathname}
              />
            </nav>
          </div>

          {/* Right: Search, Cart, Notifications, Theme & Account */}
          <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
            <div className="hidden w-52 xl:block 2xl:w-60">
              <SearchBar />
            </div>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground hover:text-foreground hidden rounded-full sm:inline-flex xl:hidden"
            >
              <Link href="/search" aria-label="Tìm kiếm">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground hover:text-foreground relative h-8 w-8 sm:h-9 sm:w-9 rounded-full"
            >
              <Link
                href={
                  isAuthenticated && user
                    ? '/checkout'
                    : '/login?redirect=/checkout'
                }
                aria-label="Giỏ hàng"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {isAuthenticated && user && <NotificationBell />}
            <ThemeToggle className="h-8 w-8 sm:h-9 sm:w-9" />

            <div className="bg-border mx-0.5 sm:mx-1 hidden h-5 w-px sm:block" />

            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu((value) => !value)}
                  className="border-border/80 bg-card/80 hover:border-primary/40 hover:bg-muted/50 flex items-center gap-1.5 sm:gap-2 rounded-full border p-0.5 sm:p-1 pr-2 sm:pr-3 text-sm font-medium shadow-sm transition-all"
                >
                  <span className="bg-primary/15 text-primary flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs font-bold">
                    {userInitial}
                  </span>
                  <span className="text-foreground hidden max-w-[110px] truncate text-xs font-semibold md:inline">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={cn(
                      'text-muted-foreground hidden h-3.5 w-3.5 transition-transform md:block',
                      showUserMenu && 'rotate-180'
                    )}
                  />
                </button>

                {showUserMenu && (
                  <div className="border-border/80 bg-card/95 absolute right-0 z-50 mt-2.5 w-64 rounded-2xl border p-2 text-sm shadow-2xl backdrop-blur-xl">
                    <div className="border-border/60 mb-1.5 flex items-center gap-3 border-b px-3 py-2.5">
                      <div className="bg-primary/15 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold">
                        {userInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate font-bold">
                          {displayName}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                      >
                        <LayoutDashboard className="text-primary h-4 w-4" />
                        Bảng điều khiển
                      </Link>
                      <Link
                        href="/dashboard/alerts"
                        onClick={() => setShowUserMenu(false)}
                        className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                      >
                        <Bell className="h-4 w-4 text-amber-500" />
                        Cảnh báo giá
                      </Link>
                      <Link
                        href="/dashboard/saved"
                        onClick={() => setShowUserMenu(false)}
                        className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                      >
                        <Bookmark className="h-4 w-4 text-emerald-500" />
                        Danh mục & Tồn kho
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                      >
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                        Đơn mua vật tư (B2C)
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="text-foreground hover:bg-muted flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium"
                      >
                        <Settings className="text-muted-foreground h-4 w-4" />
                        Cài đặt tài khoản
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="bg-primary/10 text-primary hover:bg-primary/15 mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          Trung tâm Quản trị (Admin)
                        </Link>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        logout()
                      }}
                      className="border-border/60 mt-1.5 flex w-full items-center gap-2.5 rounded-xl border-t px-3 py-2 pt-2.5 text-left text-xs font-semibold text-red-500 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                size="sm"
                asChild
                className="h-8 sm:h-9 rounded-full px-2.5 sm:px-4 text-xs sm:text-sm font-semibold shadow-sm"
              >
                <Link href="/login">
                  <User className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
                  <span>Đăng nhập</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}
