"use client"

import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from "lucide-react"

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
            <h2 className="text-xl font-bold text-foreground">Thông tin liên hệ</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Văn phòng chính</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Số 12, Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Số điện thoại liên hệ</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Hotline: 1800 6000 (Miễn phí)</p>
                  <p className="text-muted-foreground text-sm">Hỗ trợ kỹ thuật: 0988 888 999</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Hòm thư điện tử</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">info@norofarm.com</p>
                  <p className="text-muted-foreground text-sm">support@norofarm.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Thời gian làm việc</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Thứ 2 - Thứ Bảy: 08:00 - 17:30</p>
                  <p className="text-muted-foreground text-sm">Chủ Nhật: Nghỉ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Maps / Brand Badge */}
          <div className="border rounded-3xl p-6 flex items-center gap-4 bg-primary/5">
            <ShieldCheck className="w-12 h-12 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-foreground">Cam kết bảo mật & An toàn</h3>
              <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                NoroFarm cam kết bảo mật tuyệt đối thông tin cá nhân của bạn. Phản hồi sẽ được xử lý bảo mật và phản hồi trực tiếp tới hòm thư cá nhân.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
