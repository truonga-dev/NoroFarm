'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  FilePenLine,
  MapPin,
  PackageSearch,
  Plus,
  RotateCcw,
  Search,
} from 'lucide-react'

import { commodityService } from '@/api/services/commodity.service'
import {
  marketService,
  type MarketPost,
  type MarketPostList,
} from '@/api/services/market.service'
import { getCommodityImage } from '@/lib/commodity-images'
import { DataState } from '@/components/data-display/data-state'
import { Container } from '@/components/layout/container'
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
import { cn } from '@/lib/utils'

type PostType = 'BUY' | 'SELL'
interface Commodity {
  id: number
  name: string
  unit?: string
  current_price?: number | null
}

const numberFormat = new Intl.NumberFormat('vi-VN')
const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})
const normalizeUnit = (unit?: string) => (unit || 'kg').replace(/^VNĐ\//i, '')

export default function MarketplacePage() {
  const router = useRouter()
  const toast = useToast()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [searchInput, setSearchInput] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [postType, setPostType] = React.useState<PostType | ''>('')
  const [commodityId, setCommodityId] = React.useState<number | ''>('')
  const [page, setPage] = React.useState(1)
  const [isPostOpen, setIsPostOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [form, setForm] = React.useState({
    post_type: 'SELL' as PostType,
    commodity_id: 0,
    title: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    location: 'Đắk Lắk',
    contact_phone: '',
  })

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const commoditiesQuery = useQuery({
    queryKey: ['commodities-list'],
    queryFn: () => commodityService.getCommodities({ size: 100 }),
  })
  const commodities: Commodity[] = React.useMemo(() => {
    const value =
      commoditiesQuery.data?.data?.items || commoditiesQuery.data?.data || []
    return Array.isArray(value) ? value : []
  }, [commoditiesQuery.data])
  React.useEffect(() => {
    if (commodities.length && !form.commodity_id) {
      setForm((current) => ({
        ...current,
        commodity_id: commodities[0].id,
        unit: normalizeUnit(commodities[0].unit),
      }))
    }
  }, [commodities, form.commodity_id])

  const postsQuery = useQuery<MarketPostList>({
    queryKey: ['market-posts', page, postType, commodityId, search],
    queryFn: async () =>
      (
        await marketService.getPosts({
          page,
          size: 12,
          post_type: postType || undefined,
          commodity_id: commodityId || undefined,
          search: search || undefined,
        })
      ).data,
    placeholderData: keepPreviousData,
  })
  const posts = postsQuery.data?.items || []
  const hasFilters = Boolean(searchInput || postType || commodityId)

  const resetFilters = () => {
    setSearchInput('')
    setSearch('')
    setPostType('')
    setCommodityId('')
    setPage(1)
  }
  const openPostDialog = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=%2Fmarketplace')
      return
    }
    setIsPostOpen(true)
  }
  const submitPost = async (event: React.FormEvent) => {
    event.preventDefault()
    if (
      !form.title.trim() ||
      !form.price ||
      !form.quantity ||
      !form.contact_phone.trim()
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }
    setIsSubmitting(true)
    try {
      await marketService.createPost({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        commodity_id: Number(form.commodity_id),
        price: Number(form.price),
        quantity: Number(form.quantity),
        location: form.location.trim(),
        contact_phone: form.contact_phone.trim(),
      })
      toast.success('Đã gửi tin giao dịch')
      setIsPostOpen(false)
      setForm((current) => ({
        ...current,
        title: '',
        description: '',
        price: '',
        quantity: '',
      }))
      await postsQuery.refetch()
    } catch (error: any) {
      toast.error(error?.message || 'Không thể đăng tin. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCommodity = commodities.find(
    (item) => item.id === Number(form.commodity_id)
  )
  const referencePrice = selectedCommodity?.current_price
    ? Math.round(Number(selectedCommodity.current_price))
    : null

  return (
    <main className="pb-16 md:pb-20">
      <div className="border-border bg-card border-b">
        <Container className="py-7 md:py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-primary text-sm font-semibold">
                Kết nối giao thương
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
                Sàn nông sản
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
                Tìm nguồn hàng và nhu cầu thu mua theo mặt hàng, số lượng và khu
                vực.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isAuthenticated && (
                <Button variant="outline" asChild>
                  <Link href="/dashboard/my-posts">Tin của tôi</Link>
                </Button>
              )}
              <Button onClick={openPostDialog}>
                <Plus className="h-4 w-4" />
                Đăng tin
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-7 md:py-10">
        <section
          className="border-border bg-card rounded-xl border p-4"
          aria-label="Bộ lọc tin giao thương"
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_auto]">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Tìm cà phê, sầu riêng..."
                className="pl-9"
                aria-label="Tìm tin giao thương"
              />
            </div>
            <select
              value={commodityId}
              onChange={(event) => {
                setCommodityId(
                  event.target.value ? Number(event.target.value) : ''
                )
                setPage(1)
              }}
              className="border-input bg-background focus-visible:ring-ring h-10 rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Lọc theo mặt hàng"
            >
              <option value="">Tất cả mặt hàng</option>
              {commodities.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={!hasFilters}
            >
              <RotateCcw className="h-4 w-4" />
              Xóa lọc
            </Button>
          </div>
          <div
            className="mt-4 flex gap-2 overflow-x-auto"
            role="group"
            aria-label="Loại tin"
          >
            {(
              [
                ['', 'Tất cả'],
                ['SELL', 'Cần bán'],
                ['BUY', 'Cần mua'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={postType === value}
                onClick={() => {
                  setPostType(value)
                  setPage(1)
                }}
                className={cn(
                  'shrink-0 rounded-lg px-4 py-2 text-sm font-semibold',
                  postType === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8 mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-primary text-sm font-semibold">Tin đã duyệt</p>
            <h2 className="mt-1 text-2xl font-bold">Cơ hội giao dịch</h2>
          </div>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            {postsQuery.isFetching && !postsQuery.isPending
              ? 'Đang cập nhật...'
              : `${numberFormat.format(postsQuery.data?.total || 0)} tin`}
          </p>
        </div>

        {postsQuery.isPending ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : postsQuery.isError ? (
          <DataState
            icon={<PackageSearch className="h-5 w-5" />}
            title="Không thể tải tin giao dịch"
            description="Vui lòng kiểm tra kết nối và thử lại."
            action={
              <Button onClick={() => postsQuery.refetch()}>Thử lại</Button>
            }
          />
        ) : !posts.length ? (
          <DataState
            icon={<PackageSearch className="h-5 w-5" />}
            title="Chưa có tin phù hợp"
            description="Hãy thử mặt hàng, loại tin hoặc từ khóa khác."
            action={
              hasFilters ? (
                <Button variant="outline" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            aria-busy={postsQuery.isFetching}
          >
            {posts.map((post) => (
              <MarketPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {!postsQuery.isPending &&
          !postsQuery.isError &&
          (postsQuery.data?.pages || 0) > 1 && (
            <nav
              className="mt-9 flex items-center justify-center gap-3"
              aria-label="Phân trang tin giao thương"
            >
              <Button
                variant="outline"
                disabled={page <= 1 || postsQuery.isFetching}
                onClick={() => setPage((value) => value - 1)}
              >
                Trước
              </Button>
              <span className="text-muted-foreground text-sm">
                Trang <strong className="text-foreground">{page}</strong> /{' '}
                {postsQuery.data?.pages}
              </span>
              <Button
                variant="outline"
                disabled={
                  page >= (postsQuery.data?.pages || 0) || postsQuery.isFetching
                }
                onClick={() => setPage((value) => value + 1)}
              >
                Sau
              </Button>
            </nav>
          )}
      </Container>

      <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FilePenLine className="h-5 w-5" />
              Đăng tin giao dịch
            </DialogTitle>
            <DialogDescription>
              Cung cấp thông tin rõ ràng để đối tác dễ đánh giá và liên hệ.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitPost} className="space-y-4">
            <div className="bg-muted grid grid-cols-2 gap-1 rounded-lg p-1">
              {(
                [
                  ['SELL', 'Cần bán'],
                  ['BUY', 'Cần mua'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, post_type: value })}
                  className={cn(
                    'rounded-md py-2 text-sm font-semibold',
                    form.post_type === value
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="post-commodity">Mặt hàng *</Label>
              <select
                id="post-commodity"
                value={form.commodity_id}
                onChange={(event) => {
                  const id = Number(event.target.value)
                  const found = commodities.find((item) => item.id === id)
                  setForm({
                    ...form,
                    commodity_id: id,
                    unit: normalizeUnit(found?.unit),
                  })
                }}
                className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
              >
                {commodities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            {referencePrice && (
              <div className="border-border bg-muted/50 flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs">
                <span>
                  Giá tham khảo:{' '}
                  <strong>
                    {numberFormat.format(referencePrice)} đ/
                    {normalizeUnit(selectedCommodity?.unit)}
                  </strong>
                </span>
                <button
                  type="button"
                  className="text-primary font-semibold"
                  onClick={() =>
                    setForm({ ...form, price: String(referencePrice) })
                  }
                >
                  Dùng mức giá này
                </button>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="post-title">Tiêu đề *</Label>
              <Input
                id="post-title"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Ví dụ: Bán cà phê Robusta vụ mới tại Đắk Lắk"
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="post-price">Giá chào (đ) *</Label>
                <Input
                  id="post-price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="post-quantity">Số lượng *</Label>
                <Input
                  id="post-quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(event) =>
                    setForm({ ...form, quantity: event.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="post-unit">Đơn vị</Label>
                <Input
                  id="post-unit"
                  value={form.unit}
                  onChange={(event) =>
                    setForm({ ...form, unit: event.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="post-location">Khu vực *</Label>
                <Input
                  id="post-location"
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="post-phone">Điện thoại *</Label>
                <Input
                  id="post-phone"
                  type="tel"
                  value={form.contact_phone}
                  onChange={(event) =>
                    setForm({ ...form, contact_phone: event.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="post-description">Mô tả chi tiết</Label>
              <textarea
                id="post-description"
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Chất lượng, độ ẩm, hình thức giao nhận..."
                className="border-input bg-background focus-visible:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsPostOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi...' : 'Gửi tin'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function MarketPostCard({ post }: { post: MarketPost }) {
  const isBuy = post.post_type === 'BUY'
  const author = post.user?.profile?.full_name || 'Thành viên NoroFarm'
  const date = new Date(post.created_at)
  const imageUrl = getCommodityImage(
    post.title,
    post.commodity?.name,
    (post as any).images?.[0]?.image_url
  )

  return (
    <article className="border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg hover:border-primary/40 group">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-sm',
              isBuy
                ? 'bg-blue-600 text-white'
                : 'bg-emerald-600 text-white'
            )}
          >
            {isBuy ? 'CẦN MUA' : 'CẦN BÁN'}
          </span>
        </div>

        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white/95">
          <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs border border-white/10">
            {post.commodity?.name || 'Nông sản'}
          </span>
          <time
            className="text-white/80 text-[11px] font-medium"
            dateTime={post.created_at}
          >
            {Number.isNaN(date.getTime()) ? '' : dateFormat.format(date)}
          </time>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-bold transition-colors group-hover:text-primary">
          <Link href={`/marketplace/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        {post.description && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {post.description}
          </p>
        )}
        <div className="border-border mt-auto border-t pt-4">
          <p className="text-muted-foreground text-xs">Giá chào</p>
          <p className="text-primary mt-1 text-2xl font-bold tabular-nums">
            {numberFormat.format(post.price)} đ{' '}
            <span className="text-muted-foreground text-xs font-medium">
              / {post.unit}
            </span>
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground text-xs">Số lượng</dt>
              <dd className="mt-0.5 font-semibold">
                {numberFormat.format(post.quantity)} {post.unit}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Khu vực</dt>
              <dd className="mt-0.5 flex items-center gap-1 font-semibold truncate">
                <MapPin className="text-primary h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{post.location || 'Toàn quốc'}</span>
              </dd>
            </div>
          </dl>
        </div>
        <div className="border-border mt-4 flex items-center justify-between gap-3 border-t pt-3.5 text-sm">
          <span className="text-muted-foreground min-w-0 truncate text-xs">{author}</span>
          <Link
            href={`/marketplace/${post.id}`}
            className="text-primary inline-flex shrink-0 items-center gap-1 text-xs font-semibold hover:underline"
          >
            Chi tiết <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
