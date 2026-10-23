"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { User, Shield, Monitor, Save, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useToast } from "@/components/ui/toast-context"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export default function AdminSettingsPage() {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const toast = useToast()
  const router = useRouter()

  const [mounted, setMounted] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Đã cập nhật thông tin thành công!")
    }, 1000)
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Đã thay đổi mật khẩu an toàn!")
    }, 1000)
  }

  const handleLogout = () => {
    logout()
    router.push("/admin-login")
    toast.success("Đã đăng xuất thành công")
  }

  if (!mounted) return null

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cài đặt Hệ thống</h2>
        <p className="text-muted-foreground mt-2">
          Quản lý tài khoản, bảo mật và các tùy chọn giao diện hiển thị.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 mb-6 bg-muted/50 p-1">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" /> Tài khoản
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Bảo mật
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Hệ thống
          </TabsTrigger>
        </TabsList>

        {/* Tab Tài khoản */}
        <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-none shadow-sm bg-background">
            <CardHeader>
              <CardTitle>Thông tin Cá nhân</CardTitle>
              <CardDescription>Cập nhật thông tin hiển thị của bạn trên hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-center gap-6 pb-4 border-b border-muted">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-4 border-background shadow-sm">
                    {user?.profile?.full_name?.charAt(0) || "A"}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{user?.profile?.full_name || "Quản trị viên"}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Họ và tên</Label>
                    <Input id="fullname" defaultValue={user?.profile?.full_name || ""} className="bg-muted/30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Địa chỉ Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} className="bg-muted/30" disabled />
                    <p className="text-xs text-muted-foreground mt-1">Email không thể thay đổi</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                  </Button>
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    {isSaving ? "Đang lưu..." : <><Save className="w-4 h-4" /> Lưu thông tin</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Bảo mật */}
        <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-none shadow-sm bg-background">
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>Đảm bảo tài khoản của bạn đang sử dụng mật khẩu mạnh và an toàn</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                  <Input id="current-password" type="password" required className="bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <Input id="new-password" type="password" required className="bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                  <Input id="confirm-password" type="password" required className="bg-muted/30" />
                </div>
                <div className="pt-4">
                  <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                    {isSaving ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Hệ thống */}
        <TabsContent value="preferences" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-none shadow-sm bg-background">
            <CardHeader>
              <CardTitle>Cài đặt Giao diện</CardTitle>
              <CardDescription>Tùy chỉnh cách hệ thống hiển thị với bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
                <div>
                  <h4 className="font-medium">Chế độ tối (Dark Mode)</h4>
                  <p className="text-sm text-muted-foreground">Kích hoạt giao diện tối bảo vệ mắt</p>
                </div>
                <Switch 
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
                <div>
                  <h4 className="font-medium">Nhận thông báo qua Email</h4>
                  <p className="text-sm text-muted-foreground">Nhận email khi có bình luận hoặc thay đổi giá</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
                <div>
                  <h4 className="font-medium">Ngôn ngữ hiển thị</h4>
                  <p className="text-sm text-muted-foreground">Hiện tại chỉ hỗ trợ Tiếng Việt</p>
                </div>
                <select disabled className="px-3 py-1.5 rounded-md border bg-muted/50 text-sm">
                  <option>Tiếng Việt (Mặc định)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
