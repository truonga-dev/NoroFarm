"use client"

import * as React from "react"
import { Search, Bell, Sun, Moon, LogOut, User } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"

export function AdminHeader() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
      <div className="flex w-full max-w-md items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            className="w-full bg-muted/50 pl-9 md:w-[300px] lg:w-[400px] h-9"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-muted-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Đổi giao diện</span>
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium leading-none">{user?.profile?.full_name || "Admin"}</span>
            <span className="text-xs text-muted-foreground mt-1">Super Admin</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user?.profile?.full_name ? user.profile.full_name.charAt(0).toUpperCase() : "A"}
          </div>
        </div>
      </div>
    </header>
  )
}
