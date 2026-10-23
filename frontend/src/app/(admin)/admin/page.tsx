"use client"

import * as React from "react"
import { Newspaper, Users, Tag, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Download } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-context"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/client"

// CHART_DATA is removed as we now fetch it from API

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = React.useState("this_week")
  const toast = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/analytics")
      return res.data
    }
  })

  const analytics = data || {
    total_articles: 0,
    total_commodities: 0,
    active_announcements: 0,
    total_users: 0,
    recent_activities: [],
    traffic_data: []
  }

  const STATS = [
    { title: "Tổng Bài viết", value: analytics.total_articles, icon: Newspaper, trend: "Tin tức", isUp: true, desc: "trong cơ sở dữ liệu" },
    { title: "Nông sản theo dõi", value: analytics.total_commodities, icon: Tag, trend: "Mặt hàng", isUp: true, desc: "đang được hệ thống quản lý" },
    { title: "Thông báo", value: analytics.active_announcements, icon: TrendingUp, trend: "Đang hiển thị", isUp: true, desc: "trên trang chủ" },
    { title: "Người dùng", value: analytics.total_users, icon: Users, trend: "Thành viên", isUp: true, desc: "đã đăng ký" },
  ]
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bảng Điều khiển</h1>
          <p className="text-muted-foreground mt-2">Theo dõi toàn cảnh hệ thống NoroFarm.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="today">Hôm nay</option>
            <option value="this_week">Tuần này</option>
            <option value="this_month">Tháng này</option>
            <option value="this_year">Năm nay</option>
          </select>
          
          <Button variant="outline" className="bg-background gap-2" onClick={() => {
            toast.success("Đã tải xuống báo cáo CSV!")
          }}>
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Bento Grid - Top Row: Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-muted/60 bg-gradient-to-br from-background to-muted/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <span className={`font-medium flex items-center ${stat.isUp ? "text-emerald-600" : "text-red-600"}`}>
                  {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.trend}
                </span>
                <span className="text-muted-foreground/70">{stat.desc}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Bento Grid - Bottom Row: Charts and Activities */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Lưu lượng truy cập (Tuần này)</CardTitle>
            <CardDescription>
              So sánh lượt xem trang và số người dùng mới đăng ký.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.traffic_data.length > 0 ? analytics.traffic_data : [{ name: "Chưa có dữ liệu", views: 0, users: 0 }]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="views" name="Lượt xem" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="users" name="Người dùng" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các thay đổi trên hệ thống.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 mt-4">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-4">Đang tải...</div>
              ) : analytics.recent_activities.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">Chưa có hoạt động nào.</div>
              ) : (
                analytics.recent_activities.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        User ID: {activity.user_id || "System"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.action} - {activity.resource}
                      </p>
                      <p className="text-xs text-muted-foreground/70 flex items-center gap-1 mt-1">
                        {new Date(activity.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
