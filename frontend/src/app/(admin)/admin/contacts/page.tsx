"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Mail, CheckCircle2, AlertCircle, Eye, CornerDownRight, Send, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast-context"
import { contactService } from "@/api/services/contact.service"

export default function AdminContactsPage() {
  const [filterReplied, setFilterReplied] = React.useState<string>("") // "", "true", "false"
  const [page, setPage] = React.useState(1)
  const [activeReply, setActiveReply] = React.useState<any>(null)
  const [replyText, setReplyText] = React.useState("")

  const queryClient = useQueryClient()
  const toast = useToast()

  const isRepliedParam = filterReplied === "true" ? true : filterReplied === "false" ? false : undefined

  const { data: contactsData, isLoading } = useQuery({
    queryKey: ["admin-contacts", page, filterReplied],
    queryFn: () => contactService.adminGetContacts({ 
      page, 
      size: 20, 
      is_replied: isRepliedParam 
    })
  })

  const contacts = contactsData?.data?.items || []

  const replyMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => 
      contactService.adminReplyContact(id, content),
    onSuccess: () => {
      toast.success("Gửi phản hồi và email tới khách hàng thành công!")
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] })
      setActiveReply(null)
      setReplyText("")
    },
    onError: (err: any) => {
      toast.error(err.message || "Không thể gửi phản hồi.")
    }
  })

  const handleOpenReplyDialog = (contact: any) => {
    setActiveReply(contact)
    setReplyText(contact.reply_content || "")
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý Phản Hồi Liên Hệ</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tiếp nhận ý kiến khách hàng và gửi email phản hồi trực tiếp từ hệ thống.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-background p-4 rounded-xl border shadow-sm">
        <select
          className="h-10 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring w-full md:w-auto"
          value={filterReplied}
          onChange={(e) => { setFilterReplied(e.target.value); setPage(1); }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="false">Chờ phản hồi</option>
          <option value="true">Đã phản hồi</option>
        </select>
      </div>

      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
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
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Đang tải...</td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Không tìm thấy phản hồi liên hệ nào.</td></tr>
              ) : (
                contacts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-muted/50 transition-colors align-top">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        {c.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{c.email}</div>
                      {c.phone && <div className="text-[10px] text-muted-foreground mt-0.5">SĐT: {c.phone}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{c.subject}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(c.created_at).toLocaleString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {c.is_replied ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã phản hồi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                          <AlertCircle className="w-3.5 h-3.5" /> Chờ trả lời
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button 
                        variant={c.is_replied ? "outline" : "default"}
                        size="sm" 
                        onClick={() => handleOpenReplyDialog(c)}
                        className={c.is_replied ? "" : "bg-primary hover:bg-primary/90 text-white"}
                      >
                        <Mail className="w-4 h-4 mr-1.5" /> 
                        {c.is_replied ? "Xem lại" : "Trả lời"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!activeReply} onOpenChange={(o) => !o && setActiveReply(null)}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CornerDownRight className="w-5 h-5 text-primary" />
              Trả lời thư liên hệ #{activeReply?.id}
            </DialogTitle>
          </DialogHeader>

          {activeReply && (
            <div className="space-y-5 pt-4">
              {/* Customer message details */}
              <div className="bg-muted/40 p-4 rounded-2xl border text-sm space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground border-b pb-2">
                  <div>
                    Người gửi: <span className="font-semibold text-foreground">{activeReply.name}</span> ({activeReply.email})
                  </div>
                  <div>
                    Ngày: {new Date(activeReply.created_at).toLocaleString("vi-VN")}
                  </div>
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Tiêu đề: {activeReply.subject}</p>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{activeReply.message}</p>
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-primary" />
                    Nội dung phản hồi (sẽ được gửi tới Email của khách)
                  </h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập nội dung thư trả lời khách hàng..."
                    disabled={activeReply.is_replied}
                    required
                    rows={6}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:bg-muted/30 disabled:text-muted-foreground"
                  />
                </div>

                {!activeReply.is_replied ? (
                  <div className="flex justify-end gap-3 border-t pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveReply(null)} className="rounded-xl">
                      Đóng
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={replyMutation.isPending} 
                      className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md"
                    >
                      {replyMutation.isPending ? "Đang gửi email..." : "Gửi thư trả lời"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center border-t pt-4 text-xs text-muted-foreground">
                    <div>
                      Đã gửi phản hồi vào: {new Date(activeReply.replied_at).toLocaleString("vi-VN")}
                    </div>
                    <Button type="button" onClick={() => setActiveReply(null)} className="rounded-xl">
                      Đóng
                    </Button>
                  </div>
                )}
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
