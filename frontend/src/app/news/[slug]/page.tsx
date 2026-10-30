'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Link2,
  Newspaper,
  Share2,
} from 'lucide-react'

import { apiClient, getAssetUrl } from '@/api/client'
import { DataState } from '@/components/data-display/data-state'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function formatDate(value?: string) {
  return value
    ? new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(value))
    : 'Mới đăng'
}
function readingTime(content?: string) {
  const words = (content || '')
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}
function headingId(value: string) {
  return value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
function InlineText({ value }: { value: string }) {
  return (
    <>
      {value
        .split(/(\*\*[^*]+\*\*)/g)
        .map((part, index) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={index}>{part.slice(2, -2)}</strong>
          ) : (
            <React.Fragment key={index}>{part}</React.Fragment>
          )
        )}
    </>
  )
}

function ArticleBody({ content }: { content: string }) {
  if (/<[a-z][\s\S]*>/i.test(content)) {
    const withIds = content.replace(
      /<h([2-4])([^>]*)>(.*?)<\/h\1>/gi,
      (_match, level, attrs, inner) => {
        const title = inner.replace(/<[^>]+>/g, '').trim()
        const id = headingId(title)
        const cleanedAttrs = String(attrs).replace(/\s+id=(["']).*?\1/i, '')
        return `<h${level}${cleanedAttrs} id="${id}">${inner}</h${level}>`
      }
    )
    return (
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: withIds }}
      />
    )
  }

  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: React.ReactNode[] = []
  let paragraph: string[] = []
  let list: string[] = []
  const flushParagraph = () => {
    if (!paragraph.length) return
    const value = paragraph.join(' ')
    blocks.push(
      <p
        key={`p-${blocks.length}`}
        className="text-foreground/85 text-[1.0625rem] leading-8"
      >
        <InlineText value={value} />
      </p>
    )
    paragraph = []
  }
  const flushList = () => {
    if (!list.length) return
    blocks.push(
      <ul
        key={`l-${blocks.length}`}
        className="marker:text-primary list-disc space-y-2 pl-6 text-[1.0625rem] leading-8"
      >
        {list.map((item, index) => (
          <li key={index}>
            <InlineText value={item} />
          </li>
        ))}
      </ul>
    )
    list = []
  }
  lines.forEach((rawLine) => {
    const line = rawLine.trim()
    const heading = line.match(/^(#{1,4})\s+(.+)$/)
    const bullet = line.match(/^[-*]\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push(
        <h2
          key={`h-${blocks.length}`}
          id={headingId(heading[2])}
          className="scroll-mt-24 pt-5 text-2xl font-bold tracking-[-0.02em]"
        >
          {heading[2]}
        </h2>
      )
    } else if (bullet) {
      flushParagraph()
      list.push(bullet[1])
    } else if (!line) {
      flushParagraph()
      flushList()
    } else {
      flushList()
      paragraph.push(line)
    }
  })
  flushParagraph()
  flushList()
  return <div className="space-y-6">{blocks}</div>
}

function ArticleImage({
  src,
  alt,
  className,
}: {
  src?: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = React.useState(false)
  if (!src || failed)
    return (
      <div
        className={cn('bg-muted flex items-center justify-center', className)}
      >
        <Newspaper className="text-muted-foreground/30 h-10 w-10" />
      </div>
    )
  return (
    <img
      src={getAssetUrl(src)}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [copied, setCopied] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const articleQuery = useQuery({
    queryKey: ['news-detail', slug],
    queryFn: async () => (await apiClient.get(`/news/${slug}`)).data,
    enabled: Boolean(slug),
  })
  const article = articleQuery.data
  const relatedQuery = useQuery({
    queryKey: ['related-news', article?.category_id, slug],
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {
        size: 4,
        sort_by: 'published_at',
        sort_desc: true,
      }
      if (article?.category_id) params.category_id = article.category_id
      return (await apiClient.get('/news', params)).data
    },
    enabled: Boolean(article),
  })

  React.useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(
        height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0
      )
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const related = (
    relatedQuery.data?.items ||
    relatedQuery.data?.data?.items ||
    []
  )
    .filter((item: any) => item.id !== article?.id)
    .slice(0, 3)
  const minutes = readingTime(article?.content)
  const headings = React.useMemo(() => {
    if (!article?.content) return []
    const markdown = article.content
      .split(/\r?\n/)
      .map((line: string) => line.match(/^#{1,4}\s+(.+)$/)?.[1]?.trim())
      .filter(Boolean)
    if (markdown.length) return markdown as string[]
    const values: string[] = []
    const pattern = /<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi
    let match: RegExpExecArray | null
    while ((match = pattern.exec(article.content)) !== null)
      values.push(match[1].replace(/<[^>]+>/g, '').trim())
    return values
  }, [article?.content])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  if (articleQuery.isLoading) {
    return (
      <Container className="py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="aspect-[16/7] w-full rounded-xl" />
        </div>
      </Container>
    )
  }
  if (articleQuery.isError || !article) {
    return (
      <Container className="py-12">
        <DataState
          icon={<Newspaper className="h-5 w-5" />}
          title="Không tìm thấy bài viết"
          description="Bài viết có thể đã được di chuyển, gỡ bỏ hoặc đường dẫn chưa chính xác."
          action={
            <Button asChild>
              <Link href="/news">
                <ArrowLeft className="h-4 w-4" />
                Về trang tin
              </Link>
            </Button>
          }
        />
      </Container>
    )
  }

  const author =
    article.author?.profile?.full_name ||
    article.author?.full_name ||
    'Ban biên tập NoroFarm'

  return (
    <main className="pb-16 md:pb-20">
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5">
        <div className="bg-primary h-full" style={{ width: `${progress}%` }} />
      </div>

      <div className="border-border bg-card border-b">
        <Container className="py-7 md:py-10">
          <nav
            aria-label="Đường dẫn"
            className="text-muted-foreground flex items-center gap-2 text-sm"
          >
            <Link
              href="/news"
              className="hover:text-foreground inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Tin tức
            </Link>
            <span aria-hidden>/</span>
            <span className="max-w-56 truncate">
              {article.category?.name || 'Tin nông nghiệp'}
            </span>
          </nav>
          <div className="mx-auto mt-7 max-w-4xl">
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <span className="text-primary font-semibold">
                {article.category?.name || 'Tin nông nghiệp'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(article.published_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                {minutes} phút đọc
              </span>
            </div>
            <h1 className="mt-5 text-3xl leading-[1.15] font-bold tracking-[-0.035em] sm:text-4xl md:text-5xl">
              {article.title}
            </h1>
            {article.summary && (
              <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
                {article.summary}
              </p>
            )}
            <div className="border-border mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
              <div>
                <p className="text-sm font-semibold">{author}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Nội dung đã qua biên tập
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {copied ? 'Đã sao chép' : 'Chia sẻ'}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          {article.thumbnail_url && (
            <figure className="border-border bg-muted mb-10 overflow-hidden rounded-xl border">
              <div className="aspect-[16/8] md:aspect-[16/7]">
                <ArticleImage
                  src={article.thumbnail_url}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {article.image_caption && (
                <figcaption className="border-border bg-card text-muted-foreground border-t px-4 py-3 text-sm">
                  {article.image_caption}
                </figcaption>
              )}
            </figure>
          )}

          <div
            className={cn(
              'grid gap-10',
              headings.length &&
                'lg:grid-cols-[190px_minmax(0,760px)] lg:justify-center'
            )}
          >
            {headings.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Trong bài
                  </p>
                  <nav className="border-border mt-3 space-y-2 border-l pl-4">
                    {headings.map((heading: string, index: number) => (
                      <a
                        key={`${heading}-${index}`}
                        href={`#${headingId(heading)}`}
                        className="text-muted-foreground hover:text-primary block text-sm leading-5"
                      >
                        {heading}
                      </a>
                    ))}
                  </nav>
                  <button
                    onClick={copyLink}
                    className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-2 text-sm font-medium"
                  >
                    <Link2 className="h-4 w-4" />
                    Sao chép liên kết
                  </button>
                </div>
              </aside>
            )}
            <article
              className={cn(
                'min-w-0',
                !headings.length && 'mx-auto max-w-[760px]'
              )}
            >
              <ArticleBody content={article.content || ''} />
              <div className="border-border mt-12 flex flex-col justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold">Chia sẻ kiến thức hữu ích</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Gửi bài viết này cho người có thể cần thông tin.
                  </p>
                </div>
                <Button variant="outline" onClick={copyLink}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  {copied ? 'Đã sao chép' : 'Sao chép liên kết'}
                </Button>
              </div>
            </article>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="border-border bg-muted/30 border-t py-12 md:py-16">
          <Container>
            <div className="mx-auto max-w-5xl">
              <div className="mb-7 flex items-end justify-between">
                <div>
                  <p className="text-primary text-sm font-semibold">Đọc tiếp</p>
                  <h2 className="mt-1 text-2xl font-bold">
                    Bài viết liên quan
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="text-primary hidden items-center gap-1 text-sm font-semibold sm:inline-flex"
                >
                  Tất cả bài viết <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {related.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug || item.id}`}
                    className="group"
                  >
                    <article>
                      <div className="border-border aspect-[16/9] overflow-hidden rounded-xl border">
                        <ArticleImage
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="text-primary mt-4 text-xs font-semibold">
                        {item.category?.name || 'Tin nông nghiệp'}
                      </p>
                      <h3 className="group-hover:text-primary mt-2 line-clamp-2 leading-snug font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-xs">
                        {formatDate(item.published_at)}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </main>
  )
}
