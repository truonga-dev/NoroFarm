'use client'

import * as React from 'react'
import Link from 'next/link'
import { useQueries, useQuery } from '@tanstack/react-query'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Download,
  GitCompare,
  RefreshCw,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { coffeeService } from '@/api/services/coffee.service'
import { commoditiesService } from '@/api/services/commodities.service'
import { DataState } from '@/components/data-display/data-state'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PricePoint {
  date: string
  price: number
}
interface CoffeeItem {
  id: number
  name: string
  code?: string
  current_price?: number
  price_change?: number
  price_change_percent?: number
  updated_at?: string
  prices?: PricePoint[]
}

const COMPARE_COLORS = ['#28704a', '#9a642b', '#5d7188', '#855f72']
const PERIODS = [7, 14, 30]
const formatPrice = (value?: number | null) =>
  typeof value === 'number' && value > 0
    ? Math.round(value).toLocaleString('vi-VN')
    : '—'

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="border-border bg-popover min-w-36 rounded-lg border px-3 py-2 shadow-md">
      <p className="text-muted-foreground border-border mb-1.5 border-b pb-1.5 text-xs">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry: any) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4 text-xs"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: entry.color || 'hsl(var(--primary))',
                }}
              />
              {entry.name === 'price' ? 'Giá' : entry.name}
            </span>
            <strong className="tabular-nums">
              {formatPrice(Number(entry.value))} đ
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CoffeePage() {
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [days, setDays] = React.useState(7)
  const [isCompareMode, setIsCompareMode] = React.useState(false)
  const [compareIds, setCompareIds] = React.useState<number[]>([])
  const [isSyncing, setIsSyncing] = React.useState(false)

  const coffeeQuery = useQuery({
    queryKey: ['coffee-data'],
    queryFn: () => coffeeService.getCoffeeData(),
  })
  const coffeePrices: CoffeeItem[] = React.useMemo(
    () => coffeeQuery.data?.data?.items || [],
    [coffeeQuery.data]
  )
  const activeCoffee =
    coffeePrices.find((item) => item.id === selectedId) || coffeePrices[0]
  const activeCoffeeId = activeCoffee?.id
  const effectiveCompareIds = React.useMemo(
    () =>
      compareIds.length
        ? compareIds
        : coffeePrices.slice(0, 3).map((item) => item.id),
    [compareIds, coffeePrices]
  )

  const historyQuery = useQuery({
    queryKey: ['coffee-history', activeCoffeeId, days],
    queryFn: async () =>
      (await commoditiesService.getPriceHistory(activeCoffeeId!, days)).data,
    enabled: Boolean(activeCoffeeId) && !isCompareMode,
  })
  const compareQueries = useQueries({
    queries: (isCompareMode ? effectiveCompareIds : []).map((id) => ({
      queryKey: ['coffee-compare-history', id, days],
      queryFn: async () => {
        const response = await commoditiesService.getPriceHistory(id, days)
        const value = response.data?.data || response.data || []
        return { id, items: Array.isArray(value) ? value : [] }
      },
    })),
  })

  const rawHistory = historyQuery.data?.data || historyQuery.data || []
  const history: PricePoint[] =
    Array.isArray(rawHistory) && rawHistory.length
      ? rawHistory
      : [...(activeCoffee?.prices || [])].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
  const chartData = history.map((point) => ({
    date: new Date(point.date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    }),
    price: Math.round(Number(point.price)),
  }))

  const compareChartData = React.useMemo(() => {
    if (!isCompareMode) return []
    const dates = new Map<string, Record<string, string | number>>()
    effectiveCompareIds.forEach((id, index) => {
      const item = coffeePrices.find((coffee) => coffee.id === id)
      if (!item) return
      const queryValue = compareQueries[index]?.data
      const points: PricePoint[] = queryValue?.items?.length
        ? queryValue.items
        : item.prices || []
      points.forEach((point) => {
        const date = new Date(point.date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
        })
        const row = dates.get(date) || { date }
        row[item.name] = Math.round(Number(point.price))
        dates.set(date, row)
      })
    })
    return Array.from(dates.values())
  }, [coffeePrices, compareQueries, effectiveCompareIds, isCompareMode])

  const validPrices = coffeePrices
    .map((item) => item.current_price ?? item.prices?.[0]?.price)
    .filter((price): price is number => typeof price === 'number' && price > 0)
  const avgPrice = validPrices.length
    ? validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length
    : null
  const maxPrice = validPrices.length ? Math.max(...validPrices) : null
  const minPrice = validPrices.length ? Math.min(...validPrices) : null
  const highestItem = coffeePrices.find(
    (item) => (item.current_price ?? item.prices?.[0]?.price) === maxPrice
  )
  const lastUpdated = coffeePrices
    .map((item) => item.prices?.[0]?.date || item.updated_at)
    .filter(Boolean)
    .map((date) => new Date(date!).getTime())
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0]

  const toggleCompareId = (id: number) => {
    const current = compareIds.length ? compareIds : effectiveCompareIds
    if (current.includes(id)) {
      if (current.length > 1)
        setCompareIds(current.filter((value) => value !== id))
    } else if (current.length < 4) {
      setCompareIds([...current, id])
    }
  }

  const syncPrices = async () => {
    setIsSyncing(true)
    try {
      await commoditiesService.crawlLive()
      await coffeeQuery.refetch()
      if (activeCoffeeId) await historyQuery.refetch()
    } finally {
      setIsSyncing(false)
    }
  }

  const exportCsv = () => {
    if (!coffeePrices.length) return
    const rows = coffeePrices.map((item) => {
      const price = Math.round(
        item.current_price ?? item.prices?.[0]?.price ?? 0
      )
      const change = Math.round(item.price_change ?? 0)
      const date = item.prices?.[0]?.date || item.updated_at || ''
      return [
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.code || ''}"`,
        price,
        change,
        item.price_change_percent ?? 0,
        `"${date ? new Date(date).toLocaleDateString('vi-VN') : ''}"`,
      ].join(',')
    })
    const csv =
      '\uFEFF' +
      [
        'KhuVuc,Ma,Gia_VND_kg,ThayDoi_VND,ThayDoi_PhanTram,CapNhat',
        ...rows,
      ].join('\n')
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'bang-gia-ca-phe.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="pb-16 md:pb-20">
      <div className="border-border bg-card border-b">
        <Container className="py-7 md:py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-primary text-sm font-semibold">
                Dữ liệu chuyên ngành
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
                Giá cà phê
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
                Theo dõi giá cà phê tại các tỉnh Tây Nguyên và thị trường quốc
                tế.
              </p>
              {lastUpdated && (
                <p className="text-muted-foreground mt-2 text-xs">
                  Cập nhật gần nhất:{' '}
                  {new Date(lastUpdated).toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={exportCsv}
                disabled={!coffeePrices.length}
              >
                <Download className="h-4 w-4" />
                Xuất CSV
              </Button>
              <Button onClick={syncPrices} disabled={isSyncing}>
                <RefreshCw
                  className={cn('h-4 w-4', isSyncing && 'animate-spin')}
                />
                {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ giá'}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-7 md:py-10">
        {coffeeQuery.isLoading ? (
          <div className="space-y-5">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : coffeeQuery.isError ? (
          <DataState
            title="Không thể tải giá cà phê"
            description="Dữ liệu có thể đang được cập nhật. Vui lòng thử lại."
            action={
              <Button onClick={() => coffeeQuery.refetch()}>Thử lại</Button>
            }
          />
        ) : !coffeePrices.length ? (
          <DataState
            icon={<BarChart3 className="h-5 w-5" />}
            title="Chưa có dữ liệu cà phê"
            description="Các khu vực và mức giá sẽ xuất hiện tại đây sau lần cập nhật tiếp theo."
          />
        ) : (
          <div className="space-y-7">
            <section className="border-border bg-card grid rounded-xl border sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Giá trung bình', avgPrice],
                ['Mức cao nhất', maxPrice],
                ['Mức thấp nhất', minPrice],
                [
                  'Biên độ',
                  maxPrice !== null && minPrice !== null
                    ? maxPrice - minPrice
                    : null,
                ],
              ].map(([label, value], index) => (
                <div
                  key={String(label)}
                  className={cn(
                    'px-5 py-4',
                    index > 0 &&
                      'border-border border-t sm:border-t-0 sm:border-l',
                    index === 2 && 'sm:border-l-0 lg:border-l'
                  )}
                >
                  <p className="text-muted-foreground text-xs font-medium">
                    {label}
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums">
                    {formatPrice(value as number | null)}{' '}
                    <span className="text-muted-foreground text-xs font-medium">
                      đ/kg
                    </span>
                  </p>
                </div>
              ))}
            </section>

            <section className="border-border bg-card overflow-hidden rounded-xl border">
              <div className="border-border space-y-4 border-b px-5 py-4 md:px-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-semibold">
                      {isCompareMode
                        ? 'So sánh giá theo vùng'
                        : activeCoffee?.name}
                    </h2>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {isCompareMode
                        ? `Đang hiển thị ${effectiveCompareIds.length} khu vực`
                        : `Diễn biến trong ${days} ngày gần đây`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant={isCompareMode ? 'default' : 'outline'}
                      onClick={() => setIsCompareMode((value) => !value)}
                    >
                      <GitCompare className="h-4 w-4" />
                      {isCompareMode ? 'Đang so sánh' : 'So sánh vùng'}
                    </Button>
                    <div className="bg-muted flex rounded-lg p-1">
                      {PERIODS.map((period) => (
                        <button
                          key={period}
                          onClick={() => setDays(period)}
                          className={cn(
                            'rounded-md px-3 py-1.5 text-xs font-semibold',
                            days === period
                              ? 'bg-background shadow-sm'
                              : 'text-muted-foreground'
                          )}
                        >
                          {period} ngày
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {isCompareMode && (
                  <div
                    className="border-border flex gap-2 overflow-x-auto border-t pt-4"
                    aria-label="Chọn khu vực so sánh"
                  >
                    {coffeePrices.map((item) => {
                      const index = effectiveCompareIds.indexOf(item.id)
                      const selected = index >= 0
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleCompareId(item.id)}
                          className={cn(
                            'border-border flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium',
                            selected
                              ? 'border-primary bg-primary/5 text-foreground'
                              : 'text-muted-foreground hover:bg-muted'
                          )}
                        >
                          {selected && (
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor:
                                  COMPARE_COLORS[index % COMPARE_COLORS.length],
                              }}
                            />
                          )}
                          {item.name}
                          {selected && <Check className="h-3 w-3" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="h-[330px] px-2 py-5 sm:px-4 md:px-5">
                {isCompareMode ? (
                  compareQueries.some((query) => query.isLoading) ? (
                    <Skeleton className="h-full w-full" />
                  ) : !compareChartData.length ? (
                    <DataState
                      className="h-full min-h-0 border-0"
                      title="Chưa có dữ liệu so sánh"
                    />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={compareChartData}
                        margin={{ top: 8, right: 8, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid
                          stroke="hsl(var(--border))"
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          minTickGap={24}
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 11,
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          width={42}
                          domain={['auto', 'auto']}
                          tickFormatter={(value) =>
                            `${Math.round(value / 1000)}k`
                          }
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 11,
                          }}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend
                          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                        />
                        {effectiveCompareIds.map((id, index) => {
                          const item = coffeePrices.find(
                            (coffee) => coffee.id === id
                          )
                          return item ? (
                            <Line
                              key={id}
                              type="monotone"
                              dataKey={item.name}
                              stroke={
                                COMPARE_COLORS[index % COMPARE_COLORS.length]
                              }
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4 }}
                            />
                          ) : null
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  )
                ) : historyQuery.isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : !chartData.length ? (
                  <DataState
                    className="h-full min-h-0 border-0"
                    title="Chưa có lịch sử giá"
                  />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="coffeePriceFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="hsl(var(--border))"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={24}
                        tick={{
                          fill: 'hsl(var(--muted-foreground))',
                          fontSize: 11,
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={42}
                        domain={['auto', 'auto']}
                        tickFormatter={(value) =>
                          `${Math.round(value / 1000)}k`
                        }
                        tick={{
                          fill: 'hsl(var(--muted-foreground))',
                          fontSize: 11,
                        }}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#coffeePriceFill)"
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section className="border-border bg-card overflow-hidden rounded-xl border">
              <div className="border-border flex items-center justify-between border-b px-5 py-4 md:px-6">
                <div>
                  <h2 className="font-semibold">Bảng giá theo khu vực</h2>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {coffeePrices.length} khu vực và sàn giao dịch
                  </p>
                </div>
                {highestItem && (
                  <p className="text-muted-foreground hidden text-xs md:block">
                    Cao nhất:{' '}
                    <strong className="text-foreground">
                      {highestItem.name}
                    </strong>
                  </p>
                )}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 text-left font-medium">
                        Khu vực / Sàn
                      </th>
                      <th className="px-5 py-3 text-right font-medium">
                        Giá hiện tại
                      </th>
                      <th className="px-5 py-3 text-right font-medium">
                        Thay đổi
                      </th>
                      <th className="px-5 py-3 text-right font-medium">
                        Cập nhật
                      </th>
                      <th className="px-5 py-3 text-right font-medium">
                        <span className="sr-only">Chi tiết</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-border divide-y">
                    {coffeePrices.map((item) => {
                      const price =
                        item.current_price ?? item.prices?.[0]?.price
                      const change = item.price_change ?? 0
                      const percent = item.price_change_percent ?? 0
                      const updatedAt =
                        item.prices?.[0]?.date || item.updated_at
                      return (
                        <tr
                          key={item.id}
                          onClick={() => {
                            setSelectedId(item.id)
                            setIsCompareMode(false)
                          }}
                          className={cn(
                            'hover:bg-muted/30 cursor-pointer',
                            !isCompareMode &&
                              activeCoffee?.id === item.id &&
                              'bg-primary/5'
                          )}
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {item.code}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                            {formatPrice(price)} đ/kg
                          </td>
                          <td
                            className={cn(
                              'px-5 py-3.5 text-right font-medium tabular-nums',
                              change > 0
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : change < 0
                                  ? 'text-red-700 dark:text-red-400'
                                  : 'text-muted-foreground'
                            )}
                          >
                            {change > 0 ? '+' : ''}
                            {Number(percent).toFixed(2)}%
                          </td>
                          <td className="text-muted-foreground px-5 py-3.5 text-right">
                            {updatedAt
                              ? new Date(updatedAt).toLocaleDateString('vi-VN')
                              : '—'}
                          </td>
                          <td
                            className="px-5 py-3.5 text-right"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Link
                              href={`/commodities/${item.id}`}
                              className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                            >
                              Chi tiết
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="divide-border divide-y md:hidden">
                {coffeePrices.map((item) => {
                  const price = item.current_price ?? item.prices?.[0]?.price
                  const change = item.price_change ?? 0
                  const percent = item.price_change_percent ?? 0
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id)
                        setIsCompareMode(false)
                      }}
                      className={cn(
                        'flex w-full items-center justify-between gap-4 px-4 py-4 text-left',
                        activeCoffee?.id === item.id &&
                          !isCompareMode &&
                          'bg-primary/5'
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.name}</p>
                        <p
                          className={cn(
                            'mt-1 flex items-center gap-1 text-xs font-medium',
                            change > 0
                              ? 'text-emerald-700'
                              : change < 0
                                ? 'text-red-700'
                                : 'text-muted-foreground'
                          )}
                        >
                          {change > 0 ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : change < 0 ? (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          ) : null}
                          {change > 0 ? '+' : ''}
                          {Number(percent).toFixed(2)}%
                        </p>
                      </div>
                      <p className="shrink-0 text-right font-semibold tabular-nums">
                        {formatPrice(price)} đ
                        <span className="text-muted-foreground block text-xs font-normal">
                          mỗi kg
                        </span>
                      </p>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>
        )}
      </Container>
    </main>
  )
}
