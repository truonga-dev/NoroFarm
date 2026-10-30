"use client"

import * as React from "react"
import { Search, MoreVertical, ShieldAlert, Ban, ShieldCheck, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/client"
import { AdminDataPanel, AdminEmptyState, AdminPageHeader, AdminToolbar } from "@/features/admin/components/admin-page"

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState("")
  const [isBanModalOpen, setIsBanModalOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<any>(null)
  const toast = useToast()
  const queryClient = useQueryClient()

  // Fetch users from API
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/users")
      return res.data
    }
  })

  const users = data || []

  // Mutation to toggle ban status
  const toggleStatusMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiClient.patch(`/admin/users/${userId}/status`)
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      toast.success(data.is_active ? "Đã mở khóa tài khoản thành công!" : "Đã khóa tài khoản thành công!")
      setIsBanModalOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi thay đổi trạng thái.")
      setIsBanModalOpen(false)
    }
  })

  // Mutation to change role
  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number, role: string }) => {
      const res = await apiClient.patch(`/admin/users/${userId}/role`, { roles: [role] })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      toast.success("Đã cập nhật phân quyền thành công")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Chức năng chưa khả dụng.")
    }
  })

  const filteredUsers = users.filter((u: any) => {
    const nameMatch = u.profile?.full_name?.toLowerCase().includes(search.toLowerCase())
    const emailMatch = u.email.toLowerCase().includes(search.toLowerCase())
    return nameMatch || emailMatch
  })

  const handleRoleChange = (userId: number, newRole: string) => {
    changeRoleMutation.mutate({ userId, role: newRole })
  }

  const handleBanToggle = () => {
    if (!selectedUser) return
    toggleStatusMutation.mutate(selectedUser.id)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Tài khoản" title="Quản lý người dùng" description="Xem danh sách, phân quyền và quản lý trạng thái tài khoản thành viên." />

      <AdminToolbar>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm theo tên hoặc email..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-sm text-muted-foreground sm:ml-auto">{filteredUsers.length} người dùng</p>
      </AdminToolbar>

      <AdminDataPanel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Người dùng</th>
                <th className="px-6 py-4 whitespace-nowrap">Liên hệ</th>
                <th className="px-6 py-4 whitespace-nowrap">Ngày tham gia</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 whitespace-nowrap">Phân quyền</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6}><AdminEmptyState title="Không tìm thấy người dùng" description="Thử tìm bằng tên hoặc địa chỉ email khác." /></td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => {
                  const roleName = user.roles && user.roles.length > 0 ? user.roles[0].name : "user"
                  const userName = user.profile?.full_name || "Người dùng ẩn danh"
                  const userAvatar = userName.charAt(0).toUpperCase()
                  
                  return (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white shadow-sm ${
                          roleName === 'admin' ? 'bg-primary' : 'bg-slate-400'
                        }`}>
                          {userAvatar}
                        </div>
                        <div className="font-medium text-foreground">{userName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                        user.is_active 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                      }`}>
                        {user.is_active ? 'Đang hoạt động' : 'Bị Khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className="flex h-8 w-32 items-center justify-between rounded-md border border-input bg-muted/30 px-3 py-1 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                        value={roleName}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.email === 'admin@norofarm.com'} // Prevent changing main admin
                      >
                        <option value="user">Người mua (User)</option>
                        <option value="seller">Người bán (Seller)</option>
                        <option value="admin">Quản trị viên (Admin)</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`h-8 w-8 ${user.is_active ? 'text-orange-500 hover:bg-orange-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
                          onClick={() => {
                            setSelectedUser(user)
                            setIsBanModalOpen(true)
                          }}
                          disabled={user.email === 'admin@norofarm.com' || toggleStatusMutation.isPending}
                        >
                          {user.is_active ? <Ban className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </AdminDataPanel>

      <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
              {selectedUser?.is_active ? "Xác nhận Khóa Tài Khoản" : "Xác nhận Mở Khóa"}
            </DialogTitle>
            <DialogDescription className="pt-2">
              Bạn có chắc chắn muốn {selectedUser?.is_active ? "khóa" : "mở khóa"} tài khoản của 
              <span className="font-semibold text-foreground ml-1">{selectedUser?.profile?.full_name || selectedUser?.email}</span>?
            </DialogDescription>
          </DialogHeader>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsBanModalOpen(false)}>Hủy bỏ</Button>
            <Button 
              variant={selectedUser?.is_active ? "destructive" : "default"}
              onClick={handleBanToggle}
              disabled={toggleStatusMutation.isPending}
            >
              {toggleStatusMutation.isPending ? "Đang xử lý..." : (selectedUser?.is_active ? "Khóa tài khoản" : "Mở khóa")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
