"use client"

import * as React from "react"
import { Search, CheckCircle, XCircle, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast-context"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { marketService } from "@/api/services/market.service"
import { commodityService } from "@/api/services/commodity.service"
import { CreatePostModal } from "@/components/market/create-post-modal"
import { AdminDataPanel, AdminEmptyState, AdminPageHeader, AdminToolbar } from "@/features/admin/components/admin-page"

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

  const { data: commoditiesRes } = useQuery({
    queryKey: ["admin-market-commodities-ref"],
    queryFn: () => commodityService.getCommodities({ size: 100 })
  })
  const commoditiesList: any[] = commoditiesRes?.data?.items || []

  const getReferencePrice = (post: any): number => {
    const found = commoditiesList.find(
      (c: any) => c.id === post.commodity_id || c.name === post.commodity?.name
    )
    return Number(found?.current_price || 0)
  }

  const handleBulkApprove = async () => {
    const pendingPosts = posts.filter((p: any) => p.status === "PENDING")
    if (!pendingPosts.length) {
      toast.info("Không có tin đăng chờ duyệt nào trên trang này.")
      return
    }
    try {
      await Promise.all(pendingPosts.map((p: any) => marketService.moderatePost(p.id, "APPROVED")))
      queryClient.invalidateQueries({ queryKey: ["admin-market-posts"] })
      toast.success(`Đã duyệt nhanh ${pendingPosts.length} tin đăng!`)
    } catch {
      toast.error("Có lỗi khi duyệt hàng loạt.")
    }
  }

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
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Giao dịch B2B" title="Duyệt tin đăng" description="Kiểm duyệt các nhu cầu mua và chào bán nông sản từ thành viên." actions={<>
          {posts.some((p: any) => p.status === "PENDING") && (
            <Button variant="outline" onClick={handleBulkApprove} className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
              <CheckCheck className="w-4 h-4" />
              Duyệt tất cả trang này
            </Button>
          )}
          <CreatePostModal />
        </>} />

      <AdminToolbar>
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm theo tiêu đề..." 
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring md:w-auto"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
        </select>
        <p className="text-sm text-muted-foreground md:ml-auto">{posts.length} tin đăng</p>
      </AdminToolbar>

      <AdminDataPanel>
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
                <tr><td colSpan={5}><AdminEmptyState title="Không có tin đăng phù hợp" description="Thử thay đổi từ khóa hoặc trạng thái kiểm duyệt." /></td></tr>
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
                      {(() => {
                        const refPrice = getReferencePrice(post)
                        if (refPrice <= 0) return null
                        const diffPct = ((Number(post.price) - refPrice) / refPrice) * 100
                        const isAbnormal = Math.abs(diffPct) > 15
                        return (
                          <div className={`text-[11px] font-medium mt-1 ${isAbnormal ? "text-amber-600" : "text-emerald-600"}`}>
                            Giá TT 2026: {refPrice.toLocaleString("vi-VN")} đ ({diffPct >= 0 ? "+" : ""}{diffPct.toFixed(1)}%)
                          </div>
                        )
                      })()}
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
      </AdminDataPanel>
    </div>
  )
}
