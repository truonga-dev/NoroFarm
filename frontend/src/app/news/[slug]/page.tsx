"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Leaf,
  Link2,
  Newspaper,
  Share2,
} from "lucide-react"

import { apiClient, getAssetUrl } from "@/api/client"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function formatDate(value?: string) {
  if (!value) return "Mới đăng"
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

function getReadingTime(content?: string) {
  const text = (content || "").replace(/<[^>]*>/g, " ").trim()
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 220))
}

function headingId(value: string) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function InlineText({ value }: { value: string }) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g)
  return <>{parts.map((part, index) => part.startsWith("**") && part.endsWith("**")
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : <React.Fragment key={index}>{part}</React.Fragment>)}</>
}

function ArticleBody({ content }: { content: string }) {
  const hasHtml = /<[a-z][\s\S]*>/i.test(content)

  if (hasHtml) {
    return <div className="article-content" dangerouslySetInnerHTML={{ __html: content }} />
  }

  const lines = content.replace(/\r\n/g, "\n").split("\n")
  const blocks: React.ReactNode[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    const value = paragraph.join(" ")
    blocks.push(<p key={`p-${blocks.length}`} className="text-[1.0625rem] leading-8 text-foreground/85"><InlineText value={value} /></p>)
    paragraph = []
  }
  const flushList = () => {
    if (!list.length) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-3 rounded-2xl border bg-muted/30 p-5 pl-11 text-[1.0625rem] leading-7 marker:text-primary">
        {list.map((item, index) => <li key={index} className="pl-1"><InlineText value={item} /></li>)}
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
      const title = heading[2]
      blocks.push(
        <h2 key={`h-${blocks.length}`} id={headingId(title)} className="scroll-mt-28 pt-5 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
          {title}
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

function ArticleImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = React.useState(false)

  if (!src || failed) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-emerald-500/10", className)}>
        <div className="text-center text-muted-foreground">
          <Newspaper className="mx-auto h-10 w-10 opacity-30" />
          <span className="mt-2 block text-xs">NoroFarm News</span>
        </div>
      </div>
    )
  }

  return <img src={getAssetUrl(src)} alt={alt} className={className} onError={() => setFailed(true)} />
}

