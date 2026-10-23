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
import { SocialLogin } from "./social-login"
import { PasswordInput } from "./password-input"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email({ message: "Vui lòng nhập email hợp lệ." }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
  rememberMe: z.boolean().default(false).optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()
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
      await login({ email: data.email, password: data.password })
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Đăng nhập thất bại. Vui lòng thử lại."
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
            <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Mật khẩu</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
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
              Ghi nhớ đăng nhập
            </Label>
          </div>

          <Button
            disabled={isLoggingIn}
            className="mt-2 h-11 rounded-xl font-semibold text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-primary/50 hover:scale-[1.01]"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </div>
      </form>
      <SocialLogin />
    </div>
  )
}
