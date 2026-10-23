"use client"

import * as React from "react"
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
            setWeather(data)
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
        setWeather(data)
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
            <div key={index} className="h-28 animate-pulse rounded-2xl border bg-card/60" aria-hidden="true" />
          ))}
          {!isPricesLoading && prices.length === 0 && (
            <div className="col-span-2 flex min-h-28 items-center justify-center rounded-2xl border bg-card/60 p-4 text-center text-sm text-muted-foreground md:col-span-4">
              {isPricesError ? "Không tải được báo giá. Vui lòng thử lại sau." : "Chưa có báo giá được cập nhật."}
            </div>
          )}
          {prices.map((item: any, idx: number) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 rounded-2xl border bg-card/60 backdrop-blur-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-medium text-muted-foreground">{item.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-bold">{Number(item.current_price).toLocaleString("vi-VN")}</span>
                <span className="text-xs text-muted-foreground">đ/{item.unit || "kg"}</span>
              </div>
              <div className={cn("mt-1 flex items-center text-xs font-medium", item.change_pct > 0 ? "text-emerald-500" : item.change_pct < 0 ? "text-rose-500" : "text-muted-foreground")}>
                {item.change_pct > 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : item.change_pct < 0 ? <ArrowDownRight className="mr-1 h-3 w-3" /> : null}
                {item.change_pct != null ? `${item.change_pct > 0 ? "+" : ""}${Number(item.change_pct).toFixed(1)}%` : "Chưa có biến động"}
              </div>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="col-span-2 rounded-2xl border bg-primary/5 backdrop-blur-xl p-4 shadow-sm flex items-center justify-around"
          >
            {loading ? (
              <div className="text-xs text-muted-foreground animate-pulse py-2">Đang tải thời tiết...</div>
            ) : (
              <>
                <div className="flex flex-col items-center gap-1">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <span className="text-lg font-bold">
                    {weather?.temperature != null ? `${Math.round(weather.temperature)}°C` : "--°C"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                    {weather?.location || "Vị trí"}
                  </span>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex flex-col items-center gap-1">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span className="text-lg font-bold">
                    {weather?.humidity != null ? `${weather.humidity}%` : "--%"}
                  </span>
                  <span className="text-xs text-muted-foreground">Độ ẩm</span>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex flex-col items-center gap-1">
                  <Wind className="h-5 w-5 text-teal-500" />
                  <span className="text-lg font-bold">
                    {weather?.wind_speed != null ? `${weather.wind_speed} m/s` : "-- m/s"}
                  </span>
                  <span className="text-xs text-muted-foreground">Gió</span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