export default function NewsDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug
  const [copied, setCopied] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["news-detail", slug],
    queryFn: async () => {
      const response = await apiClient.get(`/news/${slug}`)
      return response.data
    },
    enabled: Boolean(slug),
  })

  const { data: relatedData } = useQuery({
    queryKey: ["related-news", article?.category_id, slug],
    queryFn: async () => {
      const query: Record<string, string | number | boolean> = {
        size: 4,
        sort_by: "published_at",
        sort_desc: true,
      }
      if (article?.category_id) query.category_id = article.category_id
      const response = await apiClient.get("/news", query)
      return response.data
    },
    enabled: Boolean(article),
  })

  React.useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0)
    }
    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  const relatedArticles: any[] = relatedData?.items || relatedData?.data?.items || []
  const filteredRelated = relatedArticles.filter((item) => item.id !== article?.id).slice(0, 3)
  const readingTime = getReadingTime(article?.content)
  const tableOfContents = React.useMemo<string[]>(() => {
    if (!article?.content) return []
    const markdownHeadings = article.content
      .split(/\r?\n/)
      .map((line: string) => line.match(/^#{1,4}\s+(.+)$/)?.[1]?.trim())
      .filter((heading: string | undefined): heading is string => Boolean(heading))
    if (markdownHeadings.length) return markdownHeadings
    const htmlHeadings: string[] = []
    const headingPattern = /<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi
    let match: RegExpExecArray | null
    while ((match = headingPattern.exec(article.content)) !== null) {
      htmlHeadings.push(match[1].replace(/<[^>]+>/g, "").trim())
    }
    return htmlHeadings
  }, [article?.content])

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pb-20">
        <Container className="py-10">
          <div className="mx-auto max-w-5xl space-y-7">
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-16 w-full max-w-4xl" />
            <Skeleton className="h-7 w-4/5" />
            <Skeleton className="aspect-[16/7] w-full rounded-3xl" />
            <div className="mx-auto max-w-3xl space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </Container>
      </main>
    )
  }

  if (isError || !article) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Newspaper className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
          <p className="mt-3 text-muted-foreground">Bài viết có thể đã được di chuyển, gỡ bỏ hoặc đường dẫn chưa chính xác.</p>
          <Button asChild className="mt-7 rounded-full">
            <Link href="/news"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại tin tức</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background pb-20">
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="border-b bg-gradient-to-b from-primary/[0.07] via-background to-background">
        <Container className="pb-10 pt-8 md:pb-14 md:pt-10">
          <div className="mx-auto max-w-6xl">
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary">Trang chủ</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/news" className="hover:text-primary">Tin tức</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="max-w-[220px] truncate text-foreground">{article.title}</span>
            </nav>

            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground shadow-sm">
                    <Leaf className="h-3.5 w-3.5" />
                    {article.category?.name || "Tin nông nghiệp"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" /> {formatDate(article.published_at)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock3 className="h-4 w-4" /> {readingTime} phút đọc
                  </span>
                </div>

                <h1 className="max-w-5xl text-3xl font-black leading-[1.12] tracking-[-0.03em] text-foreground sm:text-4xl md:text-6xl">
                  {article.title}
                </h1>
                {article.summary && (
                  <p className="mt-6 max-w-4xl text-lg font-medium leading-8 text-muted-foreground md:text-xl">
                    {article.summary}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Thực hiện bởi</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-400 font-bold text-white">
                    {(article.author?.profile?.full_name || article.author?.full_name || "N").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{article.author?.profile?.full_name || article.author?.full_name || "Ban biên tập NoroFarm"}</p>
                    <p className="text-xs text-muted-foreground">Nội dung đã kiểm duyệt</p>
                  </div>
                </div>
                <Button variant="outline" onClick={copyLink} className="mt-4 w-full rounded-xl gap-2">
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                  {copied ? "Đã sao chép liên kết" : "Chia sẻ bài viết"}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          {article.thumbnail_url && (
            <figure className="relative mb-12 overflow-hidden rounded-[2rem] border bg-muted shadow-xl shadow-black/5">
              <div className="aspect-[16/8] md:aspect-[16/7]">
                <ArticleImage src={article.thumbnail_url} alt={article.title} className="h-full w-full object-cover" />
              </div>
              {article.image_caption && (
                <figcaption className="border-t bg-card px-5 py-3 text-sm text-muted-foreground">{article.image_caption}</figcaption>
              )}
            </figure>
          )}

          <div className="grid gap-10 lg:grid-cols-[180px_minmax(0,760px)] lg:justify-center">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Bài viết</p>
                <div className="space-y-2 border-l pl-4 text-sm text-muted-foreground">
                  <p>{formatDate(article.published_at)}</p>
                  <p>{readingTime} phút đọc</p>
                  <button onClick={copyLink} className="flex items-center gap-2 font-medium text-foreground hover:text-primary">
                    <Link2 className="h-4 w-4" /> Sao chép link
                  </button>
                </div>
                {tableOfContents.length > 0 && (
                  <div className="pt-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Nội dung chính</p>
                    <nav className="space-y-2 border-l pl-4">
                      {tableOfContents.map((heading, index) => (
                        <a key={`${heading}-${index}`} href={`#${headingId(heading)}`} className="block text-sm leading-5 text-muted-foreground transition-colors hover:text-primary">
                          {heading}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            </aside>

            <article className="min-w-0">
              <ArticleBody content={article.content || ""} />

              <div className="mt-12 flex flex-col gap-4 rounded-2xl border bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">Nội dung có hữu ích với bạn?</p>
                  <p className="mt-1 text-sm text-muted-foreground">Chia sẻ bài viết để nhiều nhà nông cùng tiếp cận kiến thức.</p>
                </div>
                <Button onClick={copyLink} className="shrink-0 rounded-full gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {copied ? "Đã sao chép" : "Chia sẻ bài viết"}
                </Button>
              </div>
            </article>
          </div>
        </div>
      </Container>

      {filteredRelated.length > 0 && (
        <section className="border-t bg-muted/20 py-16 md:py-20">
          <Container>
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 flex items-end justify-between gap-5">
                <div>
                  <p className="mb-2 text-sm font-semibold text-primary">Đọc thêm</p>
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Bài viết liên quan</h2>
                </div>
                <Button variant="outline" asChild className="hidden rounded-full sm:inline-flex">
                  <Link href="/news">Tất cả tin tức <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {filteredRelated.map((related) => (
                  <Link key={related.id} href={`/news/${related.slug || related.id}`} className="group">
                    <article className="h-full overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        {related.thumbnail_url ? (
                          <ArticleImage src={related.thumbnail_url} alt={related.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center"><Newspaper className="h-10 w-10 text-muted-foreground/30" /></div>
                        )}
                      </div>
                      <div className="p-5">
                        <p className="mb-3 text-xs font-medium text-primary">{related.category?.name || "Tin nông nghiệp"}</p>
                        <h3 className="line-clamp-2 font-bold leading-snug transition-colors group-hover:text-primary">{related.title}</h3>
                        <p className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(related.published_at)}
                        </p>
                      </div>
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
