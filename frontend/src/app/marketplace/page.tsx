"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { PageTitle } from "@/components/layout/page-title"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { marketService } from "@/api/services/market.service"
import { commodityService } from "@/api/services/commodity.service"
import { Search, MapPin, Phone, User, ShoppingCart, Tag, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function MarketplacePage() {
  const [search, setSearch] = useState("")
  const [postType, setPostType] = useState<"BUY" | "SELL" | "">("")
  const [commodityId, setCommodityId] = useState<number | "">("")
  const [page, setPage] = useState(1)

  const { data: commoditiesRes } = useQuery({
    queryKey: ["commodities-list"],
    queryFn: () => commodityService.getCommodities({ size: 100 })
  })
  
  const commodities = commoditiesRes?.data?.items || commoditiesRes?.data || []

  const { data: marketData, isLoading } = useQuery({
    queryKey: ["market-posts", page, postType, commodityId, search],
    queryFn: async () => {
      const res = await marketService.getPosts({
        page,
        size: 12,
        post_type: postType || undefined,
        commodity_id: commodityId ? Number(commodityId) : undefined,
        search: search || undefined
      })
      return res.data
    }
  })

  const posts = marketData?.items || []

  return (
    <PageTransition>
      <Section className="py-8">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <PageTitle
              title="Sàn Giao Dịch"
              description="Nơi kết nối mua bán nông sản trực tiếp giữa người nông dân và thương lái."
              className="pt-0 pb-0 md:pb-0 md:pt-0"
            />
            <Button className="shrink-0 font-semibold" size="lg" asChild>
              <Link href="/dashboard/my-posts">
                <PlusCircle className="mr-2 h-5 w-5" /> Đăng tin mới
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-card p-4 rounded-2xl border shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm tin đăng..." 
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={postType}
                onChange={(e) => { setPostType(e.target.value as any); setPage(1); }}
              >
                <option value="">Tất cả loại tin</option>
                <option value="BUY">Cần mua</option>
                <option value="SELL">Cần bán</option>
              </select>
            </div>
            <div>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={commodityId}
                onChange={(e) => { setCommodityId(e.target.value ? Number(e.target.value) : ""); setPage(1); }}
              >
                <option value="">Tất cả nông sản</option>
                {commodities.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Không tìm thấy tin đăng nào</h3>
              <p className="text-muted-foreground mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <div key={post.id} className="bg-card rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${post.post_type === 'BUY' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                  
                  <div className="flex justify-between items-start mb-3 pl-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${post.post_type === 'BUY' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                      {post.post_type === 'BUY' ? 'CẦN MUA' : 'CẦN BÁN'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 pl-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xl font-bold text-primary mb-4 pl-2">
                    {post.price.toLocaleString("vi-VN")} đ <span className="text-sm font-normal text-muted-foreground">/ {post.unit}</span>
                  </div>
                  
                  <div className="space-y-2 mt-auto text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 shrink-0" />
                      <span className="truncate font-medium">{post.commodity?.name || "Nông sản"} • Số lượng: {post.quantity} {post.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{post.location || "Chưa cập nhật vị trí"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 shrink-0" />
                      <span className="truncate">{post.user?.profile?.full_name || "Người dùng ẩn danh"}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-foreground pt-2 mt-2 border-t">
                      <Phone className="w-4 h-4 shrink-0 text-primary" />
                      <span>{post.contact_phone || post.user?.profile?.phone_number || "Không có số ĐT"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
