"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

import { Container } from "./container"
import { Button } from "@/components/ui/button"

const QUICK_LINKS = [
  { title: "Về chúng tôi", href: "/about" },
  { title: "Liên hệ", href: "/contact" },
  { title: "Tin tức nông nghiệp", href: "/news" },
  { title: "Tuyển dụng", href: "/careers" },
]

const CATEGORIES = [
  { title: "Bảng giá Cà phê", href: "/coffee" },
  { title: "Bảng giá Hồ tiêu", href: "/commodities?type=pepper" },
  { title: "Vật tư Nông nghiệp", href: "/marketplace" },
  { title: "Dự báo thời tiết", href: "/weather" },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-5">

          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="NoroFarm Logo" width={32} height={32} className="rounded-full" />
              <span className="text-xl font-bold">NoroFarm</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              NoroFarm là cổng thông tin nông nghiệp Việt Nam, cung cấp dữ liệu giá cả, thời tiết và tin tức chính xác, kịp thời nhất.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-primary">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Danh mục</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span>X. Đăk Long, Tỉnh Quảng Ngãi</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <span>1900 1234 56</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span>support@norofarm.vn</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Bản đồ</h3>
            <a
              href="https://www.google.com/maps/search/?api=1&query=14.888946,107.624798"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-40 w-full flex-col justify-between overflow-hidden rounded-xl border bg-gradient-to-br from-primary/10 via-muted/60 to-emerald-500/10 p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                <MapPin className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  Xem trên Google Maps
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">Mở chỉ đường trong tab mới</span>
              </span>
            </a>
          </div>
        </div>

        <div className="border-t py-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NoroFarm. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary">Chính sách bảo mật</Link>
            <Link href="/terms" className="hover:text-primary">Điều khoản sử dụng</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
