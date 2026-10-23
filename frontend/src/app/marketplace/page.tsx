"use client"

import { useEffect, useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ArrowRight, MapPin, PackageSearch, Plus, RotateCcw, Search } from "lucide-react"
import Link from "next/link"

import { marketService, type MarketPost, type MarketPostList } from "@/api/services/market.service"
import { commodityService } from "@/api/services/commodity.service"
import { Container } from "@/components/layout/container"
import { PageTransition } from "@/components/layout/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

type PostType = "BUY" | "SELL"
type Commodity = { id: number; name: string }

const formatNumber = new Intl.NumberFormat("vi-VN")
const formatDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })

export default function MarketplacePage() {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [postType, setPostType] = useState<PostType | "">("")
  const [commodityId, setCommodityId] = useState<number | "">("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  const { data: commoditiesResponse } = useQuery({
    queryKey: ["commodities-list"],
    queryFn: () => commodityService.getCommodities({ size: 100 }),
  })
  const rawCommodities = commoditiesResponse?.data?.items || commoditiesResponse?.data || []
  const commodities: Commodity[] = Array.isArray(rawCommodities) ? rawCommodities : []

  const { data, isPending, isFetching, isError, refetch } = useQuery<MarketPostList>({
    queryKey: ["market-posts", page, postType, commodityId, search],
    queryFn: async () => {
      const response = await marketService.getPosts({
        page,
        size: 12,
        post_type: postType || undefined,
        commodity_id: commodityId || undefined,
        search: search || undefined,
      })
      return response.data
    },
    placeholderData: keepPreviousData,
  })

  const posts = data?.items ?? []
  const hasFilters = Boolean(searchInput || postType || commodityId)
  const resetFilters = () => {
    setSearchInput("")
    setSearch("")
    setPostType("")
    setCommodityId("")
    setPage(1)
  }

  return (
    <PageTransition>
      <section className="border-b bg-card">
        <Container className="grid gap-8 py-8 md:py-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Kết nối giao dịch nông sản</span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">Tìm nguồn hàng và nhu cầu mua phù hợp</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">Khám phá tin mua và bán đã được duyệt. So sánh mặt hàng, số lượng, giá chào và khu vực trước khi liên hệ đối tác.</p>
          </div>
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <p className="text-sm font-semibold">Bạn có nhu cầu giao dịch?</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Tạo tin mua hoặc bán để đối tác tìm thấy bạn. Tin sẽ được kiểm duyệt trước khi hiển thị.</p>
            <Button className="mt-4 w-full" asChild><Link href="/dashboard/my-posts"><Plus aria-hidden="true" /> Quản lý tin đăng <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </Container>
      </section>

      <section className="py-8 md:py-10" aria-labelledby="market-results-heading">
        <Container>
          <div className="rounded-2xl border bg-card p-4 shadow-sm md:p-6">
            <p className="mb-5 text-sm font-semibold">Lọc cơ hội giao dịch</p>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] lg:items-end">
              <div>
                <label htmlFor="market-search" className="mb-2 block text-sm font-medium">Tìm theo tên tin đăng</label>
                <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="market-search" type="search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Ví dụ: cà phê, sầu riêng..." className="pl-9" /></div>
              </div>
              <div>
                <label htmlFor="market-commodity" className="mb-2 block text-sm font-medium">Mặt hàng</label>
                <select id="market-commodity" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={commodityId} onChange={(event) => { setCommodityId(event.target.value ? Number(event.target.value) : ""); setPage(1) }}>
                  <option value="">Tất cả mặt hàng</option>
                  {commodities.map((commodity) => <option key={commodity.id} value={commodity.id}>{commodity.name}</option>)}
                </select>
              </div>
              <Button variant="outline" onClick={resetFilters} disabled={!hasFilters}><RotateCcw aria-hidden="true" /> Xóa bộ lọc</Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Loại tin đăng">
              {([ ["", "Tất cả"], ["SELL", "Cần bán"], ["BUY", "Cần mua"] ] as const).map(([value, label]) => (
                <button key={value} type="button" aria-pressed={postType === value} onClick={() => { setPostType(value); setPage(1) }} className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${postType === value ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>{label}</button>
              ))}
            </div>
          </div>

          <div className="mb-5 mt-8 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-sm font-medium text-primary">Cơ hội trên sàn</p><h2 id="market-results-heading" className="mt-1 text-2xl font-bold">Tin giao dịch đã duyệt</h2></div>
            <p className="text-sm text-muted-foreground" aria-live="polite">{isFetching && !isPending ? "Đang cập nhật…" : isPending ? "Đang tải…" : `${formatNumber.format(data?.total ?? 0)} tin đăng`}</p>
          </div>

          {isPending ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Đang tải tin đăng">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-72 rounded-2xl" />)}</div>
          ) : isError ? (
            <div className="rounded-2xl border bg-card px-6 py-14 text-center" role="alert"><PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold">Chưa tải được tin giao dịch</h3><p className="mt-2 text-sm text-muted-foreground">Kiểm tra kết nối hoặc thử lại sau ít phút.</p><Button className="mt-5" variant="outline" onClick={() => refetch()}>Thử lại</Button></div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border bg-card px-6 py-14 text-center"><PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold">Chưa có tin phù hợp</h3><p className="mt-2 text-sm text-muted-foreground">Thử mặt hàng, loại tin hoặc từ khóa khác.</p>{hasFilters && <Button className="mt-5" variant="outline" onClick={resetFilters}>Xóa bộ lọc</Button>}</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy={isFetching}>{posts.map((post) => <MarketPostCard key={post.id} post={post} />)}</div>
          )}

          {!isPending && !isError && (data?.pages ?? 0) > 1 && <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Phân trang tin giao dịch"><Button variant="outline" disabled={page <= 1 || isFetching} onClick={() => setPage((current) => current - 1)}>Trang trước</Button><span className="text-sm text-muted-foreground">Trang {page} / {data?.pages}</span><Button variant="outline" disabled={page >= (data?.pages ?? 0) || isFetching} onClick={() => setPage((current) => current + 1)}>Trang sau</Button></nav>}
        </Container>
      </section>
    </PageTransition>
  )
}

