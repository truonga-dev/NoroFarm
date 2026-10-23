"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, CalendarDays, MapPin, Package, Phone, ShieldAlert } from "lucide-react"

import { marketService } from "@/api/services/market.service"
import { Container } from "@/components/layout/container"
import { PageTransition } from "@/components/layout/page-transition"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const formatNumber = new Intl.NumberFormat("vi-VN")
const formatDate = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" })

export default function MarketPostDetailPage() {
  const params = useParams<{ id: string }>()
  const postId = Number(params.id)
  const validId = Number.isSafeInteger(postId) && postId > 0

  const { data: post, isPending, isError, refetch } = useQuery({
    queryKey: ["market-post", postId],
    queryFn: async () => (await marketService.getPostById(postId)).data,
    enabled: validId,
    retry: false,
  })

  const phone = post?.contact_phone?.trim()
  const date = post ? new Date(post.created_at) : null

  return (
    <PageTransition>
      <Container className="py-8 md:py-12">
        <Link href="/marketplace" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Quay lại sàn giao dịch
        </Link>

        {!validId || isError ? (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border bg-card px-6 py-14 text-center" role="alert">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-bold">Không tìm thấy tin giao dịch</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Tin có thể chưa được duyệt, đã ngừng hiển thị hoặc kết nối đang gián đoạn.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="outline" asChild><Link href="/marketplace">Xem tin khác</Link></Button>
              {validId && <Button onClick={() => refetch()}>Thử lại</Button>}
            </div>
          </div>
        ) : isPending || !post ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" aria-label="Đang tải chi tiết tin đăng">
            <Skeleton className="h-96 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <article className="min-w-0 rounded-2xl border bg-card p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${post.post_type === "BUY" ? "bg-sky-500/10 text-sky-700 dark:text-sky-300" : "bg-primary/10 text-primary"}`}>
                  {post.post_type === "BUY" ? "CẦN MUA" : "CẦN BÁN"}
                </span>
                <span>{post.commodity?.name || "Mặt hàng chưa xác định"}</span>
                {date && !Number.isNaN(date.getTime()) && <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" aria-hidden="true" /><time dateTime={post.created_at}>{formatDate.format(date)}</time></span>}
              </div>
              <h1 className="mt-5 break-words text-3xl font-bold leading-tight tracking-tight md:text-4xl">{post.title}</h1>
              <p className="mt-3 text-sm text-muted-foreground">Đăng bởi {post.user?.profile?.full_name || "Người đăng tin"}</p>

              <dl className="mt-8 grid gap-4 rounded-xl bg-muted/60 p-5 sm:grid-cols-3">
                <div><dt className="text-sm text-muted-foreground">Giá chào</dt><dd className="mt-1 text-xl font-bold tabular-nums text-primary">{formatNumber.format(post.price)} ₫ <span className="text-sm font-medium">/ {post.unit}</span></dd></div>
                <div><dt className="text-sm text-muted-foreground">Số lượng</dt><dd className="mt-1 text-lg font-semibold tabular-nums">{formatNumber.format(post.quantity)} {post.unit}</dd></div>
                <div><dt className="text-sm text-muted-foreground">Khu vực</dt><dd className="mt-1 flex items-start gap-1 text-lg font-semibold"><MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{post.location || "Chưa cung cấp"}</dd></div>
              </dl>

              <section className="mt-9" aria-labelledby="post-description-heading">
                <h2 id="post-description-heading" className="text-xl font-bold">Thông tin từ người đăng</h2>
                {post.description ? <p className="mt-4 whitespace-pre-wrap break-words leading-8 text-foreground/90">{post.description}</p> : <p className="mt-4 text-muted-foreground">Người đăng chưa cung cấp mô tả chi tiết.</p>}
              </section>
            </article>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold">Liên hệ người đăng</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Trao đổi trực tiếp để xác nhận hàng hóa, giá và điều kiện giao nhận trước khi chốt giao dịch.</p>
                {phone ? (
                  <Button className="mt-5 w-full" asChild><a href={`tel:${phone.replace(/[^+\d]/g, "")}`}><Phone aria-hidden="true" /> Gọi {phone}</a></Button>
                ) : <p className="mt-5 rounded-lg bg-muted p-3 text-sm text-muted-foreground">Tin này chưa có số liên hệ.</p>}
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-6">
                <div className="flex items-center gap-2 font-semibold"><ShieldAlert className="h-4 w-4 text-amber-600" aria-hidden="true" /> Lưu ý trước khi giao dịch</div>
                <p className="mt-2 text-muted-foreground">Tin đã được duyệt nội dung, không đồng nghĩa NoroFarm đã xác minh người đăng, chất lượng hàng hoặc bảo đảm thanh toán.</p>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </PageTransition>
  )
}
