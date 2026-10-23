import { Metadata } from "next"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { RegisterForm } from "@/features/auth/components/register-form"

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản NoroFarm mới",
}

export default function RegisterPage() {
  return (
    <>
      <AuthHeader
        title="Tạo tài khoản"
        description="Đăng ký để trải nghiệm toàn bộ tính năng"
        backLink="/login"
        backLabel="Đã có tài khoản? Đăng nhập"
      />
      <RegisterForm />
    </>
  )
}
