"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Shield, Search, User, FileText, Tag, Settings,
  ChevronLeft, ChevronRight, RefreshCw, Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/api/client"
import { AdminDataPanel, AdminEmptyState, AdminPageHeader, AdminToolbar } from "@/features/admin/components/admin-page"

// Map action -> label & color
const ACTION_MAP: Record<string, { label: string; color: string }> = {
  create_banner:       { label: "Tạo Banner",       color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
  update_banner:       { label: "Sửa Banner",       color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  delete_banner:       { label: "Xóa Banner",       color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
  create_announcement: { label: "Tạo Thông báo",   color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
  ban_user:            { label: "Khóa tài khoản",  color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
  unban_user:          { label: "Mở khóa tài khoản",color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
  update_setting:      { label: "Sửa Cấu hình",    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400" },
  bulk_price_added:    { label: "Nhập giá hàng loạt", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400" },
}

const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  banner:       <FileText className="w-3.5 h-3.5" />,
  announcement: <FileText className="w-3.5 h-3.5" />,
  user:         <User className="w-3.5 h-3.5" />,
  setting:      <Settings className="w-3.5 h-3.5" />,
  commodity:    <Tag className="w-3.5 h-3.5" />,
}

export default function AdminAuditLogsPage() {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [resource, setResource] = React.useState("")
  const SIZE = 20

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-audit-logs", page, debouncedSearch, resource],
    queryFn: async () => {
      const params: Record<string, any> = { page, size: SIZE }
      if (debouncedSearch) params.action = debouncedSearch
      if (resource) params.resource = resource
      const res = await apiClient.get("/admin/audit-logs", { params })
      return res.data
    }
  })

  const logs = data?.items || []
  const total = data?.total || 0
  const pages = data?.pages || 0

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="An toàn hệ thống" title="Nhật ký hoạt động" description="Theo dõi các thay đổi quan trọng, người thực hiện và thời điểm phát sinh." actions={<>
          <span className="text-sm text-muted-foreground">
            Tổng: <span className="font-semibold text-foreground">{total}</span> bản ghi
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </>} />

      {/* Filters */}
      <AdminToolbar>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo hành động (ví dụ: ban_user, update_setting)..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={resource}
            onChange={(e) => { setResource(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Tất cả tài nguyên</option>
            <option value="banner">Banner</option>
            <option value="announcement">Thông báo</option>
            <option value="user">Người dùng</option>
            <option value="setting">Cài đặt</option>
            <option value="commodity">Nông sản</option>
          </select>
        </div>
      </AdminToolbar>

      {/* Table */}
      <AdminDataPanel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-5 py-3 whitespace-nowrap">Thời gian</th>
                <th className="px-5 py-3 whitespace-nowrap">Admin ID</th>
                <th className="px-5 py-3 whitespace-nowrap">Hành động</th>
                <th className="px-5 py-3 whitespace-nowrap">Tài nguyên</th>
                <th className="px-5 py-3 whitespace-nowrap">ID đối tượng</th>
                <th className="px-5 py-3 whitespace-nowrap">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><Skeleton className="h-5 w-full max-w-[120px]" /></td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6}><AdminEmptyState title="Chưa có nhật ký hoạt động" description="Các thao tác quản trị quan trọng sẽ được ghi nhận tại đây." /></td>
                </tr>
              ) : (
                logs.map((log: any) => {
                  const actionInfo = ACTION_MAP[log.action] || { label: log.action, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" }
                  const resourceIcon = RESOURCE_ICONS[log.resource]
                  const date = new Date(log.created_at)
                  return (
                    <tr key={log.id} className="hover:bg-muted/40 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="font-medium text-foreground">{date.toLocaleDateString("vi-VN")}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{date.toLocaleTimeString("vi-VN")}</div>
                      </td>
                      <td className="px-5 py-3">
                        {log.user_id ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                            <User className="w-3 h-3" />
                            #{log.user_id}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">System</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${actionInfo.color}`}>
                          {actionInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
                          {resourceIcon}
                          {log.resource}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {log.resource_id ? (
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
                            {log.resource_id}
                          </code>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs text-muted-foreground font-mono">{log.ip_address || "—"}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Trang <span className="font-medium text-foreground">{page}</span> / <span className="font-medium text-foreground">{pages}</span>
              &nbsp;·&nbsp; {total} bản ghi
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages || isFetching}
                className="gap-1"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </AdminDataPanel>
    </div>
  )
}
