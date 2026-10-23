"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SocialLogin } from "./social-login"
import { PasswordInput } from "./password-input"
import { useAuth } from "@/hooks/useAuth"

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Vui lòng nhập họ tên hợp lệ." }),
  email: z.string().email({ message: "Vui lòng nhập email hợp lệ." }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản dịch vụ.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp.",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { register: registerUser, isRegistering, registerError, getErrorMessage } = useAuth()
  const [serverError, setServerError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setServerError(null)
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        full_name: data.fullName,
      })
    } catch (err: any) {
      setServerError(getErrorMessage(err))
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
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              disabled={isRegistering}
              className="h-11 rounded-xl border-border/60 bg-background/60 backdrop-blur-sm focus-visible:ring-primary/50 transition-all"
              {...register("fullName")}
            />
            {errors?.fullName && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isRegistering}
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
            <Label htmlFor="password">Mật khẩu</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              disabled={isRegistering}
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
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              disabled={isRegistering}
              className="h-11 rounded-xl border-border/60 bg-background/60 backdrop-blur-sm focus-visible:ring-primary/50 transition-all"
              {...register("confirmPassword")}
            />
            {errors?.confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)}
              />
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tôi đồng ý với{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Điều khoản
                </Link>{" "}
                và{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Chính sách
                </Link>
              </Label>
            </div>
            {errors?.acceptTerms && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.acceptTerms.message}
              </p>
            )}
          </div>
          <Button
            disabled={isRegistering}
            className="mt-2 h-11 rounded-xl font-semibold text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-primary/50 hover:scale-[1.01]"
          >
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký tài khoản"
            )}
          </Button>
        </div>
      </form>
      <SocialLogin />
    </div>
  )
}
