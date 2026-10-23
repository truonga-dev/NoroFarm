"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { newsService } from "@/api/services/news.service"
import { useToast } from "@/components/ui/toast-context"

export default function AdminNewsPage() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-news-list", page, search],
    queryFn: async () => {
      const res = await newsService.getArticles({ size: 20, page, search })
      return res.data || res
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => newsService.deleteArticle(id),
    onSuccess: () => {
      toast.success("Đã xóa bài viết")
      queryClient.invalidateQueries({ queryKey: ["admin-news-list"] })
    },
    onError: () => {
      toast.error("Lỗi khi xóa bài viết")
    }
  })

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      deleteMutation.mutate(id)
    }
  }

  const items = data?.items || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Tin tức</h1>
          <p className="text-muted-foreground mt-1">Danh sách các bài báo, kiến thức nông nghiệp.</p>
        </div>
        <Link href="/admin/news/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Viết bài mới
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-2xl p-4 shadow-sm">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="Tìm kiếm tiêu đề bài viết..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Tiêu đề</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Lượt xem</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Ngày đăng</th>
                <th className="px-4 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-full max-w-[300px]" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><Skeleton className="h-5 w-12" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-4 py-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
                  </td>
                </tr>
              ) : (
                items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium line-clamp-1">{item.title}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{item.view_count || 0}</td>
                    <td className="px-4 py-3">
                      {item.is_published ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">Đã xuất bản</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">Bản nháp</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString("vi-VN") : "--"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link href={`/admin/news/${item.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
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
