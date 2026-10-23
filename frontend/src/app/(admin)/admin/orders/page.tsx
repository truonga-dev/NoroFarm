"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Search, Eye, CheckCircle, Truck, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast-context"
import { shopService } from "@/api/services/shop.service"

const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  PENDING: { label: "Chờ xác nhận", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-50 border-blue-200", icon: CheckCircle },
  SHIPPING: { label: "Đang giao", color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: Truck },
  COMPLETED: { label: "Hoàn thành", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle }
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [viewOrder, setViewOrder] = React.useState<any>(null)
  
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["admin-orders", page, statusFilter],
    queryFn: () => shopService.adminGetOrders({ page, size: 20, status: statusFilter || undefined })
  })
  
  const orders = ordersData?.data?.items || []

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => shopService.adminUpdateOrderStatus(id, status),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công")
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
      setViewOrder(null)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Lỗi cập nhật")
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Đơn Hàng B2C</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Theo dõi và xử lý đơn đặt hàng từ hệ thống Cửa hàng.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-background p-4 rounded-xl border shadow-sm">
        <select
          className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring w-full md:w-auto"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="SHIPPING">Đang giao</option>
          <option value="COMPLETED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Mã đơn / Ngày đặt</th>
                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Tổng tiền</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Đang tải...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Không có đơn hàng nào.</td></tr>
              ) : (
                orders.map((order: any) => {
                  const statusInfo = STATUS_MAP[order.status]
                  const StatusIcon = statusInfo?.icon || Clock

                  return (
                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">#{order.id}</div>
                        <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString("vi-VN")}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.contact_phone}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{order.shipping_address}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {order.total_amount.toLocaleString("vi-VN")} đ
                        <div className="text-xs text-muted-foreground font-normal">{order.payment_method}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" /> {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => setViewOrder(order)}>
                          <Eye className="w-4 h-4 mr-2" /> Chi tiết
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!viewOrder} onOpenChange={(o) => !o && setViewOrder(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Chi tiết Đơn hàng #{viewOrder?.id}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="text-muted-foreground mb-1">Thông tin giao hàng</p>
                  <p className="font-medium">SĐT: {viewOrder.contact_phone}</p>
                  <p>{viewOrder.shipping_address}</p>
                  <p className="mt-2 text-muted-foreground">Ghi chú: <span className="text-foreground">{viewOrder.notes || "Không có"}</span></p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Thanh toán</p>
                  <p>Phương thức: <span className="font-medium">{viewOrder.payment_method}</span></p>
                  <p>Trạng thái thanh toán: <span className="font-medium">{viewOrder.payment_status}</span></p>
                  <p className="mt-2">Tổng tiền: <span className="text-lg font-bold text-primary">{viewOrder.total_amount.toLocaleString("vi-VN")} đ</span></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Sản phẩm ({viewOrder.items?.length || 0})</h3>
                <div className="border rounded-lg divide-y">
                  {viewOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between p-3">
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Cập nhật trạng thái</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={viewOrder.status === 'PENDING' ? 'default' : 'outline'} 
                    disabled={updateStatusMutation.isPending}
                    onClick={() => updateStatusMutation.mutate({ id: viewOrder.id, status: "CONFIRMED" })}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  >
                    Xác nhận đơn
                  </Button>
                  <Button 
                    variant={viewOrder.status === 'CONFIRMED' ? 'default' : 'outline'} 
                    disabled={updateStatusMutation.isPending}
                    onClick={() => updateStatusMutation.mutate({ id: viewOrder.id, status: "SHIPPING" })}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                  >
                    Giao cho ĐVVC
                  </Button>
                  <Button 
                    variant={viewOrder.status === 'SHIPPING' ? 'default' : 'outline'} 
                    disabled={updateStatusMutation.isPending}
                    onClick={() => updateStatusMutation.mutate({ id: viewOrder.id, status: "COMPLETED" })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                  >
                    Giao thành công
                  </Button>
                  <Button 
                    variant="outline"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => {
                      if (confirm("Chắc chắn hủy đơn hàng này? Hàng hóa sẽ được hoàn lại kho.")) {
                        updateStatusMutation.mutate({ id: viewOrder.id, status: "CANCELLED" })
                      }
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Hủy đơn
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
