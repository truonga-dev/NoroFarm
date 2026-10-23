"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/client"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = React.useState(true)

  const { data: announcementsData } = useQuery({
    queryKey: ["active-announcements"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/announcements?only_active=true")
      return res.data
    }
  })

  const announcements: any[] = announcementsData?.data || []
  
  if (announcements.length === 0 || !isVisible) {
    return null
  }

  // Lấy thông báo đầu tiên (mới nhất/quan trọng nhất)
  const topAnnouncement = announcements[0]

  return (
    <div className={`w-full text-white px-4 py-2 flex items-center justify-between z-50 relative`} style={{ backgroundColor: topAnnouncement.type === 'emergency' ? '#ef4444' : topAnnouncement.type === 'warning' ? '#f59e0b' : '#3b82f6' }}>
      <div className="flex items-center justify-center w-full max-w-7xl mx-auto gap-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <p className="text-sm font-medium text-center line-clamp-1">
          <span className="font-bold mr-2">{topAnnouncement.title}:</span>
          {topAnnouncement.content}
        </p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 text-white hover:bg-white/20 hover:text-white shrink-0 absolute right-2"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
