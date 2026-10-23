"use client"

import { useState } from "react"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { marketService } from "@/api/services/market.service"
import { commodityService } from "@/api/services/commodity.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/toast-context"

export function CreatePostModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const toast = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    post_type: "SELL" as "BUY" | "SELL",
    commodity_id: "",
    price: "",
    quantity: "",
    unit: "kg",
    location: "",
    contact_phone: ""
  })

  const { data: commoditiesRes } = useQuery({
    queryKey: ["commodities-list"],
    queryFn: () => commodityService.getCommodities({ size: 100 })
  })
  
  const commodities = commoditiesRes?.data?.items || commoditiesRes?.data || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await marketService.createPost({
        ...formData,
        commodity_id: Number(formData.commodity_id),
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      })
      queryClient.invalidateQueries({ queryKey: ["my-market-posts"] })
      setOpen(false)
      setFormData({
        title: "", description: "", post_type: "SELL", commodity_id: "",
        price: "", quantity: "", unit: "kg", location: "", contact_phone: ""
      })
      toast.success("Đăng tin thành công! Tin của bạn đang chờ duyệt.")
    } catch (error: any) {
      toast.error("Lỗi đăng tin: " + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0 font-semibold" onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Đăng tin mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đăng tin Mua/Bán mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại tin</label>
              <select
                required
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.post_type}
                onChange={e => setFormData({...formData, post_type: e.target.value as "BUY" | "SELL"})}
              >
                <option value="SELL">Cần Bán</option>
                <option value="BUY">Cần Mua</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nông sản</label>
              <select
                required
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.commodity_id}
                onChange={e => setFormData({...formData, commodity_id: e.target.value})}
              >
                <option value="">-- Chọn nông sản --</option>
                {commodities.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tiêu đề tin đăng</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="VD: Cần bán 5 tấn thanh long ruột đỏ..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mức giá</label>
              <Input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="VD: 15000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số lượng</label>
              <Input required type="number" min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="VD: 500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Đơn vị</label>
              <Input required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="VD: kg, tấn..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa điểm giao dịch</label>
              <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="VD: Bình Thuận" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SĐT Liên hệ</label>
              <Input required value={formData.contact_phone} onChange={e => setFormData({...formData, contact_phone: e.target.value})} placeholder="VD: 0912345678" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nội dung chi tiết</label>
            <textarea
              required
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Mô tả chi tiết về sản phẩm, yêu cầu vận chuyển, phương thức thanh toán..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Đăng tin ngay
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