function MarketPostCard({ post }: { post: MarketPost }) {
  const isBuy = post.post_type === "BUY"
  const author = post.user?.profile?.full_name || "Người đăng tin"
  const date = new Date(post.created_at)

  return (
    <article className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${isBuy ? "bg-sky-500/10 text-sky-700 dark:text-sky-300" : "bg-primary/10 text-primary"}`}>{isBuy ? "CẦN MUA" : "CẦN BÁN"}</span><time className="text-xs text-muted-foreground" dateTime={post.created_at}>{Number.isNaN(date.getTime()) ? "" : formatDate.format(date)}</time></div>
      <p className="mt-5 text-sm text-muted-foreground">{post.commodity?.name || "Mặt hàng chưa xác định"}</p>
      <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-7"><Link href={`/marketplace/${post.id}`} className="hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{post.title}</Link></h3>
      {post.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.description}</p>}
      <div className="mt-5 border-t pt-4"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Giá chào</p><p className="mt-1 text-2xl font-bold tabular-nums text-primary">{formatNumber.format(post.price)} ₫ <span className="text-sm font-medium text-muted-foreground">/ {post.unit}</span></p><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted-foreground">Số lượng</dt><dd className="mt-1 font-semibold">{formatNumber.format(post.quantity)} {post.unit}</dd></div><div><dt className="text-muted-foreground">Khu vực</dt><dd className="mt-1 flex items-start gap-1 font-semibold"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{post.location || "Chưa cung cấp"}</dd></div></dl></div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm"><span className="min-w-0 truncate text-muted-foreground" title={author}>{author}</span><Link href={`/marketplace/${post.id}`} className="inline-flex min-h-10 items-center gap-1 font-semibold text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Xem chi tiết <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
    </article>
  )
}
