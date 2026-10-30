"use client"

import * as React from "react"
import { Bell, Check } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationService } from "@/api/services/notification.service"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false)
  const queryClient = useQueryClient()
  const popoverRef = React.useRef<HTMLDivElement>(null)

  // Đóng popover khi click ra ngoài
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const { data: notifData } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await notificationService.getNotifications(0, 10)
      return res
    },
    refetchInterval: 15000 // Refetch mỗi 15s
  })

  const notifications = notifData?.data || []
  const unreadCount = notifData?.meta?.unread_count || 0

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }
  })

  const handleNotificationClick = (id: number, isRead: boolean) => {
    if (!isRead) {
      markAsReadMutation.mutate(id)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={popoverRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border bg-card text-card-foreground shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b p-4">
            <h4 className="font-semibold text-sm">Thông báo</h4>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs text-primary hover:bg-transparent hover:underline"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <Check className="mr-1 h-3 w-3" />
                Đánh dấu đã đọc
              </Button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">Không có thông báo nào</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative flex flex-col gap-1 border-b p-4 hover:bg-muted/50 transition-colors",
                      !notification.is_read ? "bg-primary/5" : ""
                    )}
                  >
                    {!notification.is_read && (
                      <div className="absolute left-2 top-5 h-2 w-2 rounded-full bg-primary" />
                    )}
                    <div className={cn("pl-4", !notification.is_read ? "" : "")}>
                      {notification.link ? (
                        <Link 
                          href={notification.link} 
                          className="font-medium text-sm hover:underline"
                          onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                        >
                          {notification.title}
                        </Link>
                      ) : (
                        <span className="font-medium text-sm">{notification.title}</span>
                      )}
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground/70 mt-2 block">
                        {new Date(notification.created_at).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t bg-muted/30 p-2.5 flex items-center justify-between text-xs">
            <Link
              href="/dashboard/alerts"
              className="text-primary font-medium hover:underline w-full text-center py-1"
              onClick={() => setIsOpen(false)}
            >
              Quản lý cảnh báo giá nông sản →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
