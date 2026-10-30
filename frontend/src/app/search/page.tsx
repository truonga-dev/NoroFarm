"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  X, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Newspaper, 
  Store, 
  Calendar, 
  MapPin, 
  Leaf, 
  Coffee, 
  ShoppingBag, 
  History, 
  Loader2,
  Sparkles,
  Layers
} from "lucide-react"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { commodityService } from "@/api/services/commodity.service"
import { newsService } from "@/api/services/news.service"
import { marketService } from "@/api/services/market.service"
import { shopService } from "@/api/services/shop.service"
import { getCommodityImage } from "@/lib/commodity-images"
import { cn } from "@/lib/utils"

const POPULAR_KEYWORDS = [
  "Cà phê Robusta",
  "Sầu riêng Ri6",
  "Hồ tiêu đen",
  "Lúa ST25",
  "Bưởi da xanh",
  "Phân bón NPK",
  "Dự báo El Nino",
]

const QUICK_LINKS = [
  {
    title: "Bảng giá Nông sản Hôm nay",
    desc: "Cập nhật giá cà phê, hồ tiêu, sầu riêng, lúa gạo theo thời gian thực",
    href: "/commodities",
    icon: TrendingUp,
    badge: "Thời gian thực"
  },
  {
    title: "Thời tiết & Dự báo Nông nghiệp",
    desc: "Cảnh báo hạn mặn, mưa bão và khuyến nghị lịch mùa vụ các vùng",
    href: "/weather",
    icon: Leaf,
    badge: "Định vị GPS"
  },
  {
    title: "Sàn Giao dịch Nông sản B2B",
    desc: "Kết nối chào bán và cần mua nông sản trực tiếp từ nhà vườn",
    href: "/marketplace",
    icon: Store,
    badge: "Hơn 500+ tin"
  },
  {
    title: "Tin tức Thị trường & Xuất khẩu",
    desc: "Phân tích biến động giá thế giới, chính sách xuất khẩu năm 2026",
    href: "/news",
    icon: Newspaper,
    badge: "Mới nhất"
  }
]

