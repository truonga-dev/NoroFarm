"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { 
  Menu, X, User, Home, Coffee, Sprout, 
  CloudSun, Newspaper, TrendingUp, Store, PhoneCall 
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const MAIN_NAV_ITEMS = [
  { title: "Trang chủ", href: "/", icon: Home },
  { title: "Giá cà phê", href: "/coffee", icon: Coffee },
  { title: "Giá nông sản", href: "/commodities", icon: Sprout },
  { title: "Thời tiết", href: "/weather", icon: CloudSun },
  { title: "Tin tức", href: "/news", icon: Newspaper },
  { title: "Xu hướng", href: "/market", icon: TrendingUp },
  { title: "Marketplace", href: "/marketplace", icon: Store },
  { title: "Liên hệ", href: "/contact", icon: PhoneCall },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu on route change
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer Container */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-[100] w-3/4 max-w-sm border-r bg-white dark:bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-8 border-b pb-4">
                <Link href="/" className="flex items-center space-x-2">
                  <Image src="/logo.png" alt="NoroFarm Logo" width={36} height={36} className="rounded-full" />
                  <span className="font-bold text-lg text-foreground">NoroFarm</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Navigation Items */}
              <div className="flex flex-col space-y-1.5">
                {MAIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
            
            {/* User Footer Section */}
            <div className="border-t pt-4 mt-6">
              {isAuthenticated && user ? (
                <Button className="w-full justify-start gap-2 h-11" variant="outline" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/dashboard">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{user.profile?.full_name || user.email}</span>
                  </Link>
                </Button>
              ) : (
                <Button className="w-full gap-2 h-11" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/login">
                    <User className="h-4 w-4" />
                    Đăng nhập
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {mounted && typeof document !== "undefined"
        ? createPortal(drawerContent, document.body)
        : null}
    </div>
  )
}
