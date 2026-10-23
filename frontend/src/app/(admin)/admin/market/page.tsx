"use client"

import * as React from "react"
import { Search, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast-context"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { marketService } from "@/api/services/market.service"
import { CreatePostModal } from "@/components/market/create-post-modal"

export default function AdminMarketPage() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [statusFilter, setStatusFilter] = React.useState("PENDING")
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data: marketData, isLoading } = useQuery({
    queryKey: ["admin-market-posts", page, statusFilter, search],
    queryFn: async () => {
      const res = await marketService.adminGetPosts({
        page,
        size: 20,
        search: search || undefined,
        status: statusFilter || undefined
      })
      return res.data
    }
  })

  const posts = marketData?.items || []

  const moderateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await marketService.moderatePost(id, status)
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-market-posts"] })
      toast.success(`Đã thay đổi trạng thái thành ${data.status}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi.")
    }
  })

  const handleModerate = (id: number, newStatus: string) => {
    moderateMutation.mutate({ id, status: newStatus })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Duyệt Tin Đăng Sàn Giao Dịch</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản lý và kiểm duyệt các tin Mua/Bán nông sản từ Nông dân & Thương lái.
          </p>
        </div>
        <div className="flex gap-2">
          <CreatePostModal />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-background p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm theo tiêu đề..." 
            className="pl-9 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
        </select>
      </div>

      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Người đăng</th>
                <th className="px-6 py-4 whitespace-nowrap">Loại tin / Nông sản</th>
                <th className="px-6 py-4 whitespace-nowrap">Chi tiết (Giá / SL)</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Đang tải dữ liệu...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Không tìm thấy tin đăng nào.</td></tr>
              ) : (
                posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{post.user?.profile?.full_name || 'Khách'}</div>
                      <div className="text-xs text-muted-foreground">{post.contact_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit px-2 py-0.5 rounded text-xs font-bold ${post.post_type === 'BUY' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {post.post_type === 'BUY' ? 'CẦN MUA' : 'CẦN BÁN'}
                        </span>
                        <span className="font-medium">{post.commodity?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-primary">{post.price.toLocaleString("vi-VN")} đ</div>
                      <div className="text-xs text-muted-foreground">Số lượng: {post.quantity} {post.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      {post.status === 'PENDING' && <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-medium border border-yellow-200">Chờ duyệt</span>}
                      {post.status === 'APPROVED' && <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium border border-emerald-200">Đã duyệt</span>}
                      {post.status === 'REJECTED' && <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-200">Từ chối</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.status !== 'APPROVED' && (
                          <Button size="sm" variant="outline" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleModerate(post.id, "APPROVED")} disabled={moderateMutation.isPending}>
                            <CheckCircle className="w-4 h-4 mr-1" /> Duyệt
                          </Button>
                        )}
                        {post.status !== 'REJECTED' && (
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleModerate(post.id, "REJECTED")} disabled={moderateMutation.isPending}>
                            <XCircle className="w-4 h-4 mr-1" /> Từ chối
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
