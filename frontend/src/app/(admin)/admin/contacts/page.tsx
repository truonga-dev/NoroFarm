"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  CornerDownRight, 
  Send, 
  Clock, 
  User, 
  Search, 
  Phone, 
  ExternalLink, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Edit3
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast-context"
import { contactService } from "@/api/services/contact.service"
import { AdminDataPanel, AdminEmptyState, AdminPageHeader, AdminToolbar } from "@/features/admin/components/admin-page"

const REPLY_TEMPLATES = [
  {
    label: "Tiếp nhận & Cử chuyên viên",
    content: "Kính gửi quý khách,\n\nNoroFarm đã tiếp nhận thông tin yêu cầu của bạn. Đội ngũ chuyên viên tư vấn của chúng tôi sẽ liên hệ lại trực tiếp qua số điện thoại hoặc email này trong vòng 24 giờ tới.\n\nTrân trọng cảm ơn sự tin tưởng của bạn dành cho NoroFarm!"
  },
  {
    label: "Báo giá nông sản & Vật tư",
    content: "Kính gửi quý khách,\n\nCảm ơn bạn đã quan tâm đến danh mục sản phẩm của NoroFarm. Chúng tôi xin gửi thông tin bảng giá thu mua/cung ứng cập nhật mới nhất theo tiêu chuẩn VietGAP/GlobalGAP. Chuyên viên kinh doanh sẽ gửi file báo giá chi tiết đính kèm qua email trong ít phút.\n\nTrân trọng!"
  },
  {
    label: "Tư vấn kỹ thuật canh tác",
    content: "Kính gửi quý bà con/quý đối tác,\n\nKỹ sư nông nghiệp của NoroFarm đã xem xét thắc mắc kỹ thuật của bạn. Để xử lý hiệu quả nhất cho vườn canh tác, chúng tôi khuyến nghị áp dụng quy trình vi sinh hữu cơ kết hợp theo dõi độ ẩm đất và dự báo thời tiết tại khu vực.\n\nNếu cần hỗ trợ khẩn cấp, vui lòng gọi hotline 1900 1234 56 để gặp trực tiếp chuyên gia."
  }
]

