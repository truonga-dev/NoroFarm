"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Coffee, RefreshCw, TrendingDown, TrendingUp } from "lucide-react"
import { commoditiesService } from "@/api/services/commodities.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast-context"
import { AdminDataPanel, AdminEmptyState, AdminPageHeader } from "@/features/admin/components/admin-page"

export default function AdminCoffeePage() {
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-coffee-realtime"],
    queryFn: async () => {
      const response = await commoditiesService.getRealtimePrices(100)
      return response.data || response
    },
  })

  const allItems: any[] = Array.isArray(data) ? data : data?.data || []
  const coffeeItems = allItems.filter((item) => {
    const text = `${item.name || ""} ${item.code || ""} ${item.category || ""}`.toLowerCase()
    return text.includes("cà phê") || text.includes("coffee") || text.includes("robusta") || text.includes("arabica")
  })

  const syncMutation = useMutation({
    mutationFn: () => commoditiesService.crawlLive(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-coffee-realtime"] })
      await queryClient.invalidateQueries({ queryKey: ["admin-commodities-list"] })
      toast.success("Đã đồng bộ dữ liệu thị trường")
    },
    onError: () => toast.error("Không thể đồng bộ dữ liệu lúc này"),
  })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Dữ liệu chuyên ngành"
        title="Thị trường cà phê"
        description="Theo dõi báo giá cà phê thực tế đang được lưu trong hệ thống NoroFarm."
        actions={
          <Button onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
            {syncMutation.isPending ? "Đang đồng bộ" : "Đồng bộ dữ liệu"}
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-lg" />)}
        </div>
      ) : coffeeItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coffeeItems.slice(0, 4).map((item) => {
            const change = Number(item.change_pct || 0)
            return (
              <Card key={item.id} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="truncate text-sm font-medium">{item.name}</CardTitle>
                  <Coffee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{Number(item.current_price || 0).toLocaleString("vi-VN")} <span className="text-sm font-medium text-muted-foreground">{item.currency || "VND"}</span></p>
                  <p className={`mt-1 flex items-center gap-1 text-xs ${change > 0 ? "text-emerald-600" : change < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                    {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                    {change > 0 ? "+" : ""}{change.toFixed(2)}% · {item.unit}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : null}

      <AdminDataPanel>
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold">Bảng giá cà phê hiện tại</h2>
          <p className="mt-1 text-xs text-muted-foreground">Dữ liệu lấy trực tiếp từ API giá thị trường của hệ thống.</p>
        </div>
        {isError ? (
          <AdminEmptyState title="Không thể tải dữ liệu" description="Kiểm tra kết nối backend và thử đồng bộ lại." />
        ) : !isLoading && coffeeItems.length === 0 ? (
          <AdminEmptyState title="Chưa có dữ liệu cà phê" description="Hãy đồng bộ dữ liệu hoặc thêm mặt hàng cà phê trong Bảng giá." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Mặt hàng</th>
                  <th className="px-5 py-3 font-medium">Giá hiện tại</th>
                  <th className="px-5 py-3 font-medium">Giá trước</th>
                  <th className="px-5 py-3 font-medium">Biến động</th>
                  <th className="px-5 py-3 font-medium">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {coffeeItems.map((item) => {
                  const change = Number(item.change_pct || 0)
                  return (
                    <tr key={item.id} className="hover:bg-muted/40">
                      <td className="px-5 py-4"><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.code} · {item.unit}</p></td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold">{Number(item.current_price || 0).toLocaleString("vi-VN")} {item.currency || "VND"}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{item.prev_price != null ? `${Number(item.prev_price).toLocaleString("vi-VN")} ${item.currency || "VND"}` : "—"}</td>
                      <td className={`whitespace-nowrap px-5 py-4 font-medium ${change > 0 ? "text-emerald-600" : change < 0 ? "text-red-600" : "text-muted-foreground"}`}>{change > 0 ? "+" : ""}{change.toFixed(2)}%</td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{item.updated_at ? new Date(item.updated_at).toLocaleString("vi-VN") : "—"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminDataPanel>
    </div>
  )
}
