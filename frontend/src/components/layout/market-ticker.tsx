"use client"

import * as React from "react"
import Link from "next/link"
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
    <div className="w-full bg-emerald-950 text-emerald-50 border-b border-emerald-900/80 overflow-hidden flex items-center h-9 text-xs select-none">
      <div className="flex-shrink-0 bg-amber-100 text-amber-950 px-3.5 py-1.5 font-extrabold z-10 shadow-sm flex items-center gap-2 h-full uppercase text-[11px] tracking-wider border-r border-amber-200">
        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
        <span className="hidden sm:inline">Bảng giá Live 2026</span>
        <span className="sm:hidden">LIVE</span>
      </div>
      <div className="relative flex-1 overflow-hidden flex items-center h-full">
        <div className="animate-ticker hover:[animation-play-state:paused] flex whitespace-nowrap items-center h-full">
          {displayItems.map((item: any, i: number) => {
            const price = item.current_price ?? item.price ?? 0
            const changePct = item.change_pct ?? 0
            const isUp = changePct > 0
            const isDown = changePct < 0
            const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus
            const badgeClass = isUp
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
              : isDown
              ? "bg-amber-400/20 text-amber-200 border-amber-400/30"
              : "bg-emerald-900/80 text-emerald-200 border-emerald-800"

            return (
              <Link
                key={`${item.id}-${i}`}
                href={`/commodities/${item.id}`}
                className="inline-flex items-center gap-2.5 px-5 border-r border-emerald-900/80 hover:bg-emerald-900/60 transition-colors h-full"
              >
                <span className="font-semibold text-white">{item.name}</span>
                <span className="font-mono font-bold tabular-nums text-amber-100">
                  {new Intl.NumberFormat("vi-VN").format(Math.round(price))}
                  <span className="text-[10px] font-normal text-emerald-300/80 ml-0.5">
                    đ/{String(item.unit || "kg").replace(/^(VND|VNĐ|đ)\s*\/\s*/i, "")}
                  </span>
                </span>
                <span className={`inline-flex items-center font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border tabular-nums ${badgeClass}`}>
                  <Icon className="h-2.5 w-2.5 mr-0.5" />
                  {isUp ? "+" : isDown ? "-" : ""}
                  {Math.abs(Number(changePct)).toFixed(2)}%
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
