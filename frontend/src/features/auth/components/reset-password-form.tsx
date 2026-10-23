"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, CircleCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "./password-input"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { authService } from "@/api/services/auth.service"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp.",
  path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) {
      setServerError("Link khôi phục không hợp lệ hoặc đã thiếu token.")
      return
    }
    
    setIsLoading(true)
    setServerError(null)
    try {
      await authService.resetPassword({ token, new_password: data.password })
      setIsSuccess(true)
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      setServerError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CircleCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
        </div>
        <h3 className="text-xl font-semibold">Khôi phục thành công</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Mật khẩu của bạn đã được cập nhật thành công. Vui lòng đăng nhập lại với mật khẩu mới.
        </p>
        <Button asChild className="mt-4 w-full">
          <Link href="/login">Về trang Đăng nhập</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            {errors?.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button disabled={isLoading} className="mt-2">
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Cập nhật mật khẩu
          </Button>
        </div>
      </form>
    </div>
  )
}
