"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PasswordInput } from "./password-input"
import { useAuth } from "@/hooks/useAuth"

const loginSchema = z.object({
  email: z.string().email({ message: "Vui lòng nhập email hợp lệ." }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
  rememberMe: z.boolean().default(false).optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function AdminLoginForm() {
  const { login, isLoggingIn } = useAuth()
  const [serverError, setServerError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setServerError(null)
    try {
      // Gọi chung hàm login của authService
      // useAuth hook đã tự động chuyển hướng /admin nếu role là admin
      await login({ email: data.email, password: data.password })
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại quyền truy cập."
      setServerError(msg)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {/* Server error alert */}
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
            <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Tài khoản Email</Label>
            <Input
              id="email"
              placeholder="admin@norofarm.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoggingIn}
              className="h-11 rounded-xl border-border/60 bg-background/60 backdrop-blur-sm focus-visible:ring-primary/50 transition-all"
              {...register("email")}
            />
            {errors?.email && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Mật khẩu hệ thống</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              disabled={isLoggingIn}
              className="h-11 rounded-xl border-border/60 bg-background/60 backdrop-blur-sm focus-visible:ring-primary/50 transition-all"
              {...register("password")}
            />
            {errors?.password && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
              className="rounded-md"
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Ghi nhớ phiên đăng nhập (7 ngày)
            </Label>
          </div>

          <Button
            disabled={isLoggingIn}
            className="mt-4 h-11 rounded-xl font-semibold text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:shadow-blue-600/50 hover:scale-[1.01]"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              "Vào trang quản trị"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
