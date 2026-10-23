import { AuthGuard } from "@/components/auth/auth-guard"

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
