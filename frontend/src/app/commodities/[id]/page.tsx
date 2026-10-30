'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Calculator,
  CalendarDays,
  Download,
  MapPin,
  Minus,
  Star,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { commoditiesService } from '@/api/services/commodities.service'
import { notificationService } from '@/api/services/notification.service'
import { profileService } from '@/api/services/profile.service'
import { DataState } from '@/components/data-display/data-state'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast-context'
import { useAuthStore } from '@/store/authStore'

interface PricePoint {
  id?: number
  date: string
  price: number
  location?: string | null
}
interface Commodity {
  id: number
  name: string
  code?: string
  unit?: string
  description?: string
  current_price?: number
  previous_price?: number
  prices?: Array<{ price: number }>
  category?: { name?: string }
}

const PERIODS = [
  { label: '7 ngày', value: 7 },
  { label: '30 ngày', value: 30 },
  { label: '90 ngày', value: 90 },
  { label: '1 năm', value: 365 },
]
const formatPrice = (value?: number | null) =>
  typeof value === 'number' ? value.toLocaleString('vi-VN') : '—'
const formatUnit = (unit?: string) =>
  (unit || 'kg').replace(/^VNĐ\//i, '').replace(/^VND\//i, '')

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="border-border bg-popover rounded-lg border px-3 py-2 shadow-md">
      <p className="text-muted-foreground text-xs">
        {payload[0].payload.fullDate}
      </p>
      <p className="mt-0.5 font-semibold tabular-nums">
        {formatPrice(payload[0].value)} đ
      </p>
    </div>
  )
}

