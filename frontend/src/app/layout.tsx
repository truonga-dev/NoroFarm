import { Providers } from "@/providers"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "NoroFarm - Cổng thông tin Nông nghiệp & Nông sản",
    template: "%s | NoroFarm",
  },
  description: "Cập nhật giá cà phê, hồ tiêu, nông sản, thời tiết và tin tức mới nhất.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "NoroFarm",
    statusBarStyle: "default",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <Suspense fallback={null}>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
