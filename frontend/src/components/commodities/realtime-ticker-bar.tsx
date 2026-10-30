'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { commoditiesService } from '@/api/services/commodities.service'
import { cn } from '@/lib/utils'

interface PriceItem {
  id: number
  name: string
  current_price?: number | null
  price?: number | null
  price_change_percent?: number | null
  change_pct?: number | null
}

export function RealtimeTickerBar({ className }: { className?: string }) {
  const { data, isError, dataUpdatedAt } = useQuery({
    queryKey: ['market-price-strip'],
    queryFn: () => commoditiesService.getTopMovers(8),
    refetchInterval: 15_000,
  })
  const items: PriceItem[] = Array.isArray(data?.data) ? data.data : []

  if (!items.length) return null

  return (
    <section className={cn('rounded-xl border border-border bg-card', className)} aria-label="Giá nông sản cập nhật">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5 text-xs">
        <strong className="text-foreground">Giá thị trường</strong>
        <span className="text-muted-foreground">
          {isError ? 'Chưa cập nhật được dữ liệu mới' : `Tự kiểm tra mỗi 15 giây${dataUpdatedAt ? ` · ${new Date(dataUpdatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}`}
        </span>
      </div>
      <div className="flex gap-1 overflow-x-auto px-2 py-2" role="list">
        {items.map((item) => {
          const price = item.current_price ?? item.price
          const change = Number(item.price_change_percent ?? item.change_pct ?? 0)
          return (
            <Link key={item.id} href={`/commodities/${item.id}`} role="listitem" className="flex min-w-[170px] flex-1 flex-col gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-muted/60">
              <span className="truncate text-xs text-muted-foreground">{item.name}</span>
              <span className="text-sm font-semibold tabular-nums">{typeof price === 'number' ? `${Math.round(price).toLocaleString('vi-VN')} đ` : 'Chưa có giá'}</span>
              <span className={cn('text-xs font-medium tabular-nums', change > 0 ? 'text-emerald-700 dark:text-emerald-400' : change < 0 ? 'text-red-700 dark:text-red-400' : 'text-muted-foreground')}>
                {change > 0 ? '▲ +' : change < 0 ? '▼ ' : '— '}{change.toFixed(2)}%
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
