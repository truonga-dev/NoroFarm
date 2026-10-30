"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, Droplets, Thermometer, Wind } from "lucide-react"
import { Container } from "@/components/layout/container"
import { cn } from "@/lib/utils"
import { weatherService } from "@/api/services/weather.service"
import { commoditiesService } from "@/api/services/commodities.service"
import { useQuery } from "@tanstack/react-query"

const FALLBACK_WEATHER = {
  temperature: null,
  humidity: null,
  wind_speed: null,
  location: "Chưa có dữ liệu",
}

export function QuickOverview() {
  const [weather, setWeather] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const { data: moversResponse, isLoading: isPricesLoading, isError: isPricesError } = useQuery({
    queryKey: ["ticker-prices"],
    queryFn: async () => {
      const response = await commoditiesService.getTopMovers(10)
      return response.data
    },
  })
  const movers = moversResponse?.data || moversResponse || []
  const prices = Array.isArray(movers) ? movers.slice(0, 4) : []

  React.useEffect(() => {
    // Attempt to get user geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const data = await weatherService.getCurrentWeather(
              undefined,
              position.coords.latitude,
              position.coords.longitude
            )
            setWeather(data?.data || data)
          } catch {
            await fetchFallbackWeather()
          } finally {
            setLoading(false)
          }
        },
        () => {
          fetchFallbackWeather()
        }
      )
    } else {
      fetchFallbackWeather()
    }

    async function fetchFallbackWeather() {
      try {
        const data = await weatherService.getCurrentWeather()
        setWeather(data?.data || data)
      } catch {
        // The landing page remains usable while the API is starting or offline.
        setWeather(FALLBACK_WEATHER)
      } finally {
        setLoading(false)
      }
    }
  }, [])

  return (
    <section className="relative z-10 -mt-8 md:-mt-12">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isPricesLoading && Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl border bg-card/70" aria-hidden="true" />
          ))}
          {!isPricesLoading && prices.length === 0 && (
            <div className="col-span-2 flex min-h-32 items-center justify-center rounded-2xl border bg-card/70 p-4 text-center text-sm text-muted-foreground md:col-span-4">
              {isPricesError ? "Không tải được báo giá. Vui lòng thử lại sau." : "Chưa có báo giá được cập nhật."}
            </div>
          )}
          {prices.map((item: any, idx: number) => {
            const isUp = Number(item.change_pct || 0) >= 0
            return (
              <Link key={item.id || item.name} href={`/commodities/${item.id}`} className="col-span-1 md:col-span-1 lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className={cn("absolute inset-x-0 top-0 h-1", isUp ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-rose-500 to-amber-500")} />
                  <div className="flex items-center justify-between gap-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                      {item.name}
                    </h3>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <div className="my-2 flex items-baseline gap-1">
                    <span className="text-xl font-extrabold tracking-tight tabular-nums text-foreground">
                      {Math.round(Number(item.current_price)).toLocaleString("vi-VN")}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      đ/{String(item.unit || "kg").replace(/^(VND|VNĐ|đ)\s*\/\s*/i, "")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                        item.change_pct > 0
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : item.change_pct < 0
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.change_pct > 0 ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : item.change_pct < 0 ? <ArrowDownRight className="mr-0.5 h-3 w-3" /> : null}
                      {item.change_pct != null ? `${item.change_pct > 0 ? "+" : ""}${Number(item.change_pct).toFixed(2)}%` : "0.00%"}
                    </span>
                    <span className="text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Chi tiết →
                    </span>
                  </div>
                </motion.div>
              </Link>
            )
          })}
          
          <Link href="/weather" className="col-span-2 block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/90 to-emerald-500/5 backdrop-blur-xl p-4 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex items-center justify-around"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-sky-500" />
              {loading ? (
                <div className="text-xs text-muted-foreground animate-pulse py-2">Đang tải trạm khí tượng...</div>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                      <Thermometer className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-extrabold tabular-nums text-foreground">
                      {weather?.temperature != null ? `${Math.round(weather.temperature)}°C` : "--°C"}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground truncate max-w-[90px]">
                      {weather?.location || "Tây Nguyên"}
                    </span>
                  </div>
                  <div className="w-px h-12 bg-border/70" />
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                      <Droplets className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-extrabold tabular-nums text-foreground">
                      {weather?.humidity != null ? `${Math.round(weather.humidity)}%` : "--%"}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Độ ẩm</span>
                  </div>
                  <div className="w-px h-12 bg-border/70" />
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                      <Wind className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-extrabold tabular-nums text-foreground">
                      {weather?.wind_speed != null ? `${weather.wind_speed} m/s` : "-- m/s"}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Sức gió</span>
                  </div>
                </>
              )}
            </motion.div>
          </Link>
        </div>
      </Container>
    </section>
  )
}
