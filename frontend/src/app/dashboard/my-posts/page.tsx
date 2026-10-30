"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { marketService } from "@/api/services/market.service"
import { CreatePostModal } from "@/components/market/create-post-modal"
import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Sidebar } from "@/components/layout/sidebar"
import { PageTitle } from "@/components/layout/page-title"
import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-context"
import { ShoppingCart, Trash2, MapPin, Phone } from "lucide-react"

export default function MyPostsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")

  const { data: marketData, isLoading } = useQuery({
    queryKey: ["my-market-posts", page, statusFilter],
    queryFn: async () => {
      const res = await marketService.getMyPosts({
        page,
        size: 20,
        status: statusFilter || undefined
      })
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => marketService.deletePost(postId),
    onSuccess: () => {
      toast.success("Đã xóa tin đăng thành công")
      queryClient.invalidateQueries({ queryKey: ["my-market-posts"] })
    },
    onError: () => {
      toast.error("Không thể xóa tin đăng này")
    }
  })

  const posts = marketData?.items || []

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-muted/20 md:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Section className="py-6 md:py-8 lg:py-10">
            <Container>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <PageTitle
                    title="Quản lý tin đăng B2B"
                    description="Danh sách các tin đăng thu mua và chào bán nông sản của bạn."
                    className="pt-0 pb-0"
                  />
                  <CreatePostModal />
                </div>

                <div className="bg-card rounded-2xl border shadow-sm p-4">
                  <div className="w-full md:w-64">
                    <label className="text-sm font-medium mb-1 block">Lọc theo trạng thái</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="PENDING">Chờ duyệt</option>
                      <option value="APPROVED">Đã duyệt (Đang hiển thị)</option>
                      <option value="REJECTED">Bị từ chối</option>
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="bg-card rounded-2xl border p-5 shadow-sm flex flex-col gap-3 animate-pulse">
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-6 w-16 bg-muted rounded-md" />
                          <div className="h-6 w-20 bg-muted rounded-md" />
                        </div>
                        <div className="h-6 w-3/4 bg-muted rounded-md mb-2" />
                        <div className="h-8 w-1/2 bg-muted rounded-md mb-4" />
                        <div className="space-y-2 mt-auto">
                          <div className="h-4 w-full bg-muted rounded-md" />
                          <div className="h-4 w-5/6 bg-muted rounded-md" />
                          <div className="h-3 w-1/2 bg-muted rounded-md mt-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-24 bg-card/50 rounded-2xl border border-dashed border-muted-foreground/20 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
                    <ShoppingCart className="w-16 h-16 text-primary/40 mx-auto mb-4 relative z-10 drop-shadow-sm" />
                    <h3 className="text-xl font-bold relative z-10 text-foreground">Chưa có tin đăng nào</h3>
                    <p className="text-muted-foreground mt-2 relative z-10 max-w-sm mx-auto">
                      Bạn chưa đăng bất kỳ tin mua bán nào. Hãy nhấn <strong className="text-foreground">Đăng tin mới</strong> để bắt đầu giao dịch với các thương lái và hợp tác xã.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post: any) => (
                      <div key={post.id} className="bg-card rounded-2xl border p-5 shadow-sm flex flex-col relative overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${post.post_type === 'BUY' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                        
                        <div className="flex justify-between items-start mb-3 pl-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${post.post_type === 'BUY' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                              {post.post_type === 'BUY' ? 'CẦN MUA' : 'CHÀO BÁN'}
                            </span>
                            {post.status === 'PENDING' && <span className="px-2 py-1 text-xs font-medium rounded-md bg-yellow-500/10 text-yellow-600">Chờ duyệt</span>}
                            {post.status === 'APPROVED' && <span className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-500/10 text-emerald-600">Đang hiển thị</span>}
                            {post.status === 'REJECTED' && <span className="px-2 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-600">Từ chối</span>}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            title="Xóa tin đăng"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => deleteMutation.mutate(post.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <h3 className="font-bold text-lg mb-2 pl-2 line-clamp-2">{post.title}</h3>
                        
                        <div className="flex items-center gap-1.5 text-lg font-bold text-primary mb-4 pl-2">
                          {Number(post.price || 0).toLocaleString("vi-VN")} đ <span className="text-sm font-normal text-muted-foreground">/ {post.unit}</span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground pl-2 mt-auto space-y-1">
                          <p>Nông sản: <strong className="text-foreground">{post.commodity?.name || "Nông sản"}</strong></p>
                          <p>Sản lượng: <strong className="text-foreground">{post.quantity} {post.unit}</strong></p>
                          {post.location && (
                            <p className="flex items-center gap-1 text-xs pt-1">
                              <MapPin className="w-3.5 h-3.5 text-primary" /> {post.location}
                            </p>
                          )}
                          {post.contact_phone && (
                            <p className="flex items-center gap-1 text-xs">
                              <Phone className="w-3.5 h-3.5 text-primary" /> {post.contact_phone}
                            </p>
                          )}
                          <p className="pt-2 text-xs border-t border-border/50 mt-2">
                            Ngày đăng: {new Date(post.created_at).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Container>
          </Section>
        </main>
      </div>
    </PageTransition>
  )
}
