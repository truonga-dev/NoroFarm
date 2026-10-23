import { Metadata } from "next"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Khôi phục mật khẩu tài khoản NoroFarm",
}

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeader
        title="Quên mật khẩu?"
        description="Đừng lo, chúng tôi sẽ gửi cho bạn hướng dẫn khôi phục"
        backLink="/login"
        backLabel="Quay lại đăng nhập"
      />
      <ForgotPasswordForm />
    </>
  )
}
