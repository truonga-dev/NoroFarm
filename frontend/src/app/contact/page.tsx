"use client"

import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast-context"
import { contactService } from "@/api/services/contact.service"
import { PageTitle } from "@/components/layout/page-title"
import { Container } from "@/components/layout/container"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  
  const toast = useToast()

  const submitMutation = useMutation({
    mutationFn: contactService.createContact,
    onSuccess: () => {
      toast.success("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi qua email của bạn sớm nhất.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      })
    },
    onError: (err: any) => {
      toast.error(err.message || "Không thể gửi liên hệ. Vui lòng kiểm tra lại thông tin.")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Vui lòng điền đầy đủ các trường thông tin bắt buộc!")
      return
    }
    submitMutation.mutate(formData)
  }

  return (
    <Container className="py-10 max-w-7xl mx-auto pb-20">
      <PageTitle 
        title="Liên Hệ Với Chúng Tôi" 
        description="NoroFarm luôn sẵn sàng lắng nghe mọi ý kiến đóng góp, phản hồi và câu hỏi từ quý khách hàng."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-background border rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Gửi tin nhắn phản hồi
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="name@example.com"
                  required
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Số điện thoại <span className="text-muted-foreground text-xs">(Không bắt buộc)</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Ví dụ: 0912345678"
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-semibold">
                  Tiêu đề <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Hỏi về sản phẩm, hợp tác..."
                  required
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold">
                Nội dung tin nhắn <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Nhập nội dung bạn muốn gửi tới NoroFarm..."
                required
                rows={5}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <Button 
              type="submit" 
              disabled={submitMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl shadow-md transition-all mt-2"
            >
              {submitMutation.isPending ? "Đang gửi đi..." : "Gửi thông tin liên hệ"}
            </Button>
          </form>
        </div>

        {/* Right: Contact info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Info cards */}
          <div className="bg-muted/30 border rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Thông tin liên hệ chính thức</h2>
            
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Trụ sở điều hành & Kho vận</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Xã Đăk Long, Tỉnh Quảng Ngãi</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=14.888946,107.624798"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-1.5"
                  >
                    Xem vị trí trên Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Tổng đài hỗ trợ</h4>
                  <p className="text-foreground text-base font-bold mt-0.5">1900 1234 56</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Đường dây nóng kỹ thuật: 0988 888 999</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Hòm thư điện tử</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">support@norofarm.vn</p>
                  <p className="text-muted-foreground text-sm">contact@norofarm.vn</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Thời gian làm việc</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Thứ 2 - Thứ Bảy: 08:00 - 17:30</p>
                  <p className="text-muted-foreground text-xs">Chủ Nhật: Trực hotline hỗ trợ 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Maps Preview Card */}
          <div className="border rounded-3xl p-6 bg-gradient-to-br from-primary/10 via-muted/60 to-emerald-500/10 flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-primary shadow-xs">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-bold text-foreground text-sm">Chỉ đường tới NoroFarm</h4>
                <p className="text-xs text-muted-foreground">Tọa độ: 14.888946, 107.624798 (Quảng Ngãi / Kon Tum)</p>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=14.888946,107.624798"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-background px-4 py-2.5 text-xs font-semibold text-primary shadow-xs hover:bg-background/90 transition-all border"
            >
              Mở chỉ đường trên Google Maps <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Privacy & Safety Badge */}
          <div className="border rounded-3xl p-5 flex items-center gap-4 bg-card shadow-xs">
            <ShieldCheck className="w-10 h-10 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-foreground">Cam kết bảo mật & An toàn</h3>
              <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">
                NoroFarm cam kết bảo mật tuyệt đối thông tin cá nhân. Đội ngũ CSKH sẽ phản hồi qua email hoặc hotline trong vòng 24 giờ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
