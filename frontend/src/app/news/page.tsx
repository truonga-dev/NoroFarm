"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Clock, ChevronRight, Search, Filter, Newspaper, Tag } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/api/client"

export default function NewsPage() {
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [page, setPage] = React.useState(1)
  const SIZE = 12

  React.useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [search])

  // Lấy categories
  const { data: catData } = useQuery({
    queryKey: ["news-categories"],
    queryFn: async () => {
      const res = await apiClient.get("/news/categories")
      return res.data
    }
  })

  // Lấy bài viết
  const { data, isLoading } = useQuery({
    queryKey: ["public-news-feed", page, debouncedSearch, category],
    queryFn: async () => {
      const params: Record<string, any> = { page, size: SIZE }
      if (debouncedSearch) params.search = debouncedSearch
      if (category) params.category = category
      const res = await apiClient.get("/news", params)
      return res.data
    }
  })

  const articles: any[] = data?.items || data?.data?.items || []
  const total = data?.total || data?.data?.total || 0
  const pages = data?.pages || data?.data?.pages || 0
  const categories: any[] = catData?.data || []

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-b py-12">
        <Container>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Newspaper className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary font-medium">NoroFarm News</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">Tin tức & Thị trường</h1>
            <p className="text-muted-foreground text-lg">
              Cập nhật những diễn biến mới nhất về giá cả, xu hướng xuất nhập khẩu và kỹ thuật canh tác nông nghiệp.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setCategory(""); setPage(1) }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${!category ? "bg-primary text-primary-foreground shadow-sm" : "bg-background border hover:bg-muted"}`}
            >
              Tất cả
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.name); setPage(1) }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${category === cat.name ? "bg-primary text-primary-foreground shadow-sm" : "bg-background border hover:bg-muted"}`}
              >
                <Tag className="w-3 h-3" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-6">
            {debouncedSearch || category
              ? <>Tìm thấy <span className="font-semibold text-foreground">{total}</span> bài viết</>
              : <>Hiển thị <span className="font-semibold text-foreground">{articles.length}</span> / <span className="font-semibold text-foreground">{total}</span> bài viết</>
            }
          </p>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center text-muted-foreground gap-3">
              <Newspaper className="w-12 h-12 opacity-20" />
              <p className="font-medium">Chưa tìm thấy bài viết nào</p>
              {(debouncedSearch || category) && (
                <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCategory("") }}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            articles.map((article: any) => (
              <Link key={article.id} href={`/news/${article.slug || article.id}`}>
                <article className="group h-full flex flex-col bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[16/9] w-full overflow-hidden bg-muted/50 relative">
                    {article.thumbnail_url ? (
                      <img
                        src={article.thumbnail_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-emerald-500/5">
                        <Newspaper className="h-10 w-10 opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 flex-wrap">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {article.category?.name || "Tin tức chung"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString("vi-VN")
                          : "Gần đây"}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3 mb-4 flex-1 text-sm leading-relaxed">
                      {article.summary || article.content?.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..."}
                    </p>
                    <div className="flex items-center text-primary font-medium text-sm mt-auto">
                      Đọc tiếp <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              ← Trước
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                const p = i + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      page === p ? "bg-primary text-white" : "bg-background border hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              {pages > 5 && <span className="w-9 h-9 flex items-center justify-center text-muted-foreground">...</span>}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages || isLoading}
            >
              Sau →
            </Button>
          </div>
        )}
      </Container>
    </div>
  )
}
