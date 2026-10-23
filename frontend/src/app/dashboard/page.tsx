"use client"

import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Sidebar } from "@/components/layout/sidebar"
import { PageTitle } from "@/components/layout/page-title"
import {
  TrendingUp,
  TrendingDown,
  Bell,
  Calendar,
  MapPin,
  Coffee,
  Minus,
  Star,
  ChevronRight,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  CloudSun,
  Flame,
  Activity,
  Layers,
  Droplets,
  Wind
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { weatherService } from "@/api/services/weather.service"
import { profileService } from "@/api/services/profile.service"
import { commoditiesService } from "@/api/services/commodities.service"
import { apiClient } from "@/api/client"
import { useToast } from "@/components/ui/toast-context"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const val = Number(payload[0].value)
    return (
      <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md px-4 py-3 shadow-xl text-sm">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <p className="font-extrabold text-foreground text-base">
            {val.toLocaleString("vi-VN")} <span className="text-xs font-normal text-muted-foreground">VNĐ</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

const EMPTY_ITEMS: any[] = []

function latestRegionalPrice(items: any[], kind: "coffee" | "pepper", location: string) {
  const matching = items.filter((item) => {
    const name = String(item.name || "").toLocaleLowerCase("vi")
    const code = String(item.code || "").toLowerCase()
    return kind === "coffee"
      ? name.includes("cà phê") || name.includes("robusta") || name.includes("arabica") || code.includes("ca_phe") || code.includes("coffee")
      : name.includes("hồ tiêu") || code.includes("ho_tieu") || code.includes("pepper")
  })

  const region = location.toLocaleLowerCase("vi")
  const isWorldMarket = location === "Robusta London" || location === "Arabica New York"
  const candidates = isWorldMarket
    ? matching.filter((item) => String(item.name).toLocaleLowerCase("vi").includes(region))
    : kind === "coffee"
      ? matching.filter((item) => String(item.name).toLocaleLowerCase("vi").includes("robusta") || String(item.code).toLowerCase().includes("ca_phe_ro"))
      : matching

  return candidates.map((item) => {
    const prices = (item.prices || [])
      .filter((price: any) => isWorldMarket || String(price.location || "").toLocaleLowerCase("vi").includes(region))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return { item, price: prices[0] }
  }).find((result) => result.price) || null
}

export default function DashboardPage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  const today = useMemo(() => {
    return new Date().toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [])

  // State cho lựa chọn
  const [coffeeLocation, setCoffeeLocation] = useState("Đắk Lắk")
  const [pepperLocation, setPepperLocation] = useState("Đắk Lắk")
  const [selectedCommodityId, setSelectedCommodityId] = useState<number | null>(null)
  const [chartDays, setChartDays] = useState<number>(14)
  const [weatherLocation, setWeatherLocation] = useState("")
  const [coords, setCoords] = useState<{ lat?: number; lon?: number }>({})

  // Geolocation
  useEffect(() => {
    if (weatherLocation === "" && typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {}
      )
    }
  }, [weatherLocation])

  // Mutation đồng bộ giá thị trường thực tế
  const syncLiveMutation = useMutation({
    mutationFn: () => commoditiesService.crawlLive(),
    onSuccess: () => {
      toast.success("Đã đồng bộ giá nông sản thực tế mới nhất từ thị trường!")
      queryClient.invalidateQueries({ queryKey: ["dashboard-top-movers"] })
      queryClient.invalidateQueries({ queryKey: ["commodities-dashboard-all"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-price-history"] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Không thể đồng bộ giá lúc này. Vui lòng thử lại sau.")
    }
  })

  // Lấy tất cả commodities để chọn xem biểu đồ
  const { data: allCommoditiesData, isLoading: isCommoditiesLoading } = useQuery({
    queryKey: ["commodities-dashboard-all"],
    queryFn: async () => {
      const res = await commoditiesService.getOverview()
      return res.data?.data || res.data || []
    }
  })
  const allCommodities: any[] = allCommoditiesData || EMPTY_ITEMS

  // Top movers
  const { data: moversData, isLoading: isMoversLoading } = useQuery({
    queryKey: ["dashboard-top-movers"],
    queryFn: async () => {
      try {
        const res = await commoditiesService.getTopMovers(6)
        return res.data?.data || res.data || []
      } catch {
        return []
      }
    }
  })

  // Watchlist cá nhân
  const { data: watchlistData, isLoading: isWatchlistLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      try {
        const res = await profileService.getWatchlist()
        return res.data?.data || res.data || []
      } catch {
        return []
      }
    }
  })

  // Cà phê theo địa phương
  const coffeeQuote = useMemo(() => latestRegionalPrice(allCommodities, "coffee", coffeeLocation), [allCommodities, coffeeLocation])
  const pepperQuote = useMemo(() => latestRegionalPrice(allCommodities, "pepper", pepperLocation), [allCommodities, pepperLocation])
  const coffeeData = coffeeQuote?.item
  const pepperData = pepperQuote?.item
  const coffeePrice = coffeeQuote?.price?.price
  const pepperPrice = pepperQuote?.price?.price

  // Tự động gán selectedCommodityId ban đầu
  useEffect(() => {
    if (!selectedCommodityId) {
      if (coffeeData?.id) {
        setSelectedCommodityId(coffeeData.id)
      } else if (allCommodities.length > 0) {
        setSelectedCommodityId(allCommodities[0].id)
      }
    }
  }, [coffeeData, allCommodities, selectedCommodityId])

  // Lịch sử giá cho biểu đồ
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["dashboard-price-history", selectedCommodityId, chartDays],
    queryFn: async () => {
      if (!selectedCommodityId) return []
      const res = await commoditiesService.getPriceHistory(selectedCommodityId, chartDays)
      return res.data?.data || res.data || []
    },
    enabled: !!selectedCommodityId,
  })

  // Thời tiết
  const { data: weatherData, isLoading: isWeatherLoading } = useQuery({
    queryKey: ["weather-dashboard", weatherLocation, coords.lat, coords.lon],
    queryFn: () => weatherService.getCurrentWeather(
      weatherLocation || undefined,
      weatherLocation ? undefined : coords.lat,
      weatherLocation ? undefined : coords.lon
    ),
  })

  // Announcements an toàn, không ném 403
  const { data: announcementsData } = useQuery({
    queryKey: ["active-announcements"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/admin/announcements?only_active=true")
        return res.data?.data || res.data || []
      } catch {
        return []
      }
    }
  })

  const movers: any[] = moversData || EMPTY_ITEMS
  const watchlist: any[] = watchlistData || EMPTY_ITEMS
  const weatherInfo = weatherData?.data || weatherData
  const announcements: any[] = announcementsData || EMPTY_ITEMS
  const latestAnnouncement = announcements[0]

  // Chuẩn bị dữ liệu biểu đồ và thống kê Min / Max / Avg
  const priceHistory: any[] = historyData || EMPTY_ITEMS
  const chartData = useMemo(() => {
    return priceHistory.map((h: any) => ({
      date: new Date(h.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      price: Number(h.price),
    }))
  }, [priceHistory])

  const chartStats = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 0, avg: 0, changePct: 0 }
    const prices = chartData.map((d: any) => d.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const avg = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length)
    const first = prices[0]
    const last = prices[prices.length - 1]
    const changePct = first > 0 ? ((last - first) / first) * 100 : 0
    return { min, max, avg, changePct }
  }, [chartData])

  const currentChartCommodity = useMemo(() => {
    return allCommodities.find((c: any) => c.id === selectedCommodityId) ||
      movers.find((m: any) => m.id === selectedCommodityId)
  }, [allCommodities, movers, selectedCommodityId])

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <Section className="py-6 md:py-8 lg:py-10">
            <Container>
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                      Tổng quan thị trường & Trang trại
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Tổng quan dữ liệu
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Theo dõi biến động giá nông sản thực tế, thời tiết vùng vụ và thông báo quan trọng.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => syncLiveMutation.mutate()}
                    disabled={syncLiveMutation.isPending}
                    className="gap-2 shadow-sm border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium transition-all"
                  >
                    <RefreshCw className={`h-4 w-4 ${syncLiveMutation.isPending ? "animate-spin text-emerald-500" : ""}`} />
                    {syncLiveMutation.isPending ? "Đang lấy giá mới..." : "Đồng bộ giá thị trường"}
                  </Button>

                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-card text-xs font-medium text-muted-foreground shadow-sm">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {today}
                  </div>
                </div>
              </div>

              {/* 3 Major Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 1. Cà phê Robusta Tây Nguyên & Thế Giới */}
                <div className="group rounded-2xl bg-card border p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                          <Coffee className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold">Cà phê thực tế</div>
                          <select
                            className="bg-transparent text-sm font-bold text-foreground outline-none cursor-pointer hover:text-primary transition-colors pr-2"
                            value={coffeeLocation}
                            onChange={(e) => setCoffeeLocation(e.target.value)}
                          >
                            <option value="Đắk Lắk">Đắk Lắk</option>
                            <option value="Lâm Đồng">Lâm Đồng</option>
                            <option value="Gia Lai">Gia Lai</option>
                            <option value="Đắk Nông">Đắk Nông</option>
                            <option value="Robusta London">London (Robusta)</option>
                            <option value="Arabica New York">New York (Arabica)</option>
                          </select>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Báo giá theo vùng
                      </span>
                    </div>

                    {isCommoditiesLoading ? (
                      <div className="space-y-2 my-2">
                        <Skeleton className="h-9 w-40" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    ) : (
                      <div className="my-2">
                        <div className="text-3xl font-extrabold tracking-tight text-foreground">
                          {coffeePrice != null ? `${Number(coffeePrice).toLocaleString("vi-VN")} ${coffeeQuote?.price?.currency === "VND" ? "đ" : coffeeQuote?.price?.currency || ""}` : "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <span>{coffeeQuote?.price?.date ? `Ghi nhận ${new Date(coffeeQuote.price.date).toLocaleDateString("vi-VN")}` : "Chưa có báo giá cho khu vực này"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Đơn vị: {coffeeData?.unit || "VNĐ/kg"}</span>
                    {coffeeData?.id && (
                      <button
                        onClick={() => setSelectedCommodityId(coffeeData.id)}
                        className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                      >
                        Vẽ biểu đồ <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Hồ tiêu & Nông sản chủ lực */}
                <div className="group rounded-2xl bg-card border p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold">Hồ tiêu & Nông sản</div>
                          <select
                            className="bg-transparent text-sm font-bold text-foreground outline-none cursor-pointer hover:text-primary transition-colors pr-2"
                            value={pepperLocation}
                            onChange={(e) => setPepperLocation(e.target.value)}
                          >
                            <option value="Đắk Lắk">Hồ tiêu Đắk Lắk</option>
                            <option value="Gia Lai">Hồ tiêu Gia Lai</option>
                            <option value="Bà Rịa">Hồ tiêu Vũng Tàu</option>
                            <option value="Bình Phước">Hồ tiêu Bình Phước</option>
                            <option value="Đắk Nông">Hồ tiêu Đắk Nông</option>
                          </select>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Nội địa
                      </span>
                    </div>

                    {isCommoditiesLoading ? (
                      <div className="space-y-2 my-2">
                        <Skeleton className="h-9 w-40" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    ) : (
                      <div className="my-2">
                        <div className="text-3xl font-extrabold tracking-tight text-foreground">
                          {pepperPrice != null ? `${Number(pepperPrice).toLocaleString("vi-VN")} ${pepperQuote?.price?.currency === "VND" ? "đ" : pepperQuote?.price?.currency || ""}` : "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <span>{pepperQuote?.price?.date ? `Ghi nhận ${new Date(pepperQuote.price.date).toLocaleDateString("vi-VN")}` : "Chưa có báo giá cho khu vực này"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Đơn vị: {pepperData?.unit || "VNĐ/kg"}</span>
                    {pepperData?.id && (
                      <button
                        onClick={() => setSelectedCommodityId(pepperData.id)}
                        className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                      >
                        Vẽ biểu đồ <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Thời tiết & Nông vụ */}
                <div className="group rounded-2xl bg-card border p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                          {weatherInfo?.icon_url ? (
                            <img src={weatherInfo.icon_url} alt="weather" className="w-6 h-6 object-contain" />
                          ) : (
                            <CloudSun className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-semibold">Thời tiết nông vụ</div>
                          <select
                            className="bg-transparent text-sm font-bold text-foreground outline-none cursor-pointer hover:text-primary transition-colors pr-2"
                            value={weatherLocation}
                            onChange={(e) => setWeatherLocation(e.target.value)}
                          >
                            <option value="">Vị trí hiện tại</option>
                            <option value="Đắk Lắk">Đắk Lắk</option>
                            <option value="Lâm Đồng">Lâm Đồng</option>
                            <option value="Gia Lai">Gia Lai</option>
                            <option value="Kon Tum">Kon Tum</option>
                            <option value="Cần Thơ">Cần Thơ</option>
                          </select>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {weatherInfo?.condition || "Cập nhật"}
                      </span>
                    </div>

                    {isWeatherLoading ? (
                      <div className="space-y-2 my-2">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    ) : (
                      <div className="my-2">
                        <div className="text-3xl font-extrabold tracking-tight text-foreground">
                          {weatherInfo?.temperature != null ? `${Math.round(weatherInfo.temperature)}°C` : "--°C"}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1 font-medium">
                            <Droplets className="h-3.5 w-3.5 text-blue-500" />
                            Độ ẩm {weatherInfo?.humidity ?? "--"}%
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <Wind className="h-3.5 w-3.5 text-blue-500" />
                            Gió {weatherInfo?.wind_speed ?? "--"} m/s
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{weatherInfo?.temperature != null ? "Kiểm tra dự báo trước khi canh tác" : "Chưa có dữ liệu thời tiết"}</span>
                    <Link href="/weather" className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                      Xem thời tiết <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Notification Banner (if any) */}
              {latestAnnouncement && (
                <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-4 md:p-5 shadow-sm text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-emerald-100 font-bold">
                        Thông báo hệ thống
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {latestAnnouncement.title}
                      </div>
                    </div>
                  </div>
                  <Link href="/market" className="shrink-0">
                    <Button size="sm" variant="secondary" className="font-semibold shadow-sm text-xs">
                      Xem thị trường <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Chart + Movers & Watchlist */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Biểu đồ giá trực quan */}
                <div className="lg:col-span-2">
                  <div className="rounded-2xl bg-card border p-6 shadow-sm flex flex-col justify-between h-full">
                    <div>
                      {/* Chart Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold">Biểu đồ biến động giá thị trường</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {currentChartCommodity ? (
                              <span>
                                Đang xem: <strong className="text-foreground">{currentChartCommodity.name}</strong> ({currentChartCommodity.unit || "VNĐ/kg"})
                              </span>
                            ) : (
                              "Biểu đồ giá cập nhật theo ngày"
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Commodity Dropdown */}
                          <select
                            className="bg-muted text-xs font-semibold rounded-xl px-3 py-2 border border-border/50 outline-none cursor-pointer max-w-[190px] truncate"
                            value={selectedCommodityId || ""}
                            onChange={(e) => setSelectedCommodityId(Number(e.target.value))}
                          >
                            {allCommodities.map((item: any) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>

                          {/* Timeframe pills */}
                          <div className="flex items-center bg-muted/80 p-0.5 rounded-xl border border-border/50 text-xs">
                            {[7, 14, 30].map((days) => (
                              <button
                                key={days}
                                onClick={() => setChartDays(days)}
                                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                                  chartDays === days
                                    ? "bg-card text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {days} ngày
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Mini stats bar */}
                      {chartData.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mb-6 p-3 rounded-xl bg-muted/40 border border-border/40 text-center">
                          <div>
                            <div className="text-[11px] text-muted-foreground">Giá hiện tại</div>
                            <div className="text-xs sm:text-sm font-bold text-foreground">
                              {chartData[chartData.length - 1]?.price?.toLocaleString("vi-VN")} đ
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-muted-foreground">Cao nhất</div>
                            <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              {chartStats.max.toLocaleString("vi-VN")} đ
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-muted-foreground">Thấp nhất</div>
                            <div className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">
                              {chartStats.min.toLocaleString("vi-VN")} đ
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-muted-foreground">Biến động ({chartDays}d)</div>
                            <div className={`text-xs sm:text-sm font-bold ${chartStats.changePct >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                              {chartStats.changePct >= 0 ? "+" : ""}
                              {chartStats.changePct.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recharts Area Container */}
                      <div className="w-full h-[300px]">
                        {isHistoryLoading ? (
                          <Skeleton className="h-[300px] w-full rounded-xl" />
                        ) : chartData.length === 0 ? (
                          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3 rounded-xl border border-dashed">
                            <BarChart3 className="h-8 w-8 opacity-40" />
                            <div className="text-center">
                              <p className="text-sm font-medium">Chưa có đủ dữ liệu lịch sử giá cho nông sản này</p>
                              <p className="text-xs text-muted-foreground mt-1">Bấm nút đồng bộ giá thị trường để cập nhật dữ liệu.</p>
                            </div>
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                              <defs>
                                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                              <XAxis
                                dataKey="date"
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                interval={Math.max(0, Math.floor(chartData.length / 7))}
                              />
                              <YAxis
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                                width={45}
                                domain={["auto", "auto"]}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                fill="url(#emeraldGradient)"
                                dot={false}
                                activeDot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#ffffff" }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
                      <span>Kiểm tra thời điểm và khu vực ghi nhận trước khi sử dụng báo giá.</span>
                      <Link href="/market" className="text-primary hover:underline font-semibold shrink-0">
                        Xem bảng giá chi tiết →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Column: Watchlist & Top Movers */}
                <div className="space-y-6">
                  {/* Top Movers (Biến động giá thị trường) */}
                  <div className="rounded-2xl bg-card border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-500" />
                        <h3 className="text-base font-bold">Mặt hàng sôi động</h3>
                      </div>
                      <Link href="/market" className="text-xs text-primary hover:underline font-medium">
                        Tất cả →
                      </Link>
                    </div>

                    <div className="space-y-2">
                      {isMoversLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full rounded-xl" />
                        ))
                      ) : movers.length === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl">
                          Chưa có biến động mới
                        </div>
                      ) : (
                        movers.slice(0, 5).map((m: any, idx: number) => {
                          const isSelected = selectedCommodityId === m.id
                          const isUp = m.change_pct > 0
                          const isDown = m.change_pct < 0

                          return (
                            <div
                              key={m.id}
                              onClick={() => setSelectedCommodityId(m.id)}
                              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                                isSelected
                                  ? "bg-primary/10 border-primary/30"
                                  : "border-transparent hover:bg-muted/60"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-xs font-extrabold shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                                  #{idx + 1}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold truncate group-hover:text-primary transition-colors">
                                    {m.name}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {Number(m.current_price).toLocaleString("vi-VN")} đ/{m.unit || "kg"}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span
                                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                    isUp
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : isDown
                                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {m.change_pct ? `${isUp ? "+" : ""}${m.change_pct.toFixed(1)}%` : "0%"}
                                </span>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {/* Watchlist */}
                  <div className="rounded-2xl bg-card border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <h3 className="text-base font-bold">Danh mục theo dõi</h3>
                      </div>
                      <Link href="/dashboard/alerts" className="text-xs text-primary hover:underline font-medium">
                        Cài cảnh báo
                      </Link>
                    </div>

                    <div className="space-y-2">
                      {isWatchlistLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full rounded-xl" />
                        ))
                      ) : watchlist.length === 0 ? (
                        <div className="py-6 px-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                          <p>Chưa có nông sản trong danh sách theo dõi.</p>
                          <Link href="/market">
                            <Button size="sm" variant="ghost" className="mt-2 text-primary font-semibold text-xs h-7">
                              Khám phá thị trường +
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        watchlist.slice(0, 4).map((w: any) => (
                          <div
                            key={w.id}
                            onClick={() => setSelectedCommodityId(w.id)}
                            className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-muted/60 transition-colors border border-transparent hover:border-border"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                {w.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold truncate">{w.name}</div>
                                <div className="text-[11px] text-muted-foreground">{w.unit}</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="rounded-2xl bg-card border p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Công cụ nhanh
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/dashboard/alerts" className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all border border-border/50 text-xs font-semibold">
                        <Bell className="h-4 w-4 text-primary" />
                        <span>Cảnh báo giá</span>
                      </Link>
                      <Link href="/pests" className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all border border-border/50 text-xs font-semibold">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>Nhận diện sâu bệnh</span>
                      </Link>
                      <Link href="/market" className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all border border-border/50 text-xs font-semibold">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <span>Sàn nông sản</span>
                      </Link>
                      <Link href="/forum" className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all border border-border/50 text-xs font-semibold">
                        <Layers className="h-4 w-4 text-emerald-500" />
                        <span>Diễn đàn nông dân</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </Section>
        </main>
      </div>
    </PageTransition>
  )
}
