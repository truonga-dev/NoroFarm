'use client'

import * as React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Newspaper,
  Search,
} from 'lucide-react'

import { apiClient, getAssetUrl } from '@/api/client'
import { commodityService } from '@/api/services/commodity.service'
import { DataState } from '@/components/data-display/data-state'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface Category {
  id: number
  name: string
}
interface Article {
  id: number
  slug?: string
  title: string
  summary?: string
  excerpt?: string
  content?: string
  thumbnail_url?: string
  published_at?: string
  category?: Category
}

const PAGE_SIZE = 12
const articleHref = (article: Article) => `/news/${article.slug || article.id}`
const plainText = (value?: string) =>
  (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Mới cập nhật'

function ArticleImage({
  article,
  className,
}: {
  article: Article
  className?: string
}) {
  const [failed, setFailed] = React.useState(false)
  if (!article.thumbnail_url || failed) {
    return (
      <div
        className={cn('bg-muted flex items-center justify-center', className)}
      >
        <Newspaper className="text-muted-foreground/30 h-9 w-9" />
      </div>
    )
  }
  return (
    <img
      src={getAssetUrl(article.thumbnail_url)}
      alt={article.title}
      className={cn('object-cover', className)}
      onError={() => setFailed(true)}
    />
  )
}

export default function NewsPage() {
  const [search, setSearch] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [search])

  const categoriesQuery = useQuery({
    queryKey: ['news-categories'],
    queryFn: async () => (await apiClient.get('/news/categories')).data,
  })
  const newsQuery = useQuery({
    queryKey: ['public-news-feed', page, debouncedSearch, category],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, size: PAGE_SIZE }
      if (debouncedSearch) params.search = debouncedSearch
      if (category) params.category = category
      return (await apiClient.get('/news', params)).data
    },
  })
  const marketQuery = useQuery({
    queryKey: ['news-market-snapshot'],
    queryFn: () => commodityService.getCommodities({ size: 4 }),
  })

  const articles: Article[] =
    newsQuery.data?.items || newsQuery.data?.data?.items || []
  const total = newsQuery.data?.total || newsQuery.data?.data?.total || 0
  const totalPages = newsQuery.data?.pages || newsQuery.data?.data?.pages || 0
  const categories: Category[] = Array.isArray(categoriesQuery.data)
    ? categoriesQuery.data
    : categoriesQuery.data?.data || []
  const marketItems: any[] = (marketQuery.data?.data?.items || []).slice(0, 4)
  const isFiltered = Boolean(debouncedSearch || category)
  const featured = page === 1 && !isFiltered ? articles[0] : undefined
  const remainingArticles = featured ? articles.slice(1) : articles

  const clearFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setCategory('')
    setPage(1)
  }

  return (
    <main className="pb-16 md:pb-20">
      <div className="border-border bg-card border-b">
        <Container className="py-7 md:py-10">
          <p className="text-primary text-sm font-semibold">Tin và kiến thức</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
            Tin tức nông nghiệp
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
            Diễn biến thị trường, xuất nhập khẩu và kinh nghiệm sản xuất dành
            cho người làm nông.
          </p>
        </Container>
      </div>

      <Container className="py-7 md:py-10">
        {marketItems.length > 0 && (
          <section className="border-border bg-card mb-7 grid rounded-xl border sm:grid-cols-2 lg:grid-cols-[150px_repeat(4,minmax(0,1fr))]">
            <div className="border-border flex items-center justify-between border-b px-4 py-3 sm:col-span-2 lg:col-span-1 lg:border-r lg:border-b-0">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase">
                  Giá nhanh
                </p>
                <Link
                  href="/commodities"
                  className="text-primary mt-1 inline-flex items-center gap-1 text-xs font-medium"
                >
                  Bảng giá <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            {marketItems.map((item, index) => {
              const percent = Number(item.price_change_percent || 0)
              return (
                <Link
                  key={item.id}
                  href={`/commodities/${item.id}`}
                  className={cn(
                    'border-border hover:bg-muted/40 flex items-center justify-between gap-3 px-4 py-3',
                    index > 0 && 'border-t sm:border-t-0',
                    'lg:border-l'
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{item.name}</p>
                    <p className="mt-0.5 font-semibold tabular-nums">
                      {item.current_price
                        ? Math.round(Number(item.current_price)).toLocaleString(
                            'vi-VN'
                          )
                        : '—'}{' '}
                      <span className="text-muted-foreground text-xs font-normal">
                        đ
                      </span>
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold',
                      percent > 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : percent < 0
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-muted-foreground'
                    )}
                  >
                    {percent > 0 ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : percent < 0 ? (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    ) : null}
                    {percent > 0 ? '+' : ''}
                    {percent.toFixed(1)}%
                  </span>
                </Link>
              )
            })}
          </section>
        )}

        <section
          aria-label="Tìm và lọc bài viết"
          className="border-border bg-card mb-8 rounded-xl border p-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:w-80">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder="Tìm bài viết"
                aria-label="Tìm bài viết"
              />
            </div>
            <div
              className="flex min-w-0 flex-1 gap-2 overflow-x-auto"
              aria-label="Lọc theo danh mục"
            >
              <button
                onClick={() => {
                  setCategory('')
                  setPage(1)
                }}
                className={cn(
                  'shrink-0 rounded-lg px-3 py-2 text-sm font-medium',
                  !category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                Tất cả
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCategory(item.name)
                    setPage(1)
                  }}
                  className={cn(
                    'shrink-0 rounded-lg px-3 py-2 text-sm font-medium',
                    category === item.name
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          {!newsQuery.isLoading && (
            <p className="text-muted-foreground mt-3 text-xs">
              {isFiltered
                ? `Tìm thấy ${total} bài viết`
                : `${total} bài viết đã xuất bản`}
            </p>
          )}
        </section>

        {newsQuery.isLoading ? (
          <div className="space-y-7">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-80 rounded-xl" />
              ))}
            </div>
          </div>
        ) : newsQuery.isError ? (
          <DataState
            title="Không thể tải tin tức"
            description="Vui lòng kiểm tra kết nối và thử lại."
            action={
              <Button onClick={() => newsQuery.refetch()}>Thử lại</Button>
            }
          />
        ) : !articles.length ? (
          <DataState
            icon={<Newspaper className="h-5 w-5" />}
            title="Không tìm thấy bài viết"
            description="Hãy thử từ khóa hoặc danh mục khác."
            action={
              isFiltered ? (
                <Button variant="outline" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            {featured && (
              <Link
                href={articleHref(featured)}
                className="group bg-card mb-10 grid overflow-hidden rounded-xl border lg:grid-cols-[1.35fr_1fr]"
              >
                <div className="aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-80">
                  <ArticleImage
                    article={featured}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-primary font-semibold">
                      {featured.category?.name || 'Tin nông nghiệp'}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{formatDate(featured.published_at)}</span>
                  </div>
                  <h2 className="group-hover:text-primary mt-4 text-2xl leading-tight font-bold tracking-[-0.02em] md:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground mt-4 line-clamp-3 text-sm leading-6">
                    {featured.summary ||
                      featured.excerpt ||
                      plainText(featured.content).slice(0, 190)}
                  </p>
                  <span className="text-primary mt-6 inline-flex items-center gap-1 text-sm font-semibold">
                    Đọc bài viết{' '}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )}

            <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {remainingArticles.map((article) => (
                <Link
                  key={article.id}
                  href={articleHref(article)}
                  className="group"
                >
                  <article className="h-full">
                    <div className="aspect-[16/9] overflow-hidden rounded-xl border">
                      <ArticleImage
                        article={article}
                        className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="pt-4">
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span className="text-primary font-semibold">
                          {article.category?.name || 'Tin nông nghiệp'}
                        </span>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(article.published_at)}
                        </span>
                      </div>
                      <h2 className="group-hover:text-primary mt-2 line-clamp-2 text-lg leading-snug font-semibold">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-6">
                        {article.summary ||
                          article.excerpt ||
                          plainText(article.content).slice(0, 140)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Phân trang tin tức"
            className="mt-12 flex items-center justify-center gap-2"
          >
            <Button
              variant="outline"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page === 1 || newsQuery.isLoading}
            >
              Trước
            </Button>
            <span className="text-muted-foreground px-3 text-sm">
              Trang <strong className="text-foreground">{page}</strong> /{' '}
              {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
              disabled={page === totalPages || newsQuery.isLoading}
            >
              Sau
            </Button>
          </nav>
        )}
      </Container>
    </main>
  )
}
