"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"
import { PageWrapper } from "./page-wrapper"
import { ScrollToTop } from "./scroll-to-top"
import { AnnouncementBanner } from "./announcement-banner"
import { AdminHeader } from "@/features/admin/components/admin-header"
import { NavigationFeedback } from "./navigation-feedback"
import { NoroFarmAiChat } from "@/components/ai/norofarm-ai-chat"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) {
    // Admin layout doesn't use the public Header and Footer
    return <><NavigationFeedback />{children}</>
  }

  return (
    <PageWrapper>
      <NavigationFeedback />
      <AnnouncementBanner />
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
      <NoroFarmAiChat />
    </PageWrapper>
  )
}
