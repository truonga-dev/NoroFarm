import { Metadata } from "next"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { AdminLoginForm } from "@/features/auth/components/admin-login-form"

export const metadata: Metadata = {
  title: "Đăng nhập Quản trị viên | NoroFarm",
  description: "Đăng nhập vào hệ thống quản trị NoroFarm",
}

export default function AdminLoginPage() {
  return (
    <>
      <AuthHeader
        title="Quản trị viên"
        description="Đăng nhập để vào trang quản trị NoroFarm"
        backLink="/"
        backLabel="Quay lại trang chủ"
      />
      <AdminLoginForm />
    </>
  )
}
