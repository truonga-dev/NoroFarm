"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Eye, CheckCircle, Truck, XCircle, Clock, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast-context"
import { shopService } from "@/api/services/shop.service"
import { PageTitle } from "@/components/layout/page-title"
import { Container } from "@/components/layout/container"

const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  PENDING: { label: "Chờ xác nhận", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-50 border-blue-200", icon: CheckCircle },
  SHIPPING: { label: "Đang giao", color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: Truck },
  COMPLETED: { label: "Hoàn thành", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle }
}

export default function MyOrdersPage() {
  const [page, setPage] = React.useState(1)
  const [viewOrder, setViewOrder] = React.useState<any>(null)
  
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["my-orders", page],
    queryFn: () => shopService.getMyOrders({ page, size: 20 })
  })
  
  const orders = ordersData?.data?.items || []

  const cancelMutation = useMutation({
    mutationFn: (id: number) => shopService.cancelOrder(id),
    onSuccess: () => {
      toast.success("Hủy đơn hàng thành công")
      queryClient.invalidateQueries({ queryKey: ["my-orders"] })
      setViewOrder(null)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Không thể hủy đơn hàng này")
    }
  })

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <PageTitle title="Đơn Hàng Của Tôi" description="Quản lý lịch sử mua sắm nông sản trên NoroFarm." />

      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Mã đơn / Ngày đặt</th>
                <th className="px-6 py-4 whitespace-nowrap">Sản phẩm</th>
                <th className="px-6 py-4 whitespace-nowrap">Tổng tiền</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <>
                  {[1,2,3,4,5].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-muted rounded mb-2" /><div className="h-3 w-24 bg-muted rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-40 bg-muted rounded mb-2" /><div className="h-3 w-32 bg-muted rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-muted rounded" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-24 bg-muted rounded-full" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 w-24 bg-muted rounded inline-block" /></td>
                    </tr>
                  ))}
                </>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground bg-card/30">
                    <Package className="w-16 h-16 mx-auto mb-4 text-primary/40 drop-shadow-sm" />
                    <h3 className="text-xl font-bold text-foreground">Chưa có đơn hàng nào</h3>
                    <p className="mt-2 max-w-sm mx-auto">Bạn chưa mua sắm sản phẩm nông sản nào trên hệ thống. Hãy truy cập <strong className="text-foreground">Cửa Hàng</strong> để khám phá.</p>
                  </td>
                </tr>
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
                        <div className="font-medium">{order.items?.[0]?.product?.name || "Sản phẩm"}</div>
                        {order.items?.length > 1 && (
                          <div className="text-xs text-muted-foreground">và {order.items.length - 1} sản phẩm khác...</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {order.total_amount.toLocaleString("vi-VN")} đ
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Chi tiết Đơn hàng #{viewOrder?.id}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-6 pt-4">
              <div className="bg-muted/30 p-4 rounded-lg text-sm">
                <p className="font-semibold mb-2">Trạng thái: <span className={STATUS_MAP[viewOrder.status]?.color + " px-2 py-0.5 rounded border ml-1"}>{STATUS_MAP[viewOrder.status]?.label}</span></p>
                <p>Ngày đặt: {new Date(viewOrder.created_at).toLocaleString("vi-VN")}</p>
                <p className="mt-2">Giao đến: <strong>{viewOrder.shipping_address}</strong> (SĐT: {viewOrder.contact_phone})</p>
                <p>Thanh toán: <strong>{viewOrder.payment_method}</strong> ({viewOrder.payment_status})</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Sản phẩm đã đặt</h3>
                <div className="border rounded-lg divide-y">
                  {viewOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-3">
                      <div className="w-16 h-16 bg-muted rounded-md shrink-0">
                        {item.product?.image_url && <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover rounded-md" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">{item.price.toLocaleString("vi-VN")} đ x {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 text-lg font-bold">
                  <span>Tổng thanh toán:</span>
                  <span className="text-primary">{viewOrder.total_amount.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>

              {viewOrder.status === 'PENDING' && (
                <div className="border-t pt-4 flex justify-end">
                  <Button 
                    variant="destructive"
                    disabled={cancelMutation.isPending}
                    onClick={() => {
                      if (confirm("Bạn có chắc muốn hủy đơn hàng này không?")) {
                        cancelMutation.mutate(viewOrder.id)
                      }
                    }}
                  >
                    Hủy đơn hàng này
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </Container>
  )
}