export default function CommodityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const toast = useToast()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const commodityId = Number(id)
  const [days, setDays] = React.useState(30)
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [targetPrice, setTargetPrice] = React.useState('')
  const [condition, setCondition] = React.useState('above')
  const [isSubmittingAlert, setIsSubmittingAlert] = React.useState(false)
  const [simVolume, setSimVolume] = React.useState('1000')
  const [simCostPerUnit, setSimCostPerUnit] = React.useState('')

  const detailQuery = useQuery({
    queryKey: ['commodity-detail', commodityId],
    queryFn: async () =>
      (await commoditiesService.getCommodity(commodityId)).data,
    enabled: Number.isFinite(commodityId),
  })
  const historyQuery = useQuery({
    queryKey: ['price-history', commodityId, days],
    queryFn: async () =>
      (await commoditiesService.getPriceHistory(commodityId, days)).data,
    enabled: Number.isFinite(commodityId),
  })
  const watchlistQuery = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => (await profileService.getWatchlist()).data,
    enabled: isAuthenticated,
  })

  const commodity: Commodity | undefined =
    detailQuery.data?.data || detailQuery.data
  const history: PricePoint[] =
    historyQuery.data?.data || historyQuery.data || []
  const watchlist: Commodity[] =
    watchlistQuery.data?.data || watchlistQuery.data || []
  const isWatched = watchlist.some((item) => item.id === commodityId)
  const unit = formatUnit(commodity?.unit)
  const currentPrice =
    history.at(-1)?.price ??
    commodity?.current_price ??
    commodity?.prices?.[0]?.price
  const previousPrice = history.at(-2)?.price ?? commodity?.previous_price
  const changeValue =
    currentPrice && previousPrice ? currentPrice - previousPrice : null
  const changePercent =
    changeValue !== null && previousPrice
      ? (changeValue / previousPrice) * 100
      : null
  const priceValues = history
    .map((point) => Number(point.price))
    .filter(Number.isFinite)
  const minPrice = priceValues.length ? Math.min(...priceValues) : null
  const maxPrice = priceValues.length ? Math.max(...priceValues) : null
  const avgPrice = priceValues.length
    ? priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length
    : null
  const chartData = history.map((point) => ({
    ...point,
    dateLabel: new Date(point.date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    }),
    fullDate: new Date(point.date).toLocaleDateString('vi-VN'),
  }))

  React.useEffect(() => {
    if (currentPrice && !simCostPerUnit)
      setSimCostPerUnit(String(Math.round((currentPrice * 0.72) / 100) * 100))
  }, [currentPrice, simCostPerUnit])

  const toggleWatchlist = async () => {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/commodities/${commodityId}`)}`
      )
      return
    }
    try {
      if (isWatched) {
        await profileService.removeFromWatchlist(commodityId)
        toast.success('Đã bỏ theo dõi mặt hàng')
      } else {
        await profileService.addToWatchlist(commodityId)
        toast.success('Đã thêm vào danh sách theo dõi')
      }
      await watchlistQuery.refetch()
    } catch {
      toast.error('Không thể cập nhật danh sách theo dõi. Vui lòng thử lại.')
    }
  }

  const openAlert = () => {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/commodities/${commodityId}`)}`
      )
      return
    }
    if (currentPrice && !targetPrice)
      setTargetPrice(String(Math.round((currentPrice * 1.02) / 100) * 100))
    setIsAlertOpen(true)
  }

  const createAlert = async (event: React.FormEvent) => {
    event.preventDefault()
    const price = Number(targetPrice)
    if (!Number.isFinite(price) || price <= 0)
      return toast.error('Vui lòng nhập mức giá hợp lệ')
    setIsSubmittingAlert(true)
    try {
      await notificationService.createPriceAlert({
        commodity_id: commodityId,
        target_price: price,
        condition,
      })
      toast.success('Đã cài đặt cảnh báo giá')
      setIsAlertOpen(false)
      setTargetPrice('')
    } catch {
      toast.error('Không thể cài cảnh báo. Vui lòng đăng nhập và thử lại.')
    } finally {
      setIsSubmittingAlert(false)
    }
  }

  const exportCsv = () => {
    if (!history.length) return toast.error('Chưa có dữ liệu lịch sử để xuất')
    const rows = [...history]
      .reverse()
      .map((point) => [
        new Date(point.date).toISOString().slice(0, 10),
        `"${(commodity?.name || '').replace(/"/g, '""')}"`,
        commodity?.code || '',
        point.price,
        unit,
        `"${(point.location || 'Toàn quốc').replace(/"/g, '""')}"`,
      ])
    const csv =
      '\uFEFF' +
      [
        'Ngay,NongSan,Ma,Gia_VND,DonVi,KhuVuc',
        ...rows.map((row) => row.join(',')),
      ].join('\n')
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `lich-su-gia-${commodity?.code || commodityId}-${days}-ngay.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const volume = Math.max(0, Number(simVolume) || 0)
  const unitCost = Math.max(0, Number(simCostPerUnit) || 0)
  const revenue = volume * (currentPrice || 0)
  const totalCost = volume * unitCost
  const profit = revenue - totalCost
  const returnRate = totalCost ? (profit / totalCost) * 100 : 0

  if (!Number.isFinite(commodityId)) {
    return (
      <Container className="py-12">
        <DataState
          title="Mặt hàng không hợp lệ"
          action={
            <Button onClick={() => router.push('/commodities')}>
              Về bảng giá
            </Button>
          }
        />
      </Container>
    )
  }
  if (detailQuery.isError) {
    return (
      <Container className="py-12">
        <DataState
          title="Không thể tải thông tin mặt hàng"
          description="Dữ liệu có thể đang được cập nhật. Vui lòng thử lại sau ít phút."
          action={
            <Button onClick={() => detailQuery.refetch()}>Thử lại</Button>
          }
        />
      </Container>
    )
  }

  return (
    <main className="pb-16 md:pb-20">
      <div className="border-border bg-card border-b">
        <Container className="py-5 md:py-7">
          <button
            onClick={() => router.push('/commodities')}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Bảng giá nông sản
          </button>
          {detailQuery.isLoading ? (
            <div className="mt-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-14 w-80" />
            </div>
          ) : (
            <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {commodity?.category?.name && (
                    <Badge variant="secondary">{commodity.category.name}</Badge>
                  )}
                  {commodity?.code && (
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider">
                      {commodity.code}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-[-0.03em] md:text-4xl">
                  {commodity?.name}
                </h1>
                <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
                  <p className="text-4xl font-bold tracking-[-0.03em] tabular-nums md:text-5xl">
                    {formatPrice(currentPrice)}
                    <span className="text-muted-foreground ml-2 text-base font-medium tracking-normal">
                      đ/{unit}
                    </span>
                  </p>
                  {changePercent !== null && (
                    <div
                      className={`mb-1 flex items-center gap-1.5 text-sm font-semibold ${changePercent > 0 ? 'text-emerald-700 dark:text-emerald-400' : changePercent < 0 ? 'text-red-700 dark:text-red-400' : 'text-muted-foreground'}`}
                    >
                      {changePercent > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : changePercent < 0 ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                      {changePercent > 0 ? '+' : ''}
                      {changePercent.toFixed(2)}%{' '}
                      <span className="text-muted-foreground font-normal">
                        so với kỳ trước
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={exportCsv}>
                  <Download className="h-4 w-4" />
                  Xuất CSV
                </Button>
                <Button variant="outline" onClick={openAlert}>
                  <Bell className="h-4 w-4" />
                  Báo giá
                </Button>
                <Button
                  variant={isWatched ? 'default' : 'outline'}
                  onClick={toggleWatchlist}
                >
                  <Star
                    className={`h-4 w-4 ${isWatched ? 'fill-current' : ''}`}
                  />
                  {isWatched ? 'Đang theo dõi' : 'Theo dõi'}
                </Button>
              </div>
            </div>
          )}
        </Container>
      </div>

      <Container className="py-7 md:py-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-7">
            <section className="border-border bg-card rounded-xl border">
              <div className="border-border flex flex-col justify-between gap-4 border-b px-5 py-4 sm:flex-row sm:items-center md:px-6">
                <div>
                  <h2 className="font-semibold">Diễn biến giá</h2>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    Mức giá ghi nhận theo từng ngày
                  </p>
                </div>
                <div className="bg-muted flex max-w-full gap-1 overflow-x-auto rounded-lg p-1">
                  {PERIODS.map((period) => (
                    <button
                      key={period.value}
                      onClick={() => setDays(period.value)}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap ${days === period.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-2 py-5 sm:px-4 md:px-5">
                {historyQuery.isLoading ? (
                  <Skeleton className="h-72 w-full" />
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
                  <DataState
                    className="border-0"
                    icon={<BarChart3 className="h-5 w-5" />}
                    title="Chưa có lịch sử giá"
                    description={`Chưa ghi nhận dữ liệu trong ${days} ngày gần đây.`}
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="commodityPriceFill"
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
                        dataKey="dateLabel"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'hsl(var(--muted-foreground))',
                          fontSize: 11,
                        }}
                        minTickGap={28}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'hsl(var(--muted-foreground))',
                          fontSize: 11,
                        }}
                        tickFormatter={(value) =>
                          `${Math.round(value / 1000)}k`
                        }
                        width={42}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      {avgPrice !== null && (
                        <ReferenceLine
                          y={avgPrice}
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="4 4"
                        />
                      )}
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#commodityPriceFill)"
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            {history.length > 0 && (
              <section className="border-border bg-card overflow-hidden rounded-xl border">
                <div className="border-border border-b px-5 py-4 md:px-6">
                  <h2 className="font-semibold">Giá ghi nhận gần đây</h2>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    10 lần cập nhật mới nhất
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-sm">
                    <thead className="bg-muted/60 text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3 text-left font-medium">
                          Ngày
                        </th>
                        <th className="px-5 py-3 text-right font-medium">
                          Giá
                        </th>
                        <th className="px-5 py-3 text-right font-medium">
                          Thay đổi
                        </th>
                        <th className="px-5 py-3 text-right font-medium">
                          Khu vực
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {[...history]
                        .reverse()
                        .slice(0, 10)
                        .map((point, index, rows) => {
                          const previous = rows[index + 1]
                          const delta = previous
                            ? point.price - previous.price
                            : null
                          const deltaPercent = previous?.price
                            ? (delta! / previous.price) * 100
                            : null
                          return (
                            <tr
                              key={point.id || `${point.date}-${index}`}
                              className="hover:bg-muted/30"
                            >
                              <td className="px-5 py-3.5">
                                <span className="inline-flex items-center gap-2">
                                  <CalendarDays className="text-muted-foreground h-4 w-4" />
                                  {new Date(point.date).toLocaleDateString(
                                    'vi-VN'
                                  )}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-right font-semibold tabular-nums">
                                {formatPrice(point.price)} đ
                              </td>
                              <td
                                className={`px-5 py-3.5 text-right font-medium tabular-nums ${delta && delta > 0 ? 'text-emerald-700 dark:text-emerald-400' : delta && delta < 0 ? 'text-red-700 dark:text-red-400' : 'text-muted-foreground'}`}
                              >
                                {deltaPercent === null
                                  ? '—'
                                  : `${deltaPercent > 0 ? '+' : ''}${deltaPercent.toFixed(1)}%`}
                              </td>
                              <td className="text-muted-foreground px-5 py-3.5 text-right">
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {point.location || 'Toàn quốc'}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <section className="border-border bg-card rounded-xl border p-5">
              <h2 className="text-sm font-semibold">Thống kê {days} ngày</h2>
              <dl className="mt-4 divide-y">
                {[
                  ['Cao nhất', maxPrice],
                  ['Thấp nhất', minPrice],
                  ['Trung bình', avgPrice],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <dt className="text-muted-foreground text-sm">{label}</dt>
                    <dd className="text-sm font-semibold tabular-nums">
                      {formatPrice(value as number | null)} đ
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="border-border bg-card rounded-xl border p-5">
              <h2 className="text-sm font-semibold">Thông tin mặt hàng</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Mã hàng</dt>
                  <dd className="font-medium">{commodity?.code || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Đơn vị</dt>
                  <dd className="font-medium">{unit}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Danh mục</dt>
                  <dd className="text-right font-medium">
                    {commodity?.category?.name || '—'}
                  </dd>
                </div>
              </dl>
              {commodity?.description && (
                <p className="border-border text-muted-foreground mt-4 border-t pt-4 text-sm leading-6">
                  {commodity.description}
                </p>
              )}
            </section>
            <section className="border-border bg-card rounded-xl border p-5">
              <div className="flex items-start gap-3">
                <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Ước tính mùa vụ</h2>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Tham khảo theo giá hiện tại
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="volume" className="text-xs">
                    Sản lượng dự kiến ({unit})
                  </Label>
                  <Input
                    id="volume"
                    type="number"
                    min="0"
                    value={simVolume}
                    onChange={(event) => setSimVolume(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cost" className="text-xs">
                    Chi phí trên mỗi {unit} (đ)
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    value={simCostPerUnit}
                    onChange={(event) => setSimCostPerUnit(event.target.value)}
                  />
                </div>
              </div>
              <dl className="bg-muted/60 mt-5 space-y-2.5 rounded-lg p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Doanh thu</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatPrice(revenue)} đ
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Tổng chi phí</dt>
                  <dd className="font-medium tabular-nums">
                    {formatPrice(totalCost)} đ
                  </dd>
                </div>
                <div className="border-border flex justify-between gap-3 border-t pt-2.5">
                  <dt className="font-medium">Lợi nhuận dự kiến</dt>
                  <dd
                    className={`text-right font-bold tabular-nums ${profit >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}
                  >
                    {profit > 0 ? '+' : ''}
                    {formatPrice(profit)} đ
                    <span className="block text-xs font-medium">
                      {returnRate > 0 ? '+' : ''}
                      {returnRate.toFixed(1)}%
                    </span>
                  </dd>
                </div>
              </dl>
              <p className="text-muted-foreground mt-3 text-xs leading-5">
                Kết quả chỉ mang tính tham khảo, chưa bao gồm hao hụt và chi phí
                phát sinh.
              </p>
            </section>
          </aside>
        </div>
      </Container>

      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cài cảnh báo giá</DialogTitle>
            <DialogDescription>
              Nhận thông báo khi giá {commodity?.name || 'mặt hàng'} đạt mức bạn
              chọn.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createAlert} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="condition">Điều kiện</Label>
              <select
                id="condition"
                value={condition}
                onChange={(event) => setCondition(event.target.value)}
                className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                <option value="above">Giá bằng hoặc cao hơn</option>
                <option value="below">Giá bằng hoặc thấp hơn</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="target-price">Mức giá mục tiêu (đ/{unit})</Label>
              <Input
                id="target-price"
                type="number"
                min="1"
                value={targetPrice}
                onChange={(event) => setTargetPrice(event.target.value)}
                placeholder="Nhập mức giá"
                required
              />
            </div>
            {currentPrice && (
              <div className="flex flex-wrap gap-2">
                {[-5, -2, 2, 5].map((percent) => (
                  <button
                    key={percent}
                    type="button"
                    onClick={() => {
                      setTargetPrice(
                        String(
                          Math.round(
                            (currentPrice * (1 + percent / 100)) / 100
                          ) * 100
                        )
                      )
                      setCondition(percent > 0 ? 'above' : 'below')
                    }}
                    className="bg-muted hover:bg-muted/70 rounded-md px-2 py-1 text-xs font-medium"
                  >
                    {percent > 0 ? '+' : ''}
                    {percent}%
                  </button>
                ))}
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAlertOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmittingAlert}>
                {isSubmittingAlert ? 'Đang lưu...' : 'Lưu cảnh báo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
