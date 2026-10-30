'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Download,
  LayoutGrid,
  List,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

import { commodityService } from '@/api/services/commodity.service'
import { commoditiesService } from '@/api/services/commodities.service'
import { DataState } from '@/components/data-display/data-state'
import { DataToolbar } from '@/components/data-display/data-toolbar'
import { Container } from '@/components/layout/container'
import { PageTransition } from '@/components/layout/page-transition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/toast-context'
import { cn } from '@/lib/utils'

type Commodity = {
  id: number
  code?: string
  name: string
  unit?: string
  current_price?: number | null
  price_change?: number | null
  change_24h?: number | null
  price_change_percent?: number | null
  location?: string | null
  category?: { id?: number; name?: string } | null
}

const numberFormatter = new Intl.NumberFormat('vi-VN')
const EMPTY_COMMODITIES: Commodity[] = []
const EMPTY_CATEGORIES: Array<{ id: number; name: string }> = []
const getChange = (item: Commodity) =>
  Number(item.price_change ?? item.change_24h ?? 0)
const getChangePercent = (item: Commodity) =>
  Number(item.price_change_percent ?? 0)
const formatPrice = (value?: number | null) =>
  value == null
    ? 'Chưa có giá'
    : `${numberFormatter.format(Math.round(Number(value)))} đ`
const formatUnit = (unit?: string) =>
  unit?.replace(/^V(?:ND|NĐ)\s*\/?\s*/i, '').trim() || 'kg'

function ChangeValue({ item }: { item: Commodity }) {
  const change = getChange(item)
  const percent = getChangePercent(item)
  const isUp = change > 0 || percent > 0
  const isDown = change < 0 || percent < 0

  return (
    <span
      className={cn(
        'inline-flex min-w-[5.25rem] items-center justify-end gap-1 text-sm font-semibold tabular-nums',
        isUp && 'text-emerald-700 dark:text-emerald-300',
        isDown && 'text-red-700 dark:text-red-300',
        !isUp && !isDown && 'text-muted-foreground'
      )}
    >
      {isUp && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
      {isDown && <ArrowDownRight className="h-4 w-4" aria-hidden="true" />}
      {percent > 0 ? '+' : ''}
      {percent.toFixed(2)}%
    </span>
  )
}

function MarketSummary({ items }: { items: Commodity[] }) {
  const upCount = items.filter((item) => getChangePercent(item) > 0).length
  const downCount = items.filter((item) => getChangePercent(item) < 0).length
  const flatCount = Math.max(0, items.length - upCount - downCount)
  const topGainer = [...items].sort(
    (a, b) => getChangePercent(b) - getChangePercent(a)
  )[0]
  const topLoser = [...items].sort(
    (a, b) => getChangePercent(a) - getChangePercent(b)
  )[0]

  return (
    <div className="border-border bg-card md:divide-border grid overflow-hidden rounded-xl border md:grid-cols-[1fr_1fr_1.35fr] md:divide-x">
      {[
        { label: 'Tăng mạnh nhất', item: topGainer },
        { label: 'Giảm mạnh nhất', item: topLoser },
      ].map(({ label, item }) => (
        <Link
          key={label}
          href={item ? `/commodities/${item.id}` : '#'}
          className="border-border hover:bg-muted/50 flex items-center justify-between gap-4 border-b p-4 transition-colors md:border-b-0"
        >
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs font-medium">{label}</p>
            <p className="mt-1 truncate font-semibold">{item?.name || '—'}</p>
          </div>
          {item && <ChangeValue item={item} />}
        </Link>
      ))}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-muted-foreground font-medium">
            Độ rộng thị trường
          </span>
          <span className="text-muted-foreground">{items.length} mặt hàng</span>
        </div>
        <div className="bg-muted mt-2.5 flex h-1.5 overflow-hidden rounded-full">
          <span
            className="bg-emerald-600"
            style={{ width: `${(upCount / Math.max(1, items.length)) * 100}%` }}
          />
          <span
            className="bg-muted-foreground/35"
            style={{
              width: `${(flatCount / Math.max(1, items.length)) * 100}%`,
            }}
          />
          <span
            className="bg-red-600"
            style={{
              width: `${(downCount / Math.max(1, items.length)) * 100}%`,
            }}
          />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
          <span className="text-emerald-700 dark:text-emerald-300">
            {upCount} tăng
          </span>
          <span className="text-muted-foreground">{flatCount} đứng giá</span>
          <span className="text-red-700 dark:text-red-300">
            {downCount} giảm
          </span>
        </div>
      </div>
    </div>
  )
}

function PriceSkeleton() {
  return (
    <div className="space-y-3" aria-label="Đang tải bảng giá">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="h-16 w-full" />
      ))}
    </div>
  )
}

