"use client"

import { useState, useEffect } from "react"
import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Sidebar } from "@/components/layout/sidebar"
import { PageTitle } from "@/components/layout/page-title"
import { Bell, BellRing, Trash2, ArrowRight, TrendingUp, TrendingDown, Plus, RefreshCw, Pause, Play, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationService } from "@/api/services/notification.service"
import { commodityService } from "@/api/services/commodity.service"
import { useToast } from "@/components/ui/toast-context"
import Link from "next/link"

export default function AlertsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  const [isPushSupported, setIsPushSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loadingPush, setLoadingPush] = useState(false)

  // Modal Tạo cảnh báo mới
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>("")
  const [condition, setCondition] = useState<string>("above")
  const [targetPrice, setTargetPrice] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setIsPushSupported(true)
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription)
        })
      })
    }
  }, [])

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const FALLBACK_VAPID_KEY = "BCRXsm1J0zldDKZhzhqmaOqLrFQg8ZXcvcaWOR8qJfjygzUyGGL5FkmS9889fkDT_hpnT0bW965LzXqCicc5wQE"

  const subscribeToPush = async () => {
    try {
      setLoadingPush(true)
      if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
        toast.error("Trình duyệt của bạn không hỗ trợ thông báo đẩy.")
        return
      }

      if (Notification.permission === "denied") {
        toast.error("Quyền nhận thông báo đã bị chặn. Vui lòng mở lại trong cài đặt trang web của trình duyệt.")
        return
      }

      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast.error("Bạn chưa cấp quyền nhận thông báo.")
        return
      }

      const registration = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready

      // Lấy VAPID public key từ backend hoặc dùng key mặc định
      let vapidPublicKey = FALLBACK_VAPID_KEY
      try {
        const keyRes = await notificationService.getVapidKey()
        if (keyRes?.public_key) {
          vapidPublicKey = keyRes.public_key
        }
      } catch (e) {
        console.warn("Could not fetch VAPID key from backend, using fallback key", e)
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

      // Kiểm tra nếu đã có subscription thì tái sử dụng
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        })
      }

      await notificationService.subscribePush(subscription.toJSON())
      setIsSubscribed(true)
      toast.success("Bật thông báo đẩy thành công! Bạn sẽ nhận được biến động giá ngay khi có thay đổi.")
    } catch (error: any) {
      console.error("Error subscribing to push:", error)
      const errDetail = error?.message || "Lỗi không xác định khi kết nối dịch vụ thông báo."
      toast.error(`Không thể bật thông báo: ${errDetail}`)
    } finally {
      setLoadingPush(false)
    }
  }

  const unsubscribeFromPush = async () => {
    try {
      setLoadingPush(true)
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
      }
      setIsSubscribed(false)
      toast.success("Đã tắt thông báo đẩy trên thiết bị này.")
    } catch (error: any) {
      console.error("Error unsubscribing:", error)
      toast.error("Có lỗi xảy ra khi tắt thông báo.")
    } finally {
      setLoadingPush(false)
    }
  }

  const { data: alertsData, isLoading } = useQuery({
    queryKey: ["price-alerts"],
    queryFn: async () => {
      const res = await notificationService.getPriceAlerts()
      return res.data
    }
  })

  const { data: commoditiesData } = useQuery({
    queryKey: ["commodities-for-alerts"],
    queryFn: async () => {
      const res = await commodityService.getCommodities({ size: 100 })
      return res.data?.items || res.data || []
    }
  })

  const commoditiesList: any[] = Array.isArray(commoditiesData) ? commoditiesData : []
  const selectedCommodity = commoditiesList.find((c: any) => String(c.id) === String(selectedCommodityId))
  const currentSelectedPrice = Number(selectedCommodity?.current_price || selectedCommodity?.latest_price || 0)

  const createMutation = useMutation({
    mutationFn: (payload: { commodity_id: number; target_price: number; condition: string }) =>
      notificationService.createPriceAlert(payload),
    onSuccess: () => {
      toast.success("Đã tạo cảnh báo giá thành công!")
      setIsCreateOpen(false)
      setTargetPrice("")
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "Không thể tạo cảnh báo giá.")
    }
  })

  const toggleMutation = useMutation({
    mutationFn: (id: number) => notificationService.togglePriceAlert(id),
    onSuccess: (res: any) => {
      const active = res?.data?.is_active
      toast.success(active ? "Đã bật lại cảnh báo giá" : "Đã tạm dừng cảnh báo giá")
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] })
    },
    onError: () => {
      toast.error("Không thể cập nhật trạng thái cảnh báo")
    }
  })

  const evaluateMutation = useMutation({
    mutationFn: () => notificationService.evaluatePriceAlerts(),
    onSuccess: (res: any) => {
      const count = res?.data?.triggered_count ?? 0
      const msg = res?.message || (count > 0 ? `Đã phát hiện ${count} cảnh báo khớp giá!` : "Đã quét giá 2026: Chưa có cảnh báo mới vượt ngưỡng.")
      toast.success(msg)
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
    onError: () => {
      toast.error("Có lỗi khi quét giá thị trường")
    }
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => notificationService.deletePriceAlert(id),
    onSuccess: () => {
      toast.success("Đã xóa cảnh báo")
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] })
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa")
    }
  })

  const handleOpenCreateModal = () => {
    if (!selectedCommodityId && commoditiesList.length > 0) {
      const first = commoditiesList[0]
      setSelectedCommodityId(String(first.id))
      const price = Number(first.current_price || first.latest_price || 0)
      if (price > 0) {
        setTargetPrice(String(Math.round((price * 1.02) / 100) * 100))
      }
    }
    setIsCreateOpen(true)
  }

  const applyPresetPercent = (pct: number) => {
    if (currentSelectedPrice <= 0) return
    const nextPrice = Math.round((currentSelectedPrice * (1 + pct / 100)) / 100) * 100
    setTargetPrice(String(nextPrice))
    setCondition(pct >= 0 ? "above" : "below")
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cid = Number(selectedCommodityId)
    const price = Number(targetPrice)
    if (!cid || !price || price <= 0) {
      toast.error("Vui lòng chọn nông sản và nhập mức giá mục tiêu hợp lệ.")
      return
    }
    createMutation.mutate({
      commodity_id: cid,
      target_price: price,
      condition
    })
  }

  const items: any[] = alertsData?.data || alertsData || []

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-muted/20 md:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Section className="py-6 md:py-8 lg:py-10">
            <Container>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <PageTitle
                  title="Cảnh báo giá nông sản 2026"
                  description="Tự động theo dõi biến động thị trường và nhận thông báo ngay khi chạm ngưỡng mục tiêu."
                  className="pt-0 pb-0"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => evaluateMutation.mutate()}
                    disabled={evaluateMutation.isPending}
                    className="gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${evaluateMutation.isPending ? "animate-spin" : ""}`} />
                    {evaluateMutation.isPending ? "Đang quét giá..." : "Quét giá thị trường ngay"}
                  </Button>
                  <Button onClick={handleOpenCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tạo cảnh báo mới
                  </Button>
                </div>
              </div>

              {isPushSupported && (
                <div className="bg-card rounded-2xl border shadow-sm p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Thông báo trình duyệt</h4>
                      <p className="text-sm text-muted-foreground">
                        {isSubscribed 
                          ? "Trình duyệt này đã đăng ký nhận thông báo đẩy khi giá nông sản khớp cảnh báo."
                          : "Bật thông báo đẩy để nhận tin tức nông vụ và giá thị trường thời gian thực."}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush} 
                    disabled={loadingPush} 
                    variant={isSubscribed ? "outline" : "default"}
                    className="sm:w-auto shrink-0"
                  >
                    {loadingPush ? "Đang xử lý..." : isSubscribed ? "Tắt thông báo" : "Kích hoạt nhận tin"}
                  </Button>
                </div>
              )}

              <div className="bg-card rounded-2xl border shadow-sm p-6">
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Danh sách cảnh báo ({items.length})</h3>
                  </div>
                  {items.some((i: any) => i.is_triggered) && (
                    <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {items.filter((i: any) => i.is_triggered).length} cảnh báo đã khớp giá
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-44 w-full rounded-xl" />
                    ))
                  ) : items.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                      <BellRing className="w-12 h-12 mb-4 text-muted-foreground/30" />
                      <p className="font-medium text-foreground mb-1">Bạn chưa cài đặt cảnh báo giá nào.</p>
                      <p className="text-sm text-muted-foreground mb-4">Thiết lập mức giá mục tiêu để hệ thống tự động báo khi thị trường biến động.</p>
                      <div className="flex items-center gap-3">
                        <Button onClick={handleOpenCreateModal} className="gap-2">
                          <Plus className="w-4 h-4" />
                          Tạo cảnh báo đầu tiên
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/commodities">Khám phá thị trường</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    items.map((item: any) => {
                      const currentPrice = Number(item.commodity?.current_price || 0)
                      const isTriggered = Boolean(item.is_triggered)
                      const isActive = Boolean(item.is_active)

                      return (
                        <div
                          key={item.id}
                          className={`group border rounded-xl p-4 hover:shadow-md transition-all bg-background relative overflow-hidden flex flex-col justify-between ${
                            isTriggered
                              ? "border-emerald-500/50 bg-emerald-500/[0.02]"
                              : !isActive
                              ? "opacity-65 bg-muted/20"
                              : ""
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                  {item.commodity?.name?.charAt(0) || "N"}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold truncate">{item.commodity?.name || "Nông sản"}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    Giá hiện tại:{" "}
                                    <span className="font-semibold text-foreground">
                                      {currentPrice > 0 ? `${currentPrice.toLocaleString("vi-VN")} đ` : "Đang cập nhật"}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title={isActive ? "Tạm dừng cảnh báo" : "Bật lại cảnh báo"}
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  onClick={() => toggleMutation.mutate(item.id)}
                                  disabled={toggleMutation.isPending}
                                >
                                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Xóa cảnh báo"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                  onClick={() => removeMutation.mutate(item.id)}
                                  disabled={removeMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg mb-3 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {item.condition === "above" ? (
                                  <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />
                                )}
                                <span className="text-sm">
                                  {item.condition === "above" ? "Tăng vượt" : "Giảm chạm"}:{" "}
                                  <strong className="text-foreground">{Number(item.target_price).toLocaleString("vi-VN")} đ</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-border/50">
                            {!isActive ? (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                ĐÃ TẠM DỪNG
                              </Badge>
                            ) : isTriggered ? (
                              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20 text-[10px]">
                                ĐÃ KHỚP GIÁ
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">
                                ĐANG THEO DÕI
                              </Badge>
                            )}
                            <Link
                              href={`/commodities/${item.commodity_id}`}
                              className="text-xs text-primary font-medium flex items-center hover:underline"
                            >
                              Chi tiết giá <ArrowRight className="w-3.5 h-3.5 ml-1" />
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

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-primary" />
              Thiết lập cảnh báo giá mới
            </DialogTitle>
            <DialogDescription>
              Hệ thống sẽ tự động đối chiếu với bảng giá nông sản 2026 và gửi thông báo ngay khi đạt ngưỡng.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="commodity-select">Chọn mặt hàng nông sản</Label>
              <select
                id="commodity-select"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedCommodityId}
                onChange={(e) => {
                  const val = e.target.value
                  setSelectedCommodityId(val)
                  const found = commoditiesList.find((c: any) => String(c.id) === val)
                  const p = Number(found?.current_price || found?.latest_price || 0)
                  if (p > 0) {
                    setTargetPrice(String(Math.round((p * (condition === "above" ? 1.02 : 0.98)) / 100) * 100))
                  }
                }}
              >
                {commoditiesList.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {Number(c.current_price || c.latest_price || 0).toLocaleString("vi-VN")} đ/{c.unit || "kg"}
                  </option>
                ))}
              </select>
              {currentSelectedPrice > 0 && (
                <p className="text-xs text-muted-foreground">
                  Giá thị trường hiện tại:{" "}
                  <span className="font-semibold text-primary">
                    {currentSelectedPrice.toLocaleString("vi-VN")} đ/{selectedCommodity?.unit || "kg"}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Điều kiện kích hoạt</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition("above")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                    condition === "above"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-input hover:bg-muted/50"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Khi giá tăng vượt
                </button>
                <button
                  type="button"
                  onClick={() => setCondition("below")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                    condition === "below"
                      ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                      : "border-input hover:bg-muted/50"
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  Khi giá giảm chạm
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="target-price-input">Mức giá mục tiêu (VNĐ)</Label>
                {currentSelectedPrice > 0 && (
                  <div className="flex items-center gap-1">
                    {[-5, -2, 2, 5].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyPresetPercent(pct)}
                        className="text-[11px] px-1.5 py-0.5 rounded bg-muted hover:bg-primary/15 hover:text-primary font-medium transition-colors"
                      >
                        {pct > 0 ? `+${pct}%` : `${pct}%`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Input
                id="target-price-input"
                type="number"
                step="100"
                placeholder="VD: 130000"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Đang lưu..." : "Lưu cảnh báo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
