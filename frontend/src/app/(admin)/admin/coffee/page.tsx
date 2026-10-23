"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Coffee, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { commoditiesService } from "@/api/services/commodities.service"
import { useToast } from "@/components/ui/toast-context"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminCoffeePage() {
  const toast = useToast()

  // Mock data for the chart since real API might not have enough historical data yet
  const chartData = [
    { time: "08:00", robusta: 4050, arabica: 210.5 },
    { time: "09:00", robusta: 4080, arabica: 212.0 },
    { time: "10:00", robusta: 4065, arabica: 211.8 },
    { time: "11:00", robusta: 4100, arabica: 214.2 },
    { time: "12:00", robusta: 4095, arabica: 213.9 },
    { time: "13:00", robusta: 4110, arabica: 215.0 },
    { time: "14:00", robusta: 4120, arabica: 215.3 },
  ]

  const historyData = [
    { id: 1, type: "Robusta", price: 4120, unit: "$/tấn", time: "14:00 14/07", trend: "up", diff: "+10" },
    { id: 2, type: "Arabica", price: 215.3, unit: "¢/lb", time: "14:00 14/07", trend: "up", diff: "+0.3" },
    { id: 3, type: "Robusta", price: 4110, unit: "$/tấn", time: "13:00 14/07", trend: "up", diff: "+15" },
    { id: 4, type: "Arabica", price: 215.0, unit: "¢/lb", time: "13:00 14/07", trend: "up", diff: "+1.1" },
    { id: 5, type: "Robusta", price: 4095, unit: "$/tấn", time: "12:00 14/07", trend: "down", diff: "-5" },
  ]

  const handleSync = () => {
    toast.info("Đang đồng bộ dữ liệu cà phê...")
    // Simulate sync
    setTimeout(() => {
      toast.success("Đồng bộ thành công!")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thị trường Cà phê</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Theo dõi và quản lý bảng giá cà phê trực tuyến (Robusta, Arabica)
          </p>
        </div>
        <Button onClick={handleSync} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Đồng bộ ngay
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Robusta London</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,120</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 text-emerald-600">
              <TrendingUp className="w-3 h-3" /> +12.5% so với hôm qua
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arabica New York</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¢215.30</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 text-red-600">
              <TrendingDown className="w-3 h-3" /> -1.2% so với hôm qua
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-background rounded-xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-medium">Biểu đồ biến động giá</h3>
          <Tabs defaultValue="today" className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="today">Hôm nay</TabsTrigger>
              <TabsTrigger value="7d">7 Ngày</TabsTrigger>
              <TabsTrigger value="1m">1 Tháng</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRobusta" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorArabica" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid hsl(var(--border))', 
                  backgroundColor: 'hsl(var(--background))',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="robusta" 
                name="Robusta ($/tấn)" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRobusta)"
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="arabica" 
                name="Arabica (¢/lb)" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorArabica)"
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Lịch sử cập nhật giá</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Thời gian</th>
                <th className="px-6 py-3 whitespace-nowrap">Loại Cà phê</th>
                <th className="px-6 py-3 whitespace-nowrap">Mức giá</th>
                <th className="px-6 py-3 whitespace-nowrap text-right">Biến động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {historyData.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground">{item.time}</td>
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.type === 'Robusta' ? 'bg-[#8b5cf6]' : 'bg-[#10b981]'}`}></div>
                    {item.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">
                      {item.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-muted-foreground ml-1 text-xs">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                      item.trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {item.diff}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
