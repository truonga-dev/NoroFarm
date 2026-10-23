"use client"

import * as React from "react"
import { Suspense } from "react"
import { motion } from "framer-motion"
import { CircleCheck, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authService } from "@/api/services/auth.service"

function VerifyEmailContent() {
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  React.useEffect(() => {
    if (!token) {
      setStatus("error")
      return
    }

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token)
        setStatus("success")
      } catch (err) {
        setStatus("error")
      }
    }

    verifyToken()
  }, [token])

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {status === "loading" && (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/50">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
        
        {status === "success" && (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CircleCheck className="h-12 w-12 text-emerald-600 dark:text-emerald-500" />
          </div>
        )}
        
        {status === "error" && (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
        )}
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {status === "loading" && "Đang xác thực email..."}
          {status === "success" && "Xác thực thành công!"}
          {status === "error" && "Liên kết hết hạn hoặc không hợp lệ"}
        </h2>
        <p className="text-muted-foreground">
          {status === "loading" && "Vui lòng chờ trong giây lát. Chúng tôi đang kiểm tra mã xác nhận của bạn."}
          {status === "success" && "Email của bạn đã được xác thực thành công. Bây giờ bạn có thể đăng nhập vào hệ thống."}
          {status === "error" && "Rất tiếc, liên kết này đã hết hạn hoặc không tồn tại. Vui lòng yêu cầu gửi lại email xác thực."}
        </p>
      </div>

      <div className="pt-6">
        {status === "success" ? (
          <Button asChild size="lg" className="px-8">
            <Link href="/login">Đi đến Đăng nhập</Link>
          </Button>
        ) : status === "error" ? (
          <Button asChild size="lg" className="px-8">
            <Link href="/register">Về trang Đăng ký</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
