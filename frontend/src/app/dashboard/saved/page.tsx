"use client"

import { useState, useEffect } from "react"
import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Sidebar } from "@/components/layout/sidebar"
import { PageTitle } from "@/components/layout/page-title"
import { Bookmark, Star, Trash2, ArrowRight, TrendingUp, TrendingDown, Calculator, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { profileService } from "@/api/services/profile.service"
import { useToast } from "@/components/ui/toast-context"
import Link from "next/link"

const PORTFOLIO_STORAGE_KEY = "norofarm_portfolio_quantities_v1"

export default function SavedItemsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PORTFOLIO_STORAGE_KEY)
      if (saved) {
        setQuantities(JSON.parse(saved))
      }
    } catch {
      // ignore localStorage errors
    }
  }, [])

  const handleQuantityChange = (commodityId: number, val: string) => {
    const num = Math.max(0, Number(val) || 0)
    const next = { ...quantities, [commodityId]: num }
    setQuantities(next)
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  const { data: watchlistData, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await profileService.getWatchlist()
      return res.data
    }
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => profileService.removeFromWatchlist(id),
    onSuccess: () => {
      toast.success("Đã xóa khỏi mục đã lưu")
      queryClient.invalidateQueries({ queryKey: ["watchlist"] })
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa")
    }
  })

  const items: any[] = watchlistData?.data || watchlistData || []

  // Tính tổng giá trị nông sản tồn kho theo giá 2026 thời gian thực
  const totalPortfolioValue = items.reduce((sum: number, item: any) => {
    const qty = quantities[item.id] ?? 1000 // mặc định 1000 kg (1 tấn) để dễ hình dung
    const price = Number(item.current_price || 0)
    return sum + qty * price
  }, 0)

  const projectedPlus5Value = Math.round(totalPortfolioValue * 1.05)

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-muted/20 md:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Section className="py-6 md:py-8 lg:py-10">
            <Container>
              <div className="flex flex-col gap-4 mb-8">
                <PageTitle
                  title="Danh mục Nông sản & Tồn kho 2026"
                  description="Theo dõi giá thời gian thực và ước tính tổng giá trị sản lượng nông sản của bạn."
                  className="pt-0 pb-0"
                />
              </div>

              {items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-card rounded-2xl border p-5 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Tổng giá trị tồn kho ước tính</p>
                      <p className="text-2xl font-extrabold text-foreground">
                        {totalPortfolioValue.toLocaleString("vi-VN")} <span className="text-xs font-normal text-muted-foreground">VNĐ</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-card rounded-2xl border p-5 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Kịch bản giá tăng +5%</p>
                      <p className="text-xl font-bold text-emerald-600">
                        +{Math.round(totalPortfolioValue * 0.05).toLocaleString("vi-VN")} đ
                      </p>
                      <p className="text-[11px] text-muted-foreground">Tổng thu: {projectedPlus5Value.toLocaleString("vi-VN")} đ</p>
                    </div>
                  </div>
                  <div className="bg-card rounded-2xl border p-5 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Mặt hàng đang theo dõi</p>
                      <p className="text-2xl font-extrabold text-foreground">{items.length} <span className="text-xs font-normal text-muted-foreground">nông sản</span></p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-card rounded-2xl border shadow-sm p-6">
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Nông sản quan tâm ({items.length})</h3>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/commodities">+ Thêm nông sản</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-48 w-full rounded-xl" />
                    ))
                  ) : items.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                      <Star className="w-12 h-12 mb-4 text-muted-foreground/30" />
                      <p className="font-medium text-foreground mb-1">Bạn chưa lưu nông sản nào.</p>
                      <p className="text-sm text-muted-foreground mb-4">Hãy thêm các nông sản bạn đang canh tác để tính toán giá trị mùa vụ.</p>
                      <Button variant="outline" asChild>
                        <Link href="/commodities">Khám phá thị trường</Link>
                      </Button>
                    </div>
                  ) : (
                    items.map((item: any) => {
                      const price = Number(item.current_price || 0)
                      const changePct = item.price_change_percent != null ? Number(item.price_change_percent) : 0
                      const qty = quantities[item.id] ?? 1000
                      const estimatedValue = qty * price

                      return (
                        <div key={item.id} className="group border rounded-xl p-4 hover:shadow-md transition-all bg-background relative overflow-hidden flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                  {item.name?.charAt(0) || "N"}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold truncate">{item.name}</h4>
                                  <p className="text-xs text-muted-foreground">{item.category_name || item.code || "Nông sản"}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0"
                                onClick={() => removeMutation.mutate(item.id)}
                                disabled={removeMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="bg-muted/40 rounded-lg p-3 mb-3 flex items-center justify-between">
                              <div>
                                <p className="text-[11px] text-muted-foreground">Giá thị trường 2026</p>
                                <p className="text-base font-extrabold text-foreground">
                                  {price > 0 ? `${price.toLocaleString("vi-VN")} đ/${item.unit || "kg"}` : "Đang cập nhật"}
                                </p>
                              </div>
                              {changePct !== 0 && (
                                <Badge
                                  variant="outline"
                                  className={
                                    changePct > 0
                                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                      : "bg-red-500/10 text-red-600 border-red-500/30"
                                  }
                                >
                                  {changePct > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                  {changePct > 0 ? "+" : ""}{changePct.toFixed(1)}%
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Sản lượng nắm giữ ({item.unit || "kg"}):</span>
                                <Input
                                  type="number"
                                  min="0"
                                  step="100"
                                  value={qty}
                                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                  className="h-7 w-28 text-right text-xs font-semibold px-2"
                                />
                              </div>
                              {price > 0 && (
                                <div className="flex items-center justify-between text-xs pt-1">
                                  <span className="text-muted-foreground">Thành tiền ước tính:</span>
                                  <span className="font-bold text-primary">{estimatedValue.toLocaleString("vi-VN")} đ</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <Link href={`/dashboard/alerts`} className="text-xs text-muted-foreground hover:text-primary">
                              Cài báo giá
                            </Link>
                            <Link href={`/commodities/${item.id}`} className="text-xs text-primary font-medium flex items-center hover:underline">
                              Xem biểu đồ <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </Container>
          </Section>
        </main>
      </div>
    </PageTransition>
  )
}
