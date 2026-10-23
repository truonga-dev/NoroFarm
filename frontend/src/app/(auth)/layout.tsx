import { ReactNode } from "react"
import { AuthLayoutWrapper } from "@/features/auth/components/auth-layout-wrapper"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
}
