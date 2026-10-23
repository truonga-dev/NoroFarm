"use client"
 
import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus, Star, StarOff,
  Tag, BarChart2, MapPin, Calendar, Bell
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout/container"
import { commoditiesService } from "@/api/services/commodities.service"
import { profileService } from "@/api/services/profile.service"
import { notificationService } from "@/api/services/notification.service"
import { useToast } from "@/components/ui/toast-context"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DAYS_OPTIONS = [
  { label: "7 ngày", value: 7 },
  { label: "30 ngày", value: 30 },
  { label: "90 ngày", value: 90 },
  { label: "1 năm", value: 365 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border bg-card px-4 py-2.5 shadow-lg text-sm">
        <p className="text-muted-foreground mb-1 text-xs">{label}</p>
        <p className="font-bold text-primary text-base">
          {Number(payload[0].value).toLocaleString("vi-VN")} đ
        </p>
      </div>
    )
  }
  return null
}

export default function CommodityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [days, setDays] = React.useState(30)
  const toast = useToast()
  
  const commodityId = parseInt(id)
  
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [targetPrice, setTargetPrice] = React.useState("")
  const [condition, setCondition] = React.useState("above")
  const [isSubmittingAlert, setIsSubmittingAlert] = React.useState(false)

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetPrice || isNaN(parseFloat(targetPrice))) {
      toast.error("Vui lòng nhập mức giá hợp lệ")
      return
    }
    
    setIsSubmittingAlert(true)
    try {
      await notificationService.createPriceAlert({
        commodity_id: commodityId,
        target_price: parseFloat(targetPrice),
        condition: condition
      })
      toast.success("Đã cài đặt cảnh báo giá thành công!")
      setIsAlertOpen(false)
      setTargetPrice("")
    } catch (error) {
      toast.error("Không thể cài đặt cảnh báo giá. Vui lòng đăng nhập.")
    } finally {
      setIsSubmittingAlert(false)
    }
  }

  // Fetch watchlist
  const { data: watchlistData, refetch: refetchWatchlist } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await profileService.getWatchlist()
      return res.data
    },
  })

  const watchlist: any[] = watchlistData?.data || watchlistData || []
  const isWatched = watchlist.some((item: any) => item.id === commodityId)

  const toggleWatchlist = async () => {
    try {
      if (isWatched) {
        await profileService.removeFromWatchlist(commodityId)
        toast.success("Đã bỏ theo dõi nông sản này")
      } else {
        await profileService.addToWatchlist(commodityId)
        toast.success("Đã thêm vào danh sách theo dõi")
      }
      refetchWatchlist()
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const { data: commodityData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["commodity-detail", commodityId],
    queryFn: async () => {
      const res = await commoditiesService.getCommodity(commodityId)
      return res.data
    },
    enabled: !isNaN(commodityId),
  })

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["price-history", commodityId, days],
    queryFn: async () => {
      const res = await commoditiesService.getPriceHistory(commodityId, days)
      return res.data
    },
    enabled: !isNaN(commodityId),
  })

  const commodity = commodityData?.data || commodityData
  const history: any[] = historyData?.data || historyData || []

  // Tính biến động giá
  const currentPrice = history.length > 0 ? history[history.length - 1]?.price : commodity?.prices?.[0]?.price
  const prevPrice = history.length > 1 ? history[history.length - 2]?.price : null
  const changePct = currentPrice && prevPrice ? ((currentPrice - prevPrice) / prevPrice * 100) : null
  const changeAbs = currentPrice && prevPrice ? (currentPrice - prevPrice) : null

  const chartData = history.map((h: any) => ({
    date: new Date(h.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
    price: h.price,
    fullDate: new Date(h.date).toLocaleDateString("vi-VN"),
  }))

  const minPrice = history.length > 0 ? Math.min(...history.map((h: any) => h.price)) : 0
  const maxPrice = history.length > 0 ? Math.max(...history.map((h: any) => h.price)) : 0
  const avgPrice = history.length > 0 ? history.reduce((sum: number, h: any) => sum + h.price, 0) / history.length : 0

  const isTrending = changePct !== null ? changePct > 0 : null

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <div className="bg-background border-b sticky top-16 z-30">
        <Container>
          <div className="flex items-center gap-4 py-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              {isLoadingDetail ? (
                <Skeleton className="h-7 w-48" />
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold truncate">{commodity?.name}</h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    {commodity?.code}
                  </span>
                  {commodity?.category?.name && (
                    <span className="hidden sm:inline-flex text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {commodity.category.name}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAlertOpen(true)}
                className="gap-2 border-primary text-primary hover:bg-primary/5 rounded-xl"
              >
                <Bell className="w-4 h-4" />
                Cài báo giá
              </Button>
              <Button
                variant={isWatched ? "default" : "outline"}
                size="sm"
                onClick={toggleWatchlist}
                className="gap-2 rounded-xl"
              >
                {isWatched ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                {isWatched ? "Đang theo dõi" : "Theo dõi"}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Banner */}
            <div className="rounded-2xl bg-card border p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Giá hiện tại</p>
                  {isLoadingHistory ? (
                    <Skeleton className="h-12 w-48" />
                  ) : (
                    <div className="flex items-end gap-4">
                      <span className="text-4xl font-bold text-foreground">
                        {currentPrice ? currentPrice.toLocaleString("vi-VN") : "—"}
                        <span className="text-lg text-muted-foreground font-normal ml-1">đ/{commodity?.unit || "kg"}</span>
                      </span>
                      {changePct !== null && (
                        <div className={`flex items-center gap-1 mb-1 text-sm font-semibold ${isTrending ? "text-emerald-500" : "text-red-500"}`}>
                          {isTrending ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {isTrending ? "+" : ""}{changePct.toFixed(2)}%
                          <span className="text-muted-foreground font-normal text-xs ml-1">so với trước</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Day selector */}
                <div className="flex items-center bg-muted rounded-xl p-1 gap-1">
                  {DAYS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setDays(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        days === opt.value
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              {isLoadingHistory ? (
                <Skeleton className="h-[280px] w-full rounded-xl" />
              ) : chartData.length === 0 ? (
                <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <BarChart2 className="w-10 h-10 opacity-20" />
                  <p>Chưa có dữ liệu giá trong {days} ngày qua</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isTrending === false ? "#ef4444" : "#16a34a"} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={isTrending === false ? "#ef4444" : "#16a34a"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      axisLine={false} tickLine={false}
                      interval={Math.floor(chartData.length / 6)}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      axisLine={false} tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      width={42} domain={["auto", "auto"]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {avgPrice > 0 && (
                      <ReferenceLine
                        y={avgPrice}
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="4 4"
                        label={{ value: "TB", fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={isTrending === false ? "#ef4444" : "#16a34a"}
                      strokeWidth={2.5}
                      fill="url(#priceGradient)"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Price Table */}
            {history.length > 0 && (
              <div className="rounded-2xl bg-card border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-semibold">Lịch sử giá gần nhất</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="text-left px-5 py-3">Ngày</th>
                        <th className="text-right px-5 py-3">Giá</th>
                        <th className="text-right px-5 py-3">Thay đổi</th>
                        <th className="text-right px-5 py-3">Khu vực</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[...history].reverse().slice(0, 10).map((h: any, i: number, arr: any[]) => {
                        const prev = arr[i + 1]
                        const delta = prev ? h.price - prev.price : null
                        const deltaPct = prev && prev.price > 0 ? ((h.price - prev.price) / prev.price * 100) : null
                        return (
                          <tr key={h.id || i} className="hover:bg-muted/30 transition-colors">
                            <td className="px-5 py-3 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                              {new Date(h.date).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="px-5 py-3 text-right font-semibold">
                              {h.price.toLocaleString("vi-VN")} đ
                            </td>
                            <td className="px-5 py-3 text-right">
                              {delta !== null ? (
                                <span className={`inline-flex items-center gap-1 text-xs font-medium ${delta > 0 ? "text-emerald-500" : delta < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                                  {delta > 0 ? <TrendingUp className="w-3 h-3" /> : delta < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                  {delta > 0 ? "+" : ""}{deltaPct?.toFixed(1)}%
                                </span>
                              ) : <span className="text-muted-foreground text-xs">—</span>}
                            </td>
                            <td className="px-5 py-3 text-right">
                              {h.location ? (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {h.location}
                                </span>
                              ) : <span className="text-muted-foreground text-xs">—</span>}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="rounded-2xl bg-card border p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Thống kê {days} ngày
              </h3>
              {isLoadingHistory ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: "Cao nhất", value: maxPrice, color: "text-emerald-600" },
                    { label: "Thấp nhất", value: minPrice, color: "text-red-500" },
                    { label: "Trung bình", value: avgPrice, color: "text-blue-500" },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <span className={`font-bold text-sm ${stat.color}`}>
                        {stat.value > 0 ? stat.value.toLocaleString("vi-VN") + " đ" : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Commodity Info */}
            <div className="rounded-2xl bg-card border p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Thông tin sản phẩm
              </h3>
              {isLoadingDetail ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
              ) : (
                <dl className="space-y-3 text-sm">
                  {[
                    { dt: "Mã sản phẩm", dd: commodity?.code },
                    { dt: "Đơn vị", dd: commodity?.unit },
                    { dt: "Danh mục", dd: commodity?.category?.name },
                  ].map(item => (
                    <div key={item.dt} className="flex justify-between">
                      <dt className="text-muted-foreground">{item.dt}</dt>
                      <dd className="font-medium">{item.dd || "—"}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {commodity?.description && (
                <p className="text-sm text-muted-foreground border-t pt-4">{commodity.description}</p>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Dialog Cài Cảnh báo giá */}
      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-primary" />
              Cài đặt cảnh báo giá
            </DialogTitle>
            <DialogDescription>
              Nhận thông báo qua Email khi giá của {commodity?.name} chạm ngưỡng bạn mong muốn.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAlert} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="price-condition" className="text-xs font-semibold">Điều kiện báo giá</Label>
              <select
                id="price-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="above">Giá tăng vượt ngưỡng (&gt;=)</option>
                <option value="below">Giá giảm xuống mức (&lt;=)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-price" className="text-xs font-semibold">Mức giá mục tiêu (VNĐ/{commodity?.unit || "kg"})</Label>
              <Input
                id="target-price"
                type="number"
                placeholder="Ví dụ: 110000"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
                className="rounded-xl bg-muted/20"
              />
            </div>
            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsAlertOpen(false)} className="rounded-xl">
                Hủy bỏ
              </Button>
              <Button type="submit" disabled={isSubmittingAlert} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                {isSubmittingAlert ? "Đang cài đặt..." : "Xác nhận cài đặt"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
