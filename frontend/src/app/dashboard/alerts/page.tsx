"use client"

import { useState, useEffect } from "react"
import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Sidebar } from "@/components/layout/sidebar"
import { PageTitle } from "@/components/layout/page-title"
import { Bell, BellRing, Trash2, ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationService } from "@/api/services/notification.service"
import { useToast } from "@/components/ui/toast-context"
import Link from "next/link"

export default function AlertsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  const [isPushSupported, setIsPushSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loadingPush, setLoadingPush] = useState(false)

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

  const items: any[] = alertsData?.data || alertsData || []

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <Section className="py-6 md:py-8 lg:py-10">
            <Container>
              <div className="flex flex-col gap-4 mb-8">
                <PageTitle
                  title="Cảnh báo giá"
                  description="Quản lý danh sách các cảnh báo giá nông sản."
                  className="pt-0 pb-0"
                />
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
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Cảnh báo đang bật ({items.length})</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-36 w-full rounded-xl" />
                    ))
                  ) : items.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                      <BellRing className="w-12 h-12 mb-4 text-muted-foreground/30" />
                      <p>Bạn chưa cài đặt cảnh báo giá nào.</p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href="/market">Khám phá thị trường</Link>
                      </Button>
                    </div>
                  ) : (
                    items.map((item: any) => (
                      <div key={item.id} className="group border rounded-xl p-4 hover:shadow-md transition-all bg-background relative overflow-hidden flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {item.commodity?.name?.charAt(0) || "N"}
                            </div>
                            <div>
                              <h4 className="font-bold truncate">{item.commodity?.name || "Nông sản"}</h4>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => removeMutation.mutate(item.id)}
                            disabled={removeMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg mb-4 flex items-center gap-2">
                          {item.condition === 'above' ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            Khi giá {item.condition === 'above' ? 'tăng qua' : 'giảm xuống'}: <strong className="text-foreground">{item.target_price.toLocaleString("vi-VN")} đ</strong>
                          </span>
                        </div>
                        <div className="flex justify-end">
                          <Link href={`/commodities/${item.commodity_id}`} className="text-sm text-primary font-medium flex items-center hover:underline">
                            Xem nông sản <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))
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
