'use client'

import * as React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Download,
  RefreshCw,
} from 'lucide-react'

import { coffeeService } from '@/api/services/coffee.service'
import { commoditiesService } from '@/api/services/commodities.service'
import { MarketLineChart } from '@/components/commodities/market-line-chart'
import { DataState } from '@/components/data-display/data-state'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface CoffeeItem {
  id: number
  name: string
  code?: string
  current_price?: number | null
  price_change?: number | null
  price_change_percent?: number | null
  updated_at?: string | null
}

interface PricePoint {
  date: string
  price: number
}

const PERIODS = [
  { label: '24 giờ', value: 1 },
  { label: '7 ngày', value: 7 },
  { label: '30 ngày', value: 30 },
  { label: '90 ngày', value: 90 },
]
const DOMESTIC_COFFEE_CODES = new Set([
  'coffee_dak_lak',
  'coffee_lam_dong',
  'coffee_gia_lai',
  'coffee_dak_nông',
  'coffee_kon_tum',
])
const formatPrice = (price?: number | null) =>
  typeof price === 'number' && Number.isFinite(price)
    ? Math.round(price).toLocaleString('vi-VN')
    : '—'
const regionName = (name: string) => name.replace(/^Cà phê\s+/i, '')

export default function CoffeePage() {
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [days, setDays] = React.useState(30)
  const coffeeQuery = useQuery({
    queryKey: ['coffee-data'],
    queryFn: () => coffeeService.getCoffeeData({ size: 100 }),
    refetchInterval: 15_000,
  })
  const items: CoffeeItem[] = (coffeeQuery.data?.data?.items || []).filter(
    (item: CoffeeItem) => DOMESTIC_COFFEE_CODES.has(item.code || '')
  )
  const selected = items.find((item) => item.id === selectedId) || items[0]
  const historyQuery = useQuery({
    queryKey: ['coffee-history', selected?.id, Math.max(days, 7)],
    queryFn: () =>
      commoditiesService.getPriceHistory(selected.id, Math.max(days, 7)),
    enabled: Boolean(selected?.id),
    refetchInterval: 15_000,
  })
  const history: PricePoint[] = Array.isArray(historyQuery.data?.data)
    ? historyQuery.data.data
    : []
  const chartData = history
    .filter(
      (point) =>
        Number.isFinite(Number(point.price)) &&
        Number.isFinite(new Date(point.date).getTime())
    )
    .map((point) => ({
      date: point.date,
      timestamp: new Date(point.date).getTime(),
      price: Number(point.price),
    }))
    .filter(
      (point) =>
        days !== 1 || point.timestamp >= Date.now() - 24 * 60 * 60 * 1000
    )
    .sort((a, b) => a.timestamp - b.timestamp)

  const firstPrice = chartData[0]?.price
  const lastPrice = chartData.at(-1)?.price
  const chartChange =
    firstPrice && lastPrice !== undefined
      ? ((lastPrice - firstPrice) / firstPrice) * 100
      : null
  const chartLow = chartData.length
    ? Math.min(...chartData.map((point) => point.price))
    : null
  const chartHigh = chartData.length
    ? Math.max(...chartData.map((point) => point.price))
    : null
  const recordedAt = chartData.at(-1)?.date || selected?.updated_at
  const stale = recordedAt
    ? Date.now() - new Date(recordedAt).getTime() > 30 * 60 * 1000
    : true

  const exportCsv = () => {
    if (!items.length) return
    const csv =
      '\uFEFF' +
      [
        'KhuVuc,Ma,Gia_VND_kg,ThayDoi_VND,ThayDoi_PhanTram,CapNhat',
        ...items.map((item) =>
          [
            `"${item.name.replace(/"/g, '""')}"`,
            `"${item.code || ''}"`,
            item.current_price ?? '',
            item.price_change ?? '',
            item.price_change_percent ?? '',
            item.updated_at || '',
          ].join(',')
        ),
      ].join('\n')
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'gia-ca-phe.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="pb-16">
      <div className="border-border bg-card border-b">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
              Thị trường nông sản
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight md:text-3xl">
              Giá cà phê Việt Nam
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-xs sm:block">
              Giá tham khảo · tự kiểm tra mỗi 15 giây
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCsv}
              disabled={!items.length}
            >
              <Download className="h-4 w-4" /> Xuất CSV
            </Button>
          </div>
        </Container>
      </div>

      <Container className="space-y-5 py-4">
        {coffeeQuery.isLoading ? (
          <Skeleton className="h-[560px] w-full" />
        ) : coffeeQuery.isError ? (
          <DataState
            title="Không thể tải giá cà phê"
            description="Vui lòng kiểm tra kết nối rồi thử lại."
            action={
              <Button onClick={() => coffeeQuery.refetch()}>Thử lại</Button>
            }
          />
        ) : !items.length ? (
          <DataState title="Chưa có dữ liệu giá cà phê" />
        ) : (
          <>
            <section className="border-border bg-card overflow-hidden rounded-xl border">
              <div className="border-border flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b px-4 py-3 sm:px-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-lg font-semibold">{selected.name}</h2>
                    <span
                      className={cn(
                        'text-xs font-medium',
                        stale
                          ? 'text-amber-700 dark:text-amber-300'
                          : 'text-emerald-700 dark:text-emerald-300'
                      )}
                    >
                      {stale ? 'Dữ liệu chưa mới' : 'Dữ liệu mới ghi nhận'}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <strong className="text-3xl font-bold tracking-tight tabular-nums">
                      {formatPrice(lastPrice ?? selected.current_price)}{' '}
                      <span className="text-muted-foreground text-sm font-normal">
                        đ/kg
                      </span>
                    </strong>
                    {chartChange !== null && (
                      <span
                        className={cn(
                          'inline-flex items-center text-sm font-semibold tabular-nums',
                          chartChange > 0
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : chartChange < 0
                              ? 'text-red-700 dark:text-red-300'
                              : 'text-muted-foreground'
                        )}
                      >
                        {chartChange > 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : chartChange < 0 ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : null}
                        {chartChange > 0 ? '+' : ''}
                        {chartChange.toFixed(2)}% trong kỳ
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>
                    {recordedAt
                      ? `Giá ghi nhận ${new Date(recordedAt).toLocaleString('vi-VN')}`
                      : 'Chưa rõ thời điểm ghi nhận'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      coffeeQuery.refetch()
                      historyQuery.refetch()
                    }}
                    aria-label="Làm mới dữ liệu giá"
                  >
                    <RefreshCw
                      className={cn(
                        'h-4 w-4',
                        (coffeeQuery.isFetching || historyQuery.isFetching) &&
                          'animate-spin'
                      )}
                    />
                  </Button>
                </div>
              </div>

              <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2 sm:px-6">
                <div className="flex flex-wrap gap-1" aria-label="Chọn khu vực">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      aria-pressed={selected.id === item.id}
                      className={cn(
                        'rounded-md px-2.5 py-1.5 text-sm transition-colors',
                        selected.id === item.id
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {regionName(item.name)}
                    </button>
                  ))}
                </div>
                <div
                  className="bg-muted flex gap-0.5 rounded-md p-0.5"
                  aria-label="Khoảng thời gian"
                >
                  {PERIODS.map((period) => (
                    <button
                      key={period.value}
                      type="button"
                      onClick={() => setDays(period.value)}
                      aria-pressed={days === period.value}
                      className={cn(
                        'rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap',
                        days === period.value
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#111b16] px-3 pt-3 pb-4 text-[#eaf3ec] sm:px-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#b2c2b6]">
                  <span>
                    Diễn biến thực tế ·{' '}
                    <span className="text-[#56d99a]">Tăng</span> /{' '}
                    <span className="text-[#fb817e]">Giảm</span> /{' '}
                    <span className="text-[#a9b9ae]">Không đổi</span>
                  </span>
                  <span>{chartData.length} mốc ghi nhận</span>
                </div>
                {historyQuery.isLoading ? (
                  <Skeleton className="h-[340px] w-full" />
                ) : historyQuery.isError ? (
                  <DataState
                    className="border-0"
                    title="Không thể tải lịch sử giá"
                    action={
                      <Button
                        variant="outline"
                        onClick={() => historyQuery.refetch()}
                      >
                        Thử lại
                      </Button>
                    }
                  />
                ) : !chartData.length ? (
                  <div className="flex h-[340px] items-center justify-center text-center text-sm text-[#b2c2b6]">
                    Chưa có mốc giá trong khoảng này. Hãy chọn 7 hoặc 30 ngày.
                  </div>
                ) : (
                  <MarketLineChart
                    points={chartData}
                    label={`Diễn biến giá ${selected.name}`}
                    intraday={days === 1}
                  />
                )}
                <p className="mt-2 px-1 text-xs text-[#a9b9ae]">
                  Đồ thị nối các lần ghi nhận, không phải giá giao dịch từng
                  giây. Lịch sử cũ có thể chứa dữ liệu mẫu, cần đối soát nguồn.
                </p>
              </div>

              <div className="divide-border grid grid-cols-2 divide-x divide-y sm:grid-cols-4 sm:divide-y-0">
                <div className="px-4 py-3">
                  <p className="text-muted-foreground text-xs">Đầu kỳ</p>
                  <p className="mt-1 font-semibold tabular-nums">
                    {formatPrice(firstPrice)} đ/kg
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-muted-foreground text-xs">Cuối kỳ</p>
                  <p className="mt-1 font-semibold tabular-nums">
                    {formatPrice(lastPrice)} đ/kg
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-muted-foreground text-xs">Thấp nhất</p>
                  <p className="mt-1 font-semibold tabular-nums">
                    {formatPrice(chartLow)} đ/kg
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-muted-foreground text-xs">Cao nhất</p>
                  <p className="mt-1 font-semibold tabular-nums">
                    {formatPrice(chartHigh)} đ/kg
                  </p>
                </div>
              </div>
            </section>

            <section className="border-border bg-card overflow-hidden rounded-xl border">
              <div className="border-border flex flex-wrap items-baseline justify-between gap-2 border-b px-5 py-3">
                <h2 className="font-semibold">Giá theo khu vực</h2>
                <span className="text-muted-foreground text-xs">
                  Chọn một khu vực để xem chi tiết
                </span>
              </div>
              <div className="divide-border divide-y">
                {items.map((item) => {
                  const change = Number(item.price_change_percent ?? 0)
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex flex-wrap items-center justify-between gap-3 px-5 py-3',
                        item.id === selected.id && 'bg-primary/5'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className="min-w-0 text-left font-medium hover:underline"
                      >
                        {item.name}
                      </button>
                      <div className="flex items-center gap-4 sm:gap-7">
                        <span className="font-semibold tabular-nums">
                          {formatPrice(item.current_price)}{' '}
                          <span className="text-muted-foreground text-xs font-normal">
                            đ/kg
                          </span>
                        </span>
                        <span
                          className={cn(
                            'w-20 text-right text-sm font-medium tabular-nums',
                            change > 0
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : change < 0
                                ? 'text-red-700 dark:text-red-300'
                                : 'text-muted-foreground'
                          )}
                        >
                          {change > 0 ? '+' : ''}
                          {change.toFixed(2)}%
                        </span>
                        <Link
                          href={`/commodities/${item.id}`}
                          aria-label={`Chi tiết ${item.name}`}
                          className="text-primary"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </Container>
    </main>
  )
}
