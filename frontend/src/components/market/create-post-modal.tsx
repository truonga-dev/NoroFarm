"use client"

import { useState, type FormEvent } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, PlusCircle, ShieldAlert } from "lucide-react"

import { marketService } from "@/api/services/market.service"
import { commodityService } from "@/api/services/commodity.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast-context"

type PostForm = {
  title: string
  description: string
  post_type: "BUY" | "SELL"
  commodity_id: string
  price: string
  quantity: string
  unit: string
  location: string
  contact_phone: string
}
type Commodity = { id: number; name: string }

const initialForm: PostForm = {
  title: "",
  description: "",
  post_type: "SELL",
  commodity_id: "",
  price: "",
  quantity: "",
  unit: "kg",
  location: "",
  contact_phone: "",
}
const formatNumber = new Intl.NumberFormat("vi-VN")
const inputClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"

export function CreatePostModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PostForm>(initialForm)
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: commoditiesResponse, isError: commoditiesError, refetch: refetchCommodities } = useQuery({
    queryKey: ["commodities-list"],
    queryFn: () => commodityService.getCommodities({ size: 100 }),
  })
  const rawCommodities = commoditiesResponse?.data?.items || commoditiesResponse?.data || []
  const commodities: Commodity[] = Array.isArray(rawCommodities) ? rawCommodities : []
  const commodityName = commodities.find((item) => String(item.id) === formData.commodity_id)?.name || "Chưa chọn mặt hàng"
  const price = Number(formData.price)
  const quantity = Number(formData.quantity)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData.commodity_id || !formData.title.trim() || !formData.description.trim() || !formData.unit.trim() || !formData.location.trim() || !formData.contact_phone.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin tin đăng.")
      return
    }
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(quantity) || quantity <= 0) {
      toast.error("Giá chào và số lượng phải lớn hơn 0.")
      return
    }

    setLoading(true)
    try {
      await marketService.createPost({
        title: formData.title.trim(),
        description: formData.description.trim(),
        post_type: formData.post_type,
        commodity_id: Number(formData.commodity_id),
        price,
        quantity,
        unit: formData.unit.trim(),
        location: formData.location.trim(),
        contact_phone: formData.contact_phone.trim(),
      })
      void queryClient.invalidateQueries({ queryKey: ["my-market-posts"] })
      setOpen(false)
      setFormData(initialForm)
      toast.success("Đăng tin thành công. Tin của bạn đang chờ duyệt.")
    } catch (error) {
      toast.error(`Không thể đăng tin: ${error instanceof Error ? error.message : "Vui lòng thử lại."}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!loading) setOpen(nextOpen) }}>
      <DialogTrigger asChild><Button className="shrink-0 font-semibold"><PlusCircle aria-hidden="true" /> Đăng tin mới</Button></DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Đăng tin mua hoặc bán</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Điền thông tin rõ ràng để đối tác đánh giá cơ hội giao dịch. Tin được kiểm duyệt trước khi xuất hiện trên sàn.</p>

        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.8fr)]">
          <form id="market-post-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="post-type" className="text-sm font-medium">Loại tin</label>
                <select id="post-type" required className={inputClass} value={formData.post_type} onChange={(event) => setFormData({ ...formData, post_type: event.target.value as PostForm["post_type"] })}>
                  <option value="SELL">Cần bán</option><option value="BUY">Cần mua</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="post-commodity" className="text-sm font-medium">Mặt hàng</label>
                <select id="post-commodity" required className={inputClass} value={formData.commodity_id} onChange={(event) => setFormData({ ...formData, commodity_id: event.target.value })}>
                  <option value="">Chọn mặt hàng</option>
                  {commodities.map((commodity) => <option key={commodity.id} value={commodity.id}>{commodity.name}</option>)}
                </select>
                {commoditiesError && <p className="text-xs text-destructive">Chưa tải được danh mục. <button type="button" className="underline" onClick={() => refetchCommodities()}>Thử lại</button></p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="post-title" className="text-sm font-medium">Tiêu đề</label>
              <Input id="post-title" required maxLength={255} value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} placeholder="Ví dụ: Cần bán 5 tấn thanh long ruột đỏ" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2"><label htmlFor="post-price" className="text-sm font-medium">Giá chào (₫)</label><Input id="post-price" required type="number" min="1" step="1" value={formData.price} onChange={(event) => setFormData({ ...formData, price: event.target.value })} placeholder="15000" /></div>
              <div className="space-y-2"><label htmlFor="post-quantity" className="text-sm font-medium">Số lượng</label><Input id="post-quantity" required type="number" min="0.001" step="any" value={formData.quantity} onChange={(event) => setFormData({ ...formData, quantity: event.target.value })} placeholder="500" /></div>
              <div className="space-y-2"><label htmlFor="post-unit" className="text-sm font-medium">Đơn vị</label><Input id="post-unit" required maxLength={50} value={formData.unit} onChange={(event) => setFormData({ ...formData, unit: event.target.value })} placeholder="kg, tấn..." /></div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><label htmlFor="post-location" className="text-sm font-medium">Khu vực giao dịch</label><Input id="post-location" required maxLength={255} value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} placeholder="Ví dụ: Bình Thuận" /></div>
              <div className="space-y-2"><label htmlFor="post-phone" className="text-sm font-medium">Số điện thoại liên hệ</label><Input id="post-phone" required type="tel" maxLength={20} value={formData.contact_phone} onChange={(event) => setFormData({ ...formData, contact_phone: event.target.value })} placeholder="0912345678" aria-describedby="post-phone-note" /><p id="post-phone-note" className="text-xs text-muted-foreground">Số này sẽ hiển thị trên tin sau khi được duyệt.</p></div>
            </div>

            <div className="space-y-2">
              <label htmlFor="post-description" className="text-sm font-medium">Mô tả chi tiết</label>
              <textarea id="post-description" required rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} placeholder="Nêu tình trạng hàng, yêu cầu giao nhận và thông tin cần xác nhận..." />
            </div>
            <Button type="submit" className="w-full" disabled={loading || commodities.length === 0}>{loading && <Loader2 className="animate-spin" aria-hidden="true" />}{loading ? "Đang gửi tin…" : "Gửi tin để kiểm duyệt"}</Button>
          </form>

          <aside className="self-start rounded-2xl border bg-muted/40 p-5 lg:sticky lg:top-0" aria-label="Xem trước tin đăng">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Xem trước nội dung công khai</p>
            <span className="mt-5 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{formData.post_type === "BUY" ? "CẦN MUA" : "CẦN BÁN"}</span>
            <p className="mt-4 text-sm text-muted-foreground">{commodityName}</p>
            <h3 className="mt-1 break-words text-lg font-bold">{formData.title.trim() || "Tiêu đề tin đăng"}</h3>
            <p className="mt-4 text-2xl font-bold text-primary">{price > 0 ? formatNumber.format(price) : "—"} ₫ <span className="text-sm font-medium text-muted-foreground">/ {formData.unit.trim() || "đơn vị"}</span></p>
            <div className="mt-4 space-y-1 border-t pt-4 text-sm"><p><span className="text-muted-foreground">Số lượng: </span>{quantity > 0 ? formatNumber.format(quantity) : "—"} {formData.unit}</p><p><span className="text-muted-foreground">Khu vực: </span>{formData.location.trim() || "Chưa nhập"}</p><p><span className="text-muted-foreground">Liên hệ: </span>{formData.contact_phone.trim() || "Chưa nhập"}</p></div>
            <p className="mt-4 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">{formData.description.trim() || "Mô tả chi tiết sẽ xuất hiện ở đây."}</p>
            <div className="mt-5 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-5 text-muted-foreground"><ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" /><span>Chỉ đăng thông tin bạn đồng ý chia sẻ. Duyệt tin không phải xác minh hàng hóa hoặc bảo đảm giao dịch.</span></div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  )
}