export default function CommoditiesPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [isSyncing, setIsSyncing] = useState(false)

  const { data, isLoading, isError, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['commodities-all'],
    queryFn: () => commodityService.getCommodities({ size: 100 }),
  })
  const { data: categoryData } = useQuery({
    queryKey: ['commodity-categories'],
    queryFn: () => commodityService.getCategories(),
  })

  const allCommodities: Commodity[] = data?.data?.items || EMPTY_COMMODITIES
  const categories: Array<{ id: number; name: string }> =
    categoryData?.data?.items || categoryData?.data || EMPTY_CATEGORIES

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('vi')
    return [...allCommodities]
      .filter((item) => {
        const categoryMatches =
          selectedCategory === 'all' ||
          String(item.category?.id) === selectedCategory
        const searchMatches =
          !normalizedSearch ||
          item.name?.toLocaleLowerCase('vi').includes(normalizedSearch) ||
          item.code?.toLocaleLowerCase('vi').includes(normalizedSearch) ||
          item.category?.name
            ?.toLocaleLowerCase('vi')
            .includes(normalizedSearch)
        return categoryMatches && searchMatches
      })
      .sort((a, b) => {
        if (sortBy === 'price_desc')
          return Number(b.current_price || 0) - Number(a.current_price || 0)
        if (sortBy === 'price_asc')
          return Number(a.current_price || 0) - Number(b.current_price || 0)
        if (sortBy === 'change_desc')
          return getChangePercent(b) - getChangePercent(a)
        if (sortBy === 'change_asc')
          return getChangePercent(a) - getChangePercent(b)
        return a.name.localeCompare(b.name, 'vi')
      })
  }, [allCommodities, search, selectedCategory, sortBy])

  const hasFilters = Boolean(
    search || selectedCategory !== 'all' || sortBy !== 'default'
  )
  const updatedLabel = dataUpdatedAt
    ? new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }).format(dataUpdatedAt)
    : 'Chưa cập nhật'
  const resetFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    setSortBy('default')
  }

  const handleLiveSync = async () => {
    try {
      setIsSyncing(true)
      await commoditiesService.crawlLive()
      await queryClient.invalidateQueries({ queryKey: ['commodities-all'] })
      toast.success('Đã đồng bộ bảng giá mới nhất.')
    } catch {
      toast.error('Không thể đồng bộ bảng giá lúc này.')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleExportCsv = () => {
    if (!filtered.length) return toast.error('Không có dữ liệu để xuất CSV.')
    const headers = [
      'Ma',
      'TenNongSan',
      'DanhMuc',
      'GiaHienTai_VND',
      'DonVi',
      'ThayDoi_VND',
      'ThayDoi_PhanTram',
    ]
    const rows = filtered.map((item) => [
      item.code || '',
      `"${item.name.replace(/"/g, '""')}"`,
      `"${(item.category?.name || 'Nông sản').replace(/"/g, '""')}"`,
      Math.round(Number(item.current_price || 0)),
      item.unit || 'kg',
      Math.round(getChange(item)),
      getChangePercent(item).toFixed(2),
    ])
    const url = URL.createObjectURL(
      new Blob(
        [
          '\uFEFF' +
            [headers.join(','), ...rows.map((row) => row.join(','))].join('\n'),
        ],
        { type: 'text/csv;charset=utf-8;' }
      )
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `bang-gia-nong-san-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Đã tải bảng giá CSV.')
  }

  return (
    <PageTransition>
      <main className="pb-16 md:pb-20">
        <div className="border-border bg-card border-b">
          <Container className="py-7 md:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-primary text-sm font-semibold">
                  Dữ liệu thị trường
                </p>
                <h1 className="mt-2 text-3xl leading-tight font-bold tracking-[-0.035em] md:text-5xl">
                  Giá nông sản tổng hợp
                </h1>
                <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-7 md:text-lg">
                  Theo dõi và so sánh giá cà phê, hồ tiêu, lúa gạo, cao su và
                  các mặt hàng chủ lực.
                </p>
                <p className="text-muted-foreground mt-3 text-xs">
                  Cập nhật gần nhất: {updatedLabel}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleExportCsv}>
                  <Download aria-hidden="true" /> Xuất CSV
                </Button>
                <Button onClick={handleLiveSync} disabled={isSyncing}>
                  <RefreshCw
                    className={cn(isSyncing && 'animate-spin')}
                    aria-hidden="true"
                  />
                  {isSyncing ? 'Đang đồng bộ' : 'Đồng bộ giá'}
                </Button>
              </div>
            </div>
          </Container>
        </div>

        <Container className="space-y-5 pt-5 md:space-y-6 md:pt-6">
          {!isLoading && !isError && allCommodities.length > 0 && (
            <MarketSummary items={allCommodities} />
          )}

          <DataToolbar
            search={
              <div className="relative">
                <Search
                  className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm mặt hàng, mã hoặc danh mục..."
                  className="pl-9"
                  aria-label="Tìm nông sản"
                />
              </div>
            }
            filters={
              <div
                className="flex gap-2 overflow-x-auto pb-1 lg:pb-0"
                role="group"
                aria-label="Lọc theo danh mục"
              >
                {[
                  { id: 'all', name: 'Tất cả' },
                  ...categories.map((category) => ({
                    id: String(category.id),
                    name: category.name,
                  })),
                ].map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={selectedCategory === String(category.id)}
                    onClick={() => setSelectedCategory(String(category.id))}
                    className={cn(
                      'h-9 shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors',
                      selectedCategory === String(category.id)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            }
            actions={
              <>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="border-input bg-card focus:ring-ring/25 h-10 max-w-[12rem] rounded-lg border px-3 text-sm focus:ring-2 focus:outline-none"
                  aria-label="Sắp xếp bảng giá"
                >
                  <option value="default">Tên mặt hàng</option>
                  <option value="price_desc">Giá cao nhất</option>
                  <option value="price_asc">Giá thấp nhất</option>
                  <option value="change_desc">Tăng mạnh nhất</option>
                  <option value="change_asc">Giảm mạnh nhất</option>
                </select>
                <div
                  className="border-border hidden rounded-lg border p-0.5 sm:flex"
                  aria-label="Kiểu hiển thị"
                >
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    aria-label="Hiển thị dạng bảng"
                    aria-pressed={viewMode === 'table'}
                    className={cn(
                      'text-muted-foreground rounded-md p-2',
                      viewMode === 'table' && 'bg-muted text-foreground'
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Hiển thị dạng thẻ"
                    aria-pressed={viewMode === 'grid'}
                    className={cn(
                      'text-muted-foreground rounded-md p-2',
                      viewMode === 'grid' && 'bg-muted text-foreground'
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </>
            }
            footer={
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <p className="text-muted-foreground">
                  Hiển thị{' '}
                  <strong className="text-foreground font-semibold">
                    {filtered.length}
                  </strong>
                  /{allCommodities.length} mặt hàng
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-primary inline-flex items-center gap-1.5 font-medium hover:underline"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Xóa
                    bộ lọc
                  </button>
                )}
              </div>
            }
          />

          {isLoading ? (
            <PriceSkeleton />
          ) : isError ? (
            <DataState
              icon={<RefreshCw className="h-5 w-5" />}
              title="Chưa tải được bảng giá"
              description="Kiểm tra kết nối và thử tải lại. Các bộ lọc hiện tại vẫn được giữ nguyên."
              action={
                <Button variant="outline" onClick={() => refetch()}>
                  Thử lại
                </Button>
              }
              role="alert"
            />
          ) : filtered.length === 0 ? (
            <DataState
              icon={<SlidersHorizontal className="h-5 w-5" />}
              title="Không có mặt hàng phù hợp"
              description="Thử từ khóa khác hoặc xóa các bộ lọc đang áp dụng."
              action={
                <Button variant="outline" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              }
            />
          ) : viewMode === 'grid' ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  href={`/commodities/${item.id}`}
                  className="group border-border bg-card hover:border-primary/45 hover:bg-muted/30 rounded-xl border p-4 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs">
                        {item.category?.name || 'Nông sản'}
                      </p>
                      <h2 className="group-hover:text-primary mt-1 truncate font-semibold">
                        {item.name}
                      </h2>
                    </div>
                    <ChangeValue item={item} />
                  </div>
                  <p className="mt-6 text-2xl font-bold tracking-[-0.025em] tabular-nums">
                    {formatPrice(item.current_price)}
                  </p>
                  <div className="text-muted-foreground mt-1 flex items-center justify-between text-xs">
                    <span>Đơn vị: {formatUnit(item.unit)}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <PriceTable items={filtered} />
          )}
        </Container>
      </main>
    </PageTransition>
  )
}

function PriceTable({ items }: { items: Commodity[] }) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Mặt hàng</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Khu vực</TableHead>
              <TableHead className="text-right">Giá hiện tại</TableHead>
              <TableHead className="text-right">Thay đổi</TableHead>
              <TableHead>
                <span className="sr-only">Xem chi tiết</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link
                    href={`/commodities/${item.id}`}
                    className="hover:text-primary font-semibold"
                  >
                    {item.name}
                  </Link>
                  {item.code && (
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {item.code}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.category?.name || 'Nông sản'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.location || 'Toàn quốc'}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatPrice(item.current_price)}{' '}
                  <span className="text-muted-foreground text-xs font-normal">
                    /{formatUnit(item.unit)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <ChangeValue item={item} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/commodities/${item.id}`}>
                      Chi tiết <ArrowRight />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="border-border bg-card overflow-hidden rounded-xl border md:hidden">
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={`/commodities/${item.id}`}
            className={cn(
              'flex items-center justify-between gap-3 p-4',
              index > 0 && 'border-border border-t'
            )}
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{item.name}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {item.category?.name || 'Nông sản'} · {formatUnit(item.unit)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-semibold tabular-nums">
                {formatPrice(item.current_price)}
              </p>
              <ChangeValue item={item} />
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
