"use client";
// Note: Metadata không hỗ trợ trong client component. Title sẽ được set từ layout.
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, User2, Monitor, Bell, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";

import { PageTransition } from "@/components/layout/page-transition";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Sidebar } from "@/components/layout/sidebar";
import { PageTitle } from "@/components/layout/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileService } from "@/api/services/profile.service";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const profileSchema = z.object({
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone_number: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type SettingsTab = "profile" | "display" | "notifications" | "security";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Hồ sơ cá nhân", icon: User2 },
  { id: "display", label: "Hiển thị", icon: Monitor },
  { id: "notifications", label: "Thông báo", icon: Bell },
  { id: "security", label: "Bảo mật", icon: ShieldCheck },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.profile?.full_name || "",
      phone_number: user?.profile?.phone_number || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      // Cập nhật authStore với dữ liệu mới
      const updatedUser = data?.data || data;
      if (updatedUser) {
        updateUser(updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  async function onSubmit(formData: ProfileFormValues) {
    setSaveSuccess(false);
    await updateMutation.mutateAsync({
      full_name: formData.full_name,
      phone_number: formData.phone_number,
    });
  }

  const [passwordData, setPasswordData] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [passwordStatus, setPasswordStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const passwordMutation = useMutation({
    mutationFn: profileService.changePassword,
    onSuccess: () => {
      setPasswordStatus({ type: 'success', message: 'Đổi mật khẩu thành công!' });
      setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
    },
    onError: (error: any) => {
      setPasswordStatus({ type: 'error', message: error?.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.' });
    }
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordStatus({ type: 'error', message: 'Mật khẩu xác nhận không khớp!' });
      return;
    }
    if (passwordData.new_password.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }
    passwordMutation.mutate({
      old_password: passwordData.old_password,
      new_password: passwordData.new_password
    });
  };

  const [displaySettings, setDisplaySettings] = useState({
    defaultRegion: "tay-nguyen",
    defaultCommodity: "coffee"
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("displaySettings");
      if (raw) {
        const parsed = JSON.parse(raw);
        setDisplaySettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveDisplay = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save to localStorage
    localStorage.setItem('displaySettings', JSON.stringify(displaySettings));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Avatar initials
  const initials = user?.profile?.full_name
    ? user.profile.full_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "N";

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <Section className="py-6 md:py-8 lg:py-10">
            <Container>
              <PageTitle
                title="Cài đặt tài khoản"
                description="Quản lý thông tin cá nhân và tùy chọn hiển thị của bạn."
                className="pt-0 pb-8 md:pb-8 md:pt-0"
              />

              <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-60 shrink-0 space-y-1">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all",
                          activeTab === tab.id
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  {activeTab === "profile" && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Thông tin cá nhân</h3>

                        {/* Avatar */}
                        <div className="flex items-center gap-6 mb-8">
                          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/20">
                            {initials}
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{user?.profile?.full_name || "Người dùng NoroFarm"}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            {user?.is_verified && (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                                <CheckCircle2 className="h-3 w-3" /> Đã xác minh
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Họ và tên</Label>
                            <Input
                              id="full_name"
                              placeholder="Nguyễn Văn A"
                              {...register("full_name")}
                            />
                            {errors.full_name && (
                              <p className="text-xs text-destructive">{errors.full_name.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone_number">Số điện thoại</Label>
                            <Input
                              id="phone_number"
                              placeholder="0987654321"
                              {...register("phone_number")}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Email</Label>
                            <Input
                              value={user?.email || ""}
                              disabled
                              className="opacity-60 cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">Email không thể thay đổi.</p>
                          </div>
                        </div>

                        {/* Success message */}
                        {saveSuccess && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-500/10 px-4 py-3 rounded-xl">
                            <CheckCircle2 className="h-4 w-4" />
                            Lưu thay đổi thành công!
                          </div>
                        )}

                        {/* Error message */}
                        {updateMutation.isError && (
                          <div className="mt-4 text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-xl">
                            Cập nhật thất bại. Vui lòng thử lại.
                          </div>
                        )}

                        <div className="mt-8 flex justify-end">
                          <Button
                            type="submit"
                            disabled={updateMutation.isPending || !isDirty}
                          >
                            {updateMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                              </>
                            ) : (
                              "Lưu thay đổi"
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}

                  {activeTab === "display" && (
                    <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
                      <h3 className="text-xl font-bold mb-6">Cài đặt hiển thị & Vùng miền</h3>
                      
                      <form onSubmit={handleSaveDisplay} className="space-y-6 max-w-md">
                        <div className="space-y-3">
                          <Label>Giao diện (Dark Mode)</Label>
                          <div className="flex items-center justify-between border rounded-xl p-4">
                            <div className="space-y-0.5">
                              <Label className="text-base font-medium">Chế độ tối</Label>
                              <p className="text-sm text-muted-foreground">Chuyển đổi giao diện sáng tối</p>
                            </div>
                            <Switch 
                              checked={theme === 'dark'}
                              onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Vùng mặc định</Label>
                          <Select 
                            value={displaySettings.defaultRegion} 
                            onValueChange={(val) => setDisplaySettings({...displaySettings, defaultRegion: val})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vùng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tay-nguyen">Tây Nguyên</SelectItem>
                              <SelectItem value="dong-nam-bo">Đông Nam Bộ</SelectItem>
                              <SelectItem value="tay-nam-bo">Tây Nam Bộ</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">Khu vực ưu tiên hiển thị thời tiết và giá trị mặc định.</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Loại cây quan tâm nhất</Label>
                          <Select 
                            value={displaySettings.defaultCommodity} 
                            onValueChange={(val) => setDisplaySettings({...displaySettings, defaultCommodity: val})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại cây" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="coffee">Cà phê</SelectItem>
                              <SelectItem value="pepper">Hồ tiêu</SelectItem>
                              <SelectItem value="rice">Lúa gạo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {saveSuccess && activeTab === "display" && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-500/10 px-4 py-3 rounded-xl">
                            <CheckCircle2 className="h-4 w-4" />
                            Đã lưu cài đặt hiển thị!
                          </div>
                        )}

                        <div className="pt-4">
                          <Button type="submit">Lưu cài đặt</Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
                      <h3 className="text-xl font-bold mb-6">Cài đặt thông báo</h3>
                      <p className="text-muted-foreground text-sm">Tính năng đang phát triển.</p>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
                      <h3 className="text-xl font-bold mb-6">Đổi mật khẩu</h3>
                      
                      <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                        <div className="space-y-2">
                          <Label htmlFor="old_password">Mật khẩu hiện tại</Label>
                          <Input 
                            id="old_password" 
                            type="password" 
                            required 
                            value={passwordData.old_password}
                            onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new_password">Mật khẩu mới</Label>
                          <Input 
                            id="new_password" 
                            type="password" 
                            required 
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">Xác nhận mật khẩu mới</Label>
                          <Input 
                            id="confirm_password" 
                            type="password" 
                            required 
                            value={passwordData.confirm_password}
                            onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                          />
                        </div>

                        {passwordStatus && (
                          <div className={cn(
                            "mt-4 p-3 text-sm rounded-xl",
                            passwordStatus.type === 'success' ? "text-emerald-600 bg-emerald-500/10" : "text-destructive bg-destructive/10"
                          )}>
                            {passwordStatus.message}
                          </div>
                        )}

                        <div className="pt-4">
                          <Button type="submit" disabled={passwordMutation.isPending || !passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password}>
                            {passwordMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Đổi mật khẩu
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </Section>
        </main>
      </div>
    </PageTransition>
  );
}
