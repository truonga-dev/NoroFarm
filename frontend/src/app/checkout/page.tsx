"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Landmark, 
  QrCode,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast-context"
import { shopService } from "@/api/services/shop.service"
import { useCartStore } from "@/store/useCartStore"
import { PageTitle } from "@/components/layout/page-title"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const toast = useToast()
  
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()
  
  const [formData, setFormData] = React.useState({
    shipping_address: "",
    contact_phone: "",
    notes: "",
    payment_method: "COD"
  })

  const [shippingMethod, setShippingMethod] = React.useState<"standard" | "express">("standard")
  const shippingFee = shippingMethod === "standard" ? 30000 : 50000

  const createOrderMutation = useMutation({
    mutationFn: (data: any) => shopService.createOrder(data),
    onSuccess: async (res: any) => {
      const order = res.data;
      
      if (formData.payment_method === "STRIPE") {
        toast.info("Đang kết nối tới Stripe để thanh toán...");
        try {
          const stripeRes = await shopService.createStripeSession(order.id);
          const sessionUrl = stripeRes.data?.session_url;
          if (sessionUrl) {
            clearCart();
            window.location.href = sessionUrl;
          } else {
            toast.error("Không nhận được link thanh toán từ Stripe");
          }
        } catch (error) {
          toast.error("Lỗi khởi tạo cổng thanh toán Stripe");
        }
      } else {
        toast.success("Đặt hàng thành công!");
        clearCart();
        router.push(`/dashboard/orders`);
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || err.message || "Lỗi đặt hàng. Vui lòng thử lại.")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống")
      return
    }

    const payload = {
      ...formData,
      items: items.map(i => ({
        product_id: i.id,
        quantity: i.quantity
      }))
    }
    
    createOrderMutation.mutate(payload)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
        >
          <ShoppingBag className="w-10 h-10 text-primary animate-bounce" />
        </motion.div>
        <h2 className="text-2xl font-bold">Giỏ hàng trống</h2>
        <p className="text-muted-foreground">Bạn chưa chọn sản phẩm nào để mua.</p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2 shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]">
          <Link href="/shop">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-muted">
          <Link href="/shop"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <PageTitle title="Thanh toán" description="Kiểm tra giỏ hàng và điền thông tin nhận hàng." className="pb-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Cart items and forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cart items card */}
          <div className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Sản phẩm trong đơn hàng ({items.length})
            </h3>
            <div className="divide-y divide-border">
              {items.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id} 
                  className="py-4 flex gap-4 items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-muted rounded-xl shrink-0 overflow-hidden border">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-semibold uppercase bg-primary/5">
                          {item.name.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground line-clamp-1">{item.name}</h4>
                      <div className="text-primary font-bold mt-0.5">
                        {item.price.toLocaleString("vi-VN")} đ 
                        <span className="text-muted-foreground font-normal text-xs"> / {item.unit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 border rounded-lg p-1 bg-muted/30">
                      <button 
                        type="button"
                        className="h-6 w-6 rounded flex items-center justify-center hover:bg-background text-sm font-semibold transition-all"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button 
                        type="button"
                        className="h-6 w-6 rounded flex items-center justify-center hover:bg-background text-sm font-semibold transition-all disabled:opacity-50"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shipping Method Section */}
          <div className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Phương thức vận chuyển
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label 
                className={`relative flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 select-none ${
                  shippingMethod === "standard" 
                    ? "border-primary bg-primary/5 ring-1 ring-primary" 
                    : "border-border hover:bg-muted/30"
                }`}
              >
                <input 
                  type="radio" 
                  name="shipping_method" 
                  className="sr-only" 
                  checked={shippingMethod === "standard"} 
                  onChange={() => setShippingMethod("standard")} 
                />
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-primary shrink-0">
                  {shippingMethod === "standard" && <div className="w-3.5 h-3.5 rounded-full bg-primary" />}
                </div>
                <div>
                  <div className="font-semibold text-sm">Giao hàng tiêu chuẩn</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Dự kiến nhận hàng sau 2-3 ngày</div>
                </div>
                <div className="ml-auto font-bold text-sm text-primary">30.000 đ</div>
              </label>

              <label 
                className={`relative flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 select-none ${
                  shippingMethod === "express" 
                    ? "border-primary bg-primary/5 ring-1 ring-primary" 
                    : "border-border hover:bg-muted/30"
                }`}
              >
                <input 
                  type="radio" 
                  name="shipping_method" 
                  className="sr-only" 
                  checked={shippingMethod === "express"} 
                  onChange={() => setShippingMethod("express")} 
                />
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-primary shrink-0">
                  {shippingMethod === "express" && <div className="w-3.5 h-3.5 rounded-full bg-primary" />}
                </div>
                <div>
                  <div className="font-semibold text-sm">Giao hàng nhanh (Hỏa tốc)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Dự kiến nhận hàng trong ngày</div>
                </div>
                <div className="ml-auto font-bold text-sm text-primary">50.000 đ</div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Shipping Form & Order Summary */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-300 sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Thông tin nhận hàng
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Số điện thoại liên hệ *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                  </span>
                  <Input 
                    required 
                    type="tel"
                    value={formData.contact_phone} 
                    onChange={e => setFormData({...formData, contact_phone: e.target.value})} 
                    placeholder="Nhập số điện thoại nhận hàng..." 
                    className="pl-10 rounded-xl bg-muted/20 border-border focus-visible:ring-primary focus-visible:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Địa chỉ nhận hàng *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <textarea 
                    required
                    rows={3}
                    className="w-full rounded-xl border border-border bg-muted/20 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    value={formData.shipping_address} 
                    onChange={e => setFormData({...formData, shipping_address: e.target.value})} 
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ghi chú đơn hàng (Tùy chọn)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                  </span>
                  <Input 
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})} 
                    placeholder="Giao giờ hành chính, gọi trước khi giao..." 
                    className="pl-10 rounded-xl bg-muted/20 border-border focus-visible:ring-primary"
                  />
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="pt-4 border-t space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phương thức thanh toán</Label>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, payment_method: "COD"})}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 transition-all select-none text-center ${
                      formData.payment_method === "COD"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="text-xs font-semibold">COD (Nhận hàng)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({...formData, payment_method: "STRIPE"})}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 transition-all select-none text-center ${
                      formData.payment_method === "STRIPE"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="text-xs font-semibold">Thẻ Stripe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({...formData, payment_method: "BANK_TRANSFER"})}
                    className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 transition-all select-none text-center ${
                      formData.payment_method === "BANK_TRANSFER"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <Landmark className="w-5 h-5 text-primary" />
                    <span className="text-xs font-semibold">Chuyển khoản</span>
                  </button>
                </div>

                <AnimatePresence>
                  {formData.payment_method === "BANK_TRANSFER" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 bg-muted/50 border rounded-xl text-xs space-y-2 mt-2">
                        <div className="font-bold text-primary flex items-center gap-1.5">
                          <QrCode className="w-4 h-4" />
                          Thông tin chuyển khoản:
                        </div>
                        <div className="grid grid-cols-3 gap-y-1 text-muted-foreground">
                          <div>Ngân hàng:</div>
                          <div className="col-span-2 font-semibold text-foreground">MB Bank (Quân Đội)</div>
                          <div>Số tài khoản:</div>
                          <div className="col-span-2 font-bold text-foreground tracking-wider">1902 8888 9999</div>
                          <div>Chủ tài khoản:</div>
                          <div className="col-span-2 font-semibold text-foreground uppercase">CONG TY CO PHAN NOROFARM</div>
                          <div>Nội dung CK:</div>
                          <div className="col-span-2 font-bold text-primary text-[10px] truncate">NOROFARM {formData.contact_phone || "SĐT"}</div>
                        </div>
                        <div className="text-[10px] text-muted-foreground border-t pt-1.5 leading-relaxed">
                          * Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống tự động xác nhận đơn hàng của bạn.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order total info */}
              <div className="pt-4 border-t space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Tổng tiền hàng:</span>
                  <span className="font-semibold text-foreground">{getTotal().toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span className="font-semibold text-foreground">{shippingFee.toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-primary border-t pt-2.5">
                  <span>Tổng thanh toán:</span>
                  <span className="text-xl">{(getTotal() + shippingFee).toLocaleString("vi-VN")} đ</span>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] flex items-center justify-center gap-2 mt-4 font-bold"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? "Đang xử lý..." : "Đặt hàng ngay"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
