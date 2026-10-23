import { Metadata } from "next"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào tài khoản NoroFarm của bạn",
}

export default function LoginPage() {
  return (
    <>
      <AuthHeader
        title="Chào mừng trở lại"
        description="Đăng nhập để xem thông tin thị trường"
        backLink="/register"
        backLabel="Chưa có tài khoản? Đăng ký ngay"
      />
      <LoginForm />
    </>
  )
}
