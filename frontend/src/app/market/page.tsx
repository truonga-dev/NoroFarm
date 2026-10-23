"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { TrendingUp, TrendingDown, Minus, Search, RefreshCw, Activity } from "lucide-react"
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { commoditiesService } from "@/api/services/commodities.service"

function SparklineTooltip({ active, payload }: any) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-card px-2 py-1 shadow text-xs">
        <p className="font-medium">{Number(payload[0].value).toLocaleString("vi-VN")} đ</p>
      </div>
    )
  }
  return null
}

function CommodityCard({ item }: { item: any }) {
  const isTrending = item.change_pct !== null ? item.change_pct > 0 : null
  const isFlat = item.change_pct === null || item.change_pct === 0

  return (
    <Link href={`/commodities/${item.id}`}>
      <div className="group bg-card rounded-2xl border p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.code}</span>
              {item.category && (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">{item.category}</span>
              )}
            </div>
            <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1 mt-1">{item.name}</h3>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ml-2 ${
            isFlat ? "bg-muted text-muted-foreground" :
            isTrending ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {isFlat ? <Minus className="w-3 h-3" /> : isTrending ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {item.change_pct !== null ? `${item.change_pct > 0 ? "+" : ""}${item.change_pct.toFixed(2)}%` : "—"}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold">
              {item.current_price.toLocaleString("vi-VN")}
              <span className="text-sm text-muted-foreground font-normal ml-1">đ/{item.unit}</span>
            </div>
            {item.prev_price && (
              <div className="text-xs text-muted-foreground mt-0.5">
                Trước: {item.prev_price.toLocaleString("vi-VN")} đ
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Cập nhật: {new Date(item.updated_at).toLocaleDateString("vi-VN")}
        </div>
      </div>
    </Link>
  )
}

function CommodityRow({ item }: { item: any }) {
  const isTrending = item.change_pct !== null ? item.change_pct > 0 : null
  const isFlat = item.change_pct === null || item.change_pct === 0

  return (
    <Link href={`/commodities/${item.id}`}>
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-muted/40 transition-colors border-b last:border-b-0 group cursor-pointer">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/10 text-primary text-xs font-bold shrink-0">
          {item.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="font-semibold group-hover:text-primary transition-colors">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.code} · {item.category || "—"}</div>
        </div>
        <div className="text-right">
          <div className="font-bold">{item.current_price.toLocaleString("vi-VN")} đ</div>
          <div className="text-xs text-muted-foreground">/{item.unit}</div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          isFlat ? "text-muted-foreground" :
          isTrending ? "text-emerald-500" : "text-red-500"
        }`}>
          {isFlat ? <Minus className="w-4 h-4" /> : isTrending ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {item.change_pct !== null ? `${item.change_pct > 0 ? "+" : ""}${item.change_pct.toFixed(2)}%` : "—"}
        </div>
        <div className="text-xs text-muted-foreground text-right hidden sm:block">
          {new Date(item.updated_at).toLocaleDateString("vi-VN")}
        </div>
      </div>
    </Link>
  )
}

export default function MarketPage() {
  const [search, setSearch] = React.useState("")
  const [view, setView] = React.useState<"grid" | "list">("list")

  const { data: moversData, isLoading: isLoadingMovers, refetch, isFetching } = useQuery({
    queryKey: ["top-movers"],
    queryFn: async () => {
      const res = await commoditiesService.getTopMovers(20)
      return res.data
    }
  })

  const { data: allData, isLoading: isLoadingAll } = useQuery({
    queryKey: ["all-commodities-market", search],
    queryFn: async () => {
      const res = await commoditiesService.getCommodities({ size: 50, search })
      return res.data
    }
  })

  const movers: any[] = moversData?.data || moversData || []
  const allCommodities: any[] = allData?.items || allData?.data?.items || []

  // Filtered from all commodities if searching, else show top movers
  const displayList = search
    ? allCommodities.map((c: any) => ({
        ...c,
        current_price: c.prices?.[0]?.price || 0,
        prev_price: c.prices?.[1]?.price || null,
        change_pct: c.prices?.[0]?.price && c.prices?.[1]?.price
          ? ((c.prices[0].price - c.prices[1].price) / c.prices[1].price * 100)
          : null,
        updated_at: c.prices?.[0]?.date || c.updated_at,
      }))
    : movers

  const gainers = movers.filter(m => (m.change_pct || 0) > 0).slice(0, 3)
  const losers = movers.filter(m => (m.change_pct || 0) < 0).slice(0, 3)

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary/5 via-emerald-500/5 to-transparent border-b py-10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Thị trường Nông sản</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Bảng Giá Thị Trường</h1>
              <p className="text-muted-foreground mt-1">
                Cập nhật giá thực từ hệ thống — {movers.length} mặt hàng đang theo dõi
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-8 space-y-8">
        {/* Top Gainers / Losers */}
        {!isLoadingMovers && (gainers.length > 0 || losers.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gainers.length > 0 && (
              <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 dark:bg-emerald-950/30 border-b">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Tăng mạnh</span>
                </div>
                {gainers.map((m, i) => (
                  <Link key={m.id} href={`/commodities/${m.id}`}>
                    <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors border-b last:border-b-0">
                      <div>
                        <div className="font-medium text-sm">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.current_price.toLocaleString("vi-VN")} đ</div>
                      </div>
                      <span className="text-emerald-600 font-bold text-sm">+{m.change_pct?.toFixed(2)}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {losers.length > 0 && (
              <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 bg-red-50 dark:bg-red-950/30 border-b">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-700 dark:text-red-400">Giảm mạnh</span>
                </div>
                {losers.map((m, i) => (
                  <Link key={m.id} href={`/commodities/${m.id}`}>
                    <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors border-b last:border-b-0">
                      <div>
                        <div className="font-medium text-sm">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.current_price.toLocaleString("vi-VN")} đ</div>
                      </div>
                      <span className="text-red-500 font-bold text-sm">{m.change_pct?.toFixed(2)}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search & View toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm nông sản..."
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-muted rounded-xl p-1">
            <button onClick={() => setView("list")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === "list" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
              Danh sách
            </button>
            <button onClick={() => setView("grid")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === "grid" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
              Lưới
            </button>
          </div>
        </div>

        {/* Main Table / Grid */}
        {isLoadingMovers && !search ? (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : displayList.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <Activity className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>Không tìm thấy mặt hàng nào</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayList.map((item: any) => <CommodityCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-6 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b">
              <div></div>
              <div>Tên nông sản</div>
              <div className="text-right">Giá</div>
              <div>Biến động</div>
              <div className="text-right hidden sm:block">Cập nhật</div>
            </div>
            {displayList.map((item: any) => <CommodityRow key={item.id} item={item} />)}
          </div>
        )}
      </Container>
    </div>
  )
}
