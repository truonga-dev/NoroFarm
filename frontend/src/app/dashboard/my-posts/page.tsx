"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { marketService } from "@/api/services/market.service"
import { useAuth } from "@/hooks/useAuth"
import { CreatePostModal } from "@/components/market/create-post-modal"
import { PageTitle } from "@/components/layout/page-title"
import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, AlertCircle } from "lucide-react"

export default function MyPostsPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")

  // Check roles
  const roles = user?.roles?.map((r: any) => r.name) || []
  const canPost = roles.includes("admin") || roles.includes("seller")

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
    enabled: canPost // only fetch if they have permission
  })

  const posts = marketData?.items || []

  if (!canPost) {
    return (
      <Container className="py-8">
        <div className="p-8 max-w-2xl mx-auto text-center mt-20 bg-red-50 text-red-600 rounded-2xl border border-red-100">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Bạn chưa có quyền đăng tin</h2>
          <p className="mb-6">Tính năng này chỉ dành cho người dùng được cấp quyền Nhà cung cấp (Seller). Vui lòng liên hệ Admin để đăng ký bán nông sản trên hệ thống.</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageTitle title="Quản lý tin đăng" description="Danh sách các tin đăng mua bán của bạn." className="pb-0" />
        <CreatePostModal />
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-4 mb-6">
        <div className="w-full md:w-64">
          <label className="text-sm font-medium mb-1 block">Lọc theo trạng thái</label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">Tất cả</option>
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
          <p className="text-muted-foreground mt-2 relative z-10 max-w-sm mx-auto">Bạn chưa đăng bất kỳ tin mua bán nào. Hãy nhấn <strong className="text-foreground">Đăng tin mới</strong> để bắt đầu giao dịch với hàng ngàn người dùng khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <div key={post.id} className="bg-card rounded-2xl border p-5 shadow-sm flex flex-col relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${post.post_type === 'BUY' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
              
              <div className="flex justify-between items-start mb-3 pl-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${post.post_type === 'BUY' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                  {post.post_type === 'BUY' ? 'MUA' : 'BÁN'}
                </span>
                
                {post.status === 'PENDING' && <span className="px-2 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-700">Chờ duyệt</span>}
                {post.status === 'APPROVED' && <span className="px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700">Đã duyệt</span>}
                {post.status === 'REJECTED' && <span className="px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700">Từ chối</span>}
              </div>
              
              <h3 className="font-bold text-lg mb-2 pl-2 line-clamp-2">{post.title}</h3>
              
              <div className="flex items-center gap-1.5 text-lg font-bold text-primary mb-4 pl-2">
                {post.price.toLocaleString("vi-VN")} đ <span className="text-sm font-normal text-muted-foreground">/ {post.unit}</span>
              </div>
              
              <div className="text-sm text-muted-foreground pl-2 mt-auto">
                <p>Nông sản: <strong>{post.commodity?.name}</strong></p>
                <p>Số lượng: <strong>{post.quantity} {post.unit}</strong></p>
                <p className="mt-2 text-xs">Ngày đăng: {new Date(post.created_at).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </Container>
  )
}