export default function AdminContactsPage() {
  const [filterReplied, setFilterReplied] = React.useState<string>("") // "", "true", "false"
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [page, setPage] = React.useState(1)
  const [activeReply, setActiveReply] = React.useState<any>(null)
  const [replyText, setReplyText] = React.useState("")
  const [isEditingReply, setIsEditingReply] = React.useState(false)

  const queryClient = useQueryClient()
  const toast = useToast()

  const isRepliedParam = filterReplied === "true" ? true : filterReplied === "false" ? false : undefined

  const { data: contactsData, isLoading, refetch } = useQuery({
    queryKey: ["admin-contacts", page, filterReplied],
    queryFn: () => contactService.adminGetContacts({ 
      page, 
      size: 20, 
      is_replied: isRepliedParam 
    })
  })

  const rawContacts = React.useMemo(() => contactsData?.data?.items || [], [contactsData])
  const totalPages = contactsData?.data?.pages || 1
  const totalItems = contactsData?.data?.total || rawContacts.length

  // Filter in client by search query if user types
  const filteredContacts = React.useMemo(() => {
    if (!searchQuery.trim()) return rawContacts
    const q = searchQuery.toLowerCase().trim()
    return rawContacts.filter((c: any) => 
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.message && c.message.toLowerCase().includes(q))
    )
  }, [rawContacts, searchQuery])

  const replyMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => 
      contactService.adminReplyContact(id, content),
    onSuccess: () => {
      toast.success("Gửi phản hồi và email tới khách hàng thành công!")
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] })
      setActiveReply(null)
      setReplyText("")
      setIsEditingReply(false)
    },
    onError: (err: any) => {
      toast.error(err.message || "Không thể gửi phản hồi.")
    }
  })

  const handleOpenReplyDialog = (contact: any) => {
    setActiveReply(contact)
    setReplyText(contact.reply_content || "")
    setIsEditingReply(!contact.is_replied)
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) {
      toast.error("Vui lòng điền nội dung phản hồi!")
      return
    }
    replyMutation.mutate({ id: activeReply.id, content: replyText })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        eyebrow="Chăm sóc khách hàng" 
        title="Phản hồi liên hệ & Hỗ trợ" 
        description="Tiếp nhận ý kiến đóng góp, giải đáp thắc mắc và gửi email phản hồi trực tiếp tới người dùng." 
      />

      <AdminToolbar>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, email, SĐT, tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl"
            />
          </div>

          <select
            className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={filterReplied}
            onChange={(e) => { setFilterReplied(e.target.value); setPage(1); }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="false">Chờ phản hồi</option>
            <option value="true">Đã phản hồi</option>
          </select>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            className="rounded-xl h-10 gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Làm mới
          </Button>
        </div>

        <p className="text-sm text-muted-foreground md:ml-auto">
          {filteredContacts.length} / {totalItems} yêu cầu
        </p>
      </AdminToolbar>

      <AdminDataPanel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Tiêu đề / Ngày gửi</th>
                <th className="px-6 py-4 whitespace-nowrap">Nội dung tin nhắn</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải danh sách liên hệ...
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <AdminEmptyState 
                      title="Không có yêu cầu phù hợp" 
                      description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái phản hồi." 
                    />
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-muted/50 transition-colors align-top">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" />
                        {c.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <a href={`mailto:${c.email}?subject=NoroFarm phản hồi: ${encodeURIComponent(c.subject)}`} className="hover:text-primary hover:underline">
                          {c.email}
                        </a>
                      </div>
                      {c.phone && (
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <a href={`tel:${c.phone}`} className="hover:text-primary">
                            {c.phone}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{c.subject}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(c.created_at).toLocaleString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-wrap">
                        {c.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {c.is_replied ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã phản hồi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                          <AlertCircle className="w-3.5 h-3.5" /> Chờ trả lời
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {c.phone && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild 
                            className="rounded-xl h-8 px-2 text-xs"
                            title="Gọi điện cho khách"
                          >
                            <a href={`tel:${c.phone}`}>
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        )}
                        <Button 
                          variant={c.is_replied ? "outline" : "default"}
                          size="sm" 
                          onClick={() => handleOpenReplyDialog(c)}
                          className={c.is_replied ? "rounded-xl h-8 text-xs" : "bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-8 text-xs font-semibold"}
                        >
                          <CornerDownRight className="w-3.5 h-3.5 mr-1" /> 
                          {c.is_replied ? "Xem & Sửa" : "Trả lời ngay"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4 text-sm">
            <span className="text-muted-foreground text-xs">
              Trang <strong>{page}</strong> / <strong>{totalPages}</strong> ({totalItems} yêu cầu)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="rounded-xl h-8 text-xs gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="rounded-xl h-8 text-xs gap-1"
              >
                Sau <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </AdminDataPanel>

      {/* Response / Reply Modal */}
      <Dialog open={!!activeReply} onOpenChange={(o) => !o && setActiveReply(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CornerDownRight className="w-5 h-5 text-primary" />
              {activeReply?.is_replied ? `Chi tiết phản hồi thư #${activeReply?.id}` : `Trả lời thư liên hệ #${activeReply?.id}`}
            </DialogTitle>
          </DialogHeader>

          {activeReply && (
            <div className="space-y-5 pt-3">
              {/* Customer message details */}
              <div className="bg-muted/40 p-4 rounded-2xl border text-sm space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground border-b pb-2.5 gap-2">
                  <div>
                    Người gửi: <span className="font-bold text-foreground">{activeReply.name}</span>
                    <span className="ml-2 text-primary font-medium">({activeReply.email})</span>
                    {activeReply.phone && <span className="ml-2 font-medium">| SĐT: {activeReply.phone}</span>}
                  </div>
                  <div>
                    {new Date(activeReply.created_at).toLocaleString("vi-VN")}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">
                    Tiêu đề: {activeReply.subject}
                  </p>
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-sm bg-background p-3 rounded-xl border">
                    {activeReply.message}
                  </p>
                </div>
              </div>

              {/* Quick Template Chips */}
              {isEditingReply && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Mẫu câu trả lời nhanh gợi ý:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {REPLY_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReplyText(tmpl.content)}
                        className="px-3 py-1.5 text-xs font-medium bg-muted/80 hover:bg-primary/10 hover:text-primary rounded-xl border transition-all text-left"
                      >
                        {tmpl.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-primary" />
                      Nội dung phản hồi (sẽ được lưu và tự động gửi tới email khách)
                    </h4>
                    {activeReply.is_replied && !isEditingReply && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingReply(true)}
                        className="text-xs text-primary hover:underline h-7 gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Chỉnh sửa / Gửi thêm
                      </Button>
                    )}
                  </div>

                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập nội dung thư phản hồi hoặc chọn mẫu trả lời nhanh ở trên..."
                    disabled={!isEditingReply}
                    required
                    rows={7}
                    className="w-full rounded-2xl border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:bg-muted/40 disabled:text-foreground/80 leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-4">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {activeReply.is_replied && activeReply.replied_at && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã phản hồi lúc: {new Date(activeReply.replied_at).toLocaleString("vi-VN")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveReply(null)} 
                      className="rounded-xl text-xs h-9"
                    >
                      Đóng
                    </Button>
                    {isEditingReply && (
                      <Button 
                        type="submit" 
                        disabled={replyMutation.isPending} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs text-xs h-9 font-semibold gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {replyMutation.isPending ? "Đang gửi email..." : activeReply.is_replied ? "Lưu & Gửi lại Email" : "Gửi thư trả lời"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