type SearchTab = "ALL" | "COMMODITIES" | "NEWS" | "MARKET" | "SHOP"

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = React.useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = React.useState(initialQuery)
  const [activeTab, setActiveTab] = React.useState<SearchTab>("ALL")
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])

  // Load recent searches from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("norofarm_recent_searches")
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const saveRecentSearch = React.useCallback((term: string) => {
    const trimmed = term.trim()
    if (!trimmed || trimmed.length < 2) return
    try {
      setRecentSearches(prev => {
        const updated = [trimmed, ...prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6)
        localStorage.setItem("norofarm_recent_searches", JSON.stringify(updated))
        return updated
      })
    } catch {
      // Ignore storage errors
    }
  }, [])

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim())
      if (query.trim().length >= 2) {
        saveRecentSearch(query.trim())
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [query, saveRecentSearch])

  // Sync when URL query changes
  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
      setDebouncedQuery(initialQuery)
    }
  }, [initialQuery])

  const hasSearch = debouncedQuery.length >= 2

  // 1. Commodities query
  const { data: commoditiesData, isLoading: loadingCommodities } = useQuery({
    queryKey: ["search-commodities", debouncedQuery],
    queryFn: async () => {
      const res = await commodityService.getCommodities({ search: debouncedQuery, size: 20 })
      return res?.data?.items || (Array.isArray(res?.data) ? res.data : []) || []
    },
    enabled: hasSearch,
    staleTime: 60 * 1000,
  })

  // 2. News query
  const { data: newsData, isLoading: loadingNews } = useQuery({
    queryKey: ["search-news", debouncedQuery],
    queryFn: async () => {
      const res = await newsService.getArticles({ search: debouncedQuery, size: 10, page: 1 })
      return res?.data?.items || (Array.isArray(res?.data) ? res.data : []) || []
    },
    enabled: hasSearch,
    staleTime: 60 * 1000,
  })

  // 3. Market trade query
  const { data: marketData, isLoading: loadingMarket } = useQuery({
    queryKey: ["search-market", debouncedQuery],
    queryFn: async () => {
      const res = await marketService.getPosts({ search: debouncedQuery, size: 10, page: 1 })
      return res?.data?.items || (Array.isArray(res?.data) ? res.data : []) || []
    },
    enabled: hasSearch,
    staleTime: 60 * 1000,
  })

  // 4. Shop products query
  const { data: shopData, isLoading: loadingShop } = useQuery({
    queryKey: ["search-shop", debouncedQuery],
    queryFn: async () => {
      const res = await shopService.getProducts({ search: debouncedQuery, size: 10, page: 1 })
      return res?.data?.items || (Array.isArray(res?.data) ? res.data : []) || []
    },
    enabled: hasSearch,
    staleTime: 60 * 1000,
  })

  const commodities = commoditiesData || []
  const news = newsData || []
  const marketPosts = marketData || []
  const products = shopData || []

  const totalResults = commodities.length + news.length + marketPosts.length + products.length
  const isSearching = loadingCommodities || loadingNews || loadingMarket || loadingShop

  const handleSelectKeyword = (kw: string) => {
    setQuery(kw)
    setDebouncedQuery(kw)
    saveRecentSearch(kw)
    router.replace(`/search?q=${encodeURIComponent(kw)}`)
  }

  const handleClear = () => {
    setQuery("")
    setDebouncedQuery("")
    router.replace("/search")
  }

  return (
    <Section className="min-h-[75vh] py-8 md:py-12">
      <Container className="max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Công cụ tìm kiếm nông sản NoroFarm
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Khám phá dữ liệu Nông nghiệp
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xl mx-auto">
            Tra cứu thời gian thực giá nông sản, dự báo thời tiết, cơ hội giao thương B2B và vật tư canh tác.
          </p>
        </div>

        {/* Big Search Bar */}
        <div className="relative max-w-3xl mx-auto mb-6 shadow-md rounded-2xl group focus-within:ring-2 focus-within:ring-primary/40 transition-all">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center gap-2">
            {isSearching ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Search className="h-5 w-5 group-focus-within:text-primary transition-colors" />
            )}
          </div>
          <Input 
            className="pl-12 pr-12 h-14 rounded-2xl text-base md:text-lg bg-card border-border/80 shadow-xs"
            placeholder="Nhập tên nông sản, khu vực, tin tức, nhà cung cấp..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
              aria-label="Xóa nội dung tìm kiếm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Recent searches & Popular keywords (if not searching or empty) */}
        {!hasSearch && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> Lịch sử tìm kiếm gần đây
                  </h3>
                  <button
                    onClick={() => {
                      setRecentSearches([])
                      localStorage.removeItem("norofarm_recent_searches")
                    }}
                    className="text-xs text-muted-foreground hover:text-primary hover:underline"
                  >
                    Xóa lịch sử
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectKeyword(term)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-card hover:bg-primary/10 hover:text-primary text-xs font-medium transition-all"
                    >
                      <History className="h-3 w-3 text-muted-foreground" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Keywords */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Từ khóa nông nghiệp phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_KEYWORDS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectKeyword(tag)}
                    className="px-3.5 py-1.5 rounded-xl border bg-card hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-medium transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Access Links */}
            <div className="pt-6 border-t">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Truy cập nhanh các chuyên trang
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {QUICK_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group p-4 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all flex items-start gap-3.5"
                  >
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Area */}
        {hasSearch && (
          <div className="space-y-6">
            {/* Search Overview & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Kết quả tra cứu cho: <strong className="text-foreground text-sm">&quot;{debouncedQuery}&quot;</strong>
                </p>
                <p className="text-sm font-semibold text-primary mt-0.5">
                  {isSearching ? "Đang tìm kiếm..." : `Tìm thấy ${totalResults} kết quả phù hợp`}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-muted/60 p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("ALL")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTab === "ALL" ? "bg-background text-foreground font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Tất cả ({totalResults})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("COMMODITIES")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTab === "COMMODITIES" ? "bg-background text-foreground font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Nông sản ({commodities.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("NEWS")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTab === "NEWS" ? "bg-background text-foreground font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Tin tức ({news.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("MARKET")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTab === "MARKET" ? "bg-background text-foreground font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Thị trường B2B ({marketPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("SHOP")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTab === "SHOP" ? "bg-background text-foreground font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Vật tư ({products.length})
                </button>
              </div>
            </div>

            {/* Empty State */}
            {!isSearching && totalResults === 0 && (
              <div className="py-16 text-center bg-card border rounded-3xl p-8 max-w-xl mx-auto shadow-xs">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <h3 className="text-lg font-bold text-foreground">Không tìm thấy kết quả phù hợp</h3>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
                  Không có nông sản, bài viết hoặc tin giao dịch nào khớp với từ khóa &quot;{debouncedQuery}&quot;. Hãy thử từ khóa ngắn hơn như &quot;Cà phê&quot;, &quot;Tiêu&quot;, &quot;Sầu riêng&quot;.
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleClear} className="rounded-xl">
                    Xóa tìm kiếm
                  </Button>
                  <Button size="sm" asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link href="/commodities">Xem bảng giá hôm nay</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* 1. Commodities Results */}
            {(activeTab === "ALL" || activeTab === "COMMODITIES") && commodities.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" /> Bảng giá Nông sản ({commodities.length})
                  </h3>
                  <Link href="/commodities" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                    Xem tất cả giá <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {commodities.map((item: any) => {
                    const isUp = (item.price_change ?? item.change_24h ?? 0) >= 0
                    return (
                      <Link
                        key={item.id}
                        href={`/commodities/${item.id}`}
                        className="p-4 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-foreground text-sm line-clamp-1">{item.name}</span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                              isUp 
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" 
                                : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
                            )}
                          >
                            {isUp ? "+" : ""}{item.price_change_percent ? `${Number(item.price_change_percent).toFixed(1)}%` : "0.0%"}
                          </span>
                        </div>
                        <div className="mt-3 flex items-baseline justify-between">
                          <p className="text-xl font-extrabold text-foreground tabular-nums">
                            {item.current_price ? Number(item.current_price).toLocaleString("vi-VN") : "--"}{" "}
                            <span className="text-xs font-normal text-muted-foreground">đ/{item.unit || "kg"}</span>
                          </p>
                          <span className="text-xs font-semibold text-primary flex items-center gap-0.5">
                            Chi tiết <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 2. Market Trade Results */}
            {(activeTab === "ALL" || activeTab === "MARKET") && marketPosts.length > 0 && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Store className="h-4 w-4 text-blue-600" /> Cơ hội Giao thương B2B ({marketPosts.length})
                  </h3>
                  <Link href="/marketplace" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                    Vào sàn giao dịch <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketPosts.map((post: any) => {
                    const isBuy = post.post_type === "BUY"
                    const img = getCommodityImage(post.title, post.commodity?.name, post.images?.[0]?.image_url)
                    return (
                      <Link
                        key={post.id}
                        href={`/marketplace/${post.id}`}
                        className="group rounded-2xl border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col"
                      >
                        <div className="relative aspect-[16/10] bg-muted w-full overflow-hidden">
                          <Image
                            src={img}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-xs", isBuy ? "bg-blue-600" : "bg-emerald-600")}>
                              {isBuy ? "CẦN MUA" : "CHÀO BÁN"}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <h4 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <div className="mt-3 pt-3 border-t flex items-center justify-between">
                            <span className="font-extrabold text-primary text-base tabular-nums">
                              {post.price ? `${Number(post.price).toLocaleString("vi-VN")} đ` : "Thỏa thuận"}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {post.location || "Toàn quốc"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 3. News Articles Results */}
            {(activeTab === "ALL" || activeTab === "NEWS") && news.length > 0 && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-amber-600" /> Tin tức & Kiến thức ({news.length})
                  </h3>
                  <Link href="/news" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                    Xem tất cả bài viết <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {news.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug || item.id}`}
                      className="group p-3.5 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all flex gap-3.5 items-center"
                    >
                      {item.thumbnail_url ? (
                        <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                          <Image
                            src={item.thumbnail_url}
                            alt={item.title}
                            fill
                            sizes="100px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-20 rounded-xl bg-muted shrink-0 flex items-center justify-center text-muted-foreground">
                          <Newspaper className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                          {item.category?.name || "Tin nông nghiệp"}
                        </span>
                        <h4 className="font-bold text-sm text-foreground line-clamp-2 mt-0.5 group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(item.created_at || Date.now()).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Shop Products Results */}
            {(activeTab === "ALL" || activeTab === "SHOP") && products.length > 0 && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-purple-600" /> Vật tư & Phân bón ({products.length})
                  </h3>
                  <Link href="/shop" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                    Vào cửa hàng vật tư <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {products.map((prod: any) => (
                    <Link
                      key={prod.id}
                      href={`/shop/${prod.id}`}
                      className="group rounded-2xl border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="relative aspect-square bg-muted w-full overflow-hidden">
                        {prod.thumbnail_url ? (
                          <Image
                            src={prod.thumbnail_url}
                            alt={prod.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <h4 className="font-bold text-xs line-clamp-2 group-hover:text-primary transition-colors">
                          {prod.name}
                        </h4>
                        <div className="mt-2 pt-2 border-t flex items-baseline justify-between">
                          <span className="font-extrabold text-primary text-sm tabular-nums">
                            {prod.price ? `${Number(prod.price).toLocaleString("vi-VN")} đ` : "Liên hệ"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </Section>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
