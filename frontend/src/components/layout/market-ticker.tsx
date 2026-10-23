"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { commoditiesService } from "@/api/services/commodities.service"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function MarketTicker() {
  const { data: topMovers } = useQuery({
    queryKey: ["ticker-prices"],
    queryFn: async () => {
      const res = await commoditiesService.getTopMovers(10)
      return res.data
    },
    refetchInterval: 60000 // Refetch every minute
  })

  const items = topMovers?.data || topMovers || []

  if (items.length === 0) return null

  // Duplicate items to create a seamless loop
  const displayItems = [...items, ...items]

  return (
    <div className="w-full bg-slate-900 text-slate-50 border-b border-slate-800 overflow-hidden flex items-center h-10 text-sm">
      <div className="flex-shrink-0 bg-primary px-4 py-2 font-bold z-10 shadow-md flex items-center gap-2 h-full uppercase text-xs tracking-wider">
        <span className="hidden sm:inline">Thị trường</span>
        <span className="sm:hidden">Giá</span>
      </div>
      <div className="relative flex-1 overflow-hidden flex items-center h-full">
        <div className="animate-ticker flex whitespace-nowrap items-center h-full">
          {displayItems.map((item: any, i: number) => {
            const isUp = item.change_pct > 0
            const isDown = item.change_pct < 0
            const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus
            const colorClass = isUp ? "text-emerald-400" : isDown ? "text-red-400" : "text-slate-300"

            return (
              <div key={`${item.id}-${i}`} className="inline-flex items-center gap-2 px-6 border-r border-slate-800">
                <span className="font-semibold text-white">{item.name}</span>
                <span className="font-mono text-slate-300">
                  {new Intl.NumberFormat("vi-VN").format(item.price)}đ/{item.unit}
                </span>
                <span className={`flex items-center font-mono font-medium ${colorClass}`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {Math.abs(item.change_pct)}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
