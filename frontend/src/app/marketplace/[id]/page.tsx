'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Package,
  Phone,
  ShieldAlert,
} from 'lucide-react'

import { marketService } from '@/api/services/market.service'
import { DataState } from '@/components/data-display/data-state'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const numberFormat = new Intl.NumberFormat('vi-VN')
const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

export default function MarketPostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const postId = Number(id)
  const validId = Number.isSafeInteger(postId) && postId > 0
  const postQuery = useQuery({
    queryKey: ['market-post', postId],
    queryFn: async () => (await marketService.getPostById(postId)).data,
    enabled: validId,
    retry: false,
  })
  const post = postQuery.data
  const phone = post?.contact_phone?.trim()
  const date = post ? new Date(post.created_at) : null
  const isBuy = post?.post_type === 'BUY'

  if (!validId || postQuery.isError) {
    return (
      <Container className="py-12">
        <DataState
          icon={<Package className="h-5 w-5" />}
          title="Không tìm thấy tin giao dịch"
          description="Tin có thể chưa được duyệt, đã ngừng hiển thị hoặc đường dẫn không chính xác."
          action={
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/marketplace">Xem tin khác</Link>
              </Button>
              {validId && (
                <Button onClick={() => postQuery.refetch()}>Thử lại</Button>
              )}
            </div>
          }
        />
      </Container>
    )
  }
  if (postQuery.isPending || !post) {
    return (
      <Container className="py-10">
        <Skeleton className="h-5 w-48" />
        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </Container>
    )
  }

  const author = post.user?.profile?.full_name || 'Thành viên NoroFarm'

  return (
    <main className="pb-16 md:pb-20">
      <div className="border-border bg-card border-b">
        <Container className="py-5 md:py-7">
          <Link
            href="/marketplace"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Sàn nông sản
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-bold',
                isBuy
                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
              )}
            >
              {isBuy ? 'CẦN MUA' : 'CẦN BÁN'}
            </span>
            <span className="text-primary text-sm font-semibold">
              {post.commodity?.name || 'Nông sản'}
            </span>
            {date && !Number.isNaN(date.getTime()) && (
              <time
                className="text-muted-foreground inline-flex items-center gap-1.5 text-xs"
                dateTime={post.created_at}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                {dateFormat.format(date)}
              </time>
            )}
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl leading-tight font-bold tracking-[-0.03em] md:text-4xl">
            {post.title}
          </h1>
        </Container>
      </div>

      <Container className="py-7 md:py-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <article className="border-border bg-card rounded-xl border">
            <dl className="border-border grid border-b sm:grid-cols-3">
              <div className="px-5 py-4">
                <dt className="text-muted-foreground text-xs">Giá chào</dt>
                <dd className="text-primary mt-1 text-2xl font-bold tabular-nums">
                  {numberFormat.format(post.price)} đ{' '}
                  <span className="text-muted-foreground text-xs font-medium">
                    / {post.unit}
                  </span>
                </dd>
              </div>
              <div className="border-border border-t px-5 py-4 sm:border-t-0 sm:border-l">
                <dt className="text-muted-foreground text-xs">Số lượng</dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums">
                  {numberFormat.format(post.quantity)} {post.unit}
                </dd>
              </div>
              <div className="border-border border-t px-5 py-4 sm:border-t-0 sm:border-l">
                <dt className="text-muted-foreground text-xs">
                  Khu vực giao nhận
                </dt>
                <dd className="mt-1 flex items-start gap-1.5 font-semibold">
                  <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  {post.location || 'Toàn quốc'}
                </dd>
              </div>
            </dl>
            <section
              className="px-5 py-6 md:px-7 md:py-8"
              aria-labelledby="description-heading"
            >
              <h2 id="description-heading" className="text-lg font-semibold">
                Chi tiết giao dịch
              </h2>
              {post.description ? (
                <p className="text-foreground/85 mt-4 text-[1.02rem] leading-8 whitespace-pre-wrap">
                  {post.description}
                </p>
              ) : (
                <p className="text-muted-foreground mt-4 text-sm">
                  Người đăng chưa cung cấp mô tả chi tiết.
                </p>
              )}
            </section>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="border-border bg-card rounded-xl border p-5">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Người đăng
              </p>
              <h2 className="mt-2 text-lg font-semibold">{author}</h2>
              <div className="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Tin đã được duyệt hiển thị
              </div>
              {phone ? (
                <Button className="mt-5 w-full" asChild>
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>
                    <Phone className="h-4 w-4" />
                    Gọi {phone}
                  </a>
                </Button>
              ) : (
                <p className="bg-muted text-muted-foreground mt-5 rounded-lg px-3 py-2.5 text-sm">
                  Tin này chưa cập nhật số điện thoại.
                </p>
              )}
              <p className="text-muted-foreground mt-4 text-xs leading-5">
                Hãy xác nhận chất lượng, số lượng và điều kiện giao nhận trực
                tiếp với người đăng.
              </p>
            </section>

            <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="h-4 w-4" />
                Giao dịch an toàn
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
                <li>Kiểm tra mẫu hàng và thông tin đối tác.</li>
                <li>Đối chiếu giá thị trường trước khi thỏa thuận.</li>
                <li>Lập biên bản cân hàng trước khi thanh toán.</li>
              </ul>
            </section>
          </aside>
        </div>
      </Container>
    </main>
  )
}
