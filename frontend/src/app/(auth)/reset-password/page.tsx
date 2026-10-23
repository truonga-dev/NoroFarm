import { Metadata } from "next"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Thiết lập lại mật khẩu",
  description: "Cập nhật mật khẩu mới cho tài khoản của bạn",
}

export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeader
        title="Thiết lập mật khẩu mới"
        description="Vui lòng nhập mật khẩu mới của bạn bên dưới"
      />
      <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </>
  )
}
