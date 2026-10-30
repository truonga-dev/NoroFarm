'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Package, Trash2 } from 'lucide-react'

import { shopService } from '@/api/services/shop.service'
import { DataState } from '@/components/data-display/data-state'
import { PageTitle } from '@/components/layout/page-title'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast-context'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/useCartStore'

type PaymentMethod = 'COD' | 'STRIPE' | 'BANK_TRANSFER'

export default function CheckoutPage() {
  const router = useRouter()
  const toast = useToast()
  const { isAuthenticated, user } = useAuthStore()
  const { items, updateQuantity, removeItem, getTotal, clearCart } =
    useCartStore()

  const [shippingMethod, setShippingMethod] = React.useState<
    'standard' | 'express'
  >('standard')
  const [formData, setFormData] = React.useState({
    shipping_address: '',
    contact_phone: '',
    notes: '',
    payment_method: 'COD' as PaymentMethod,
  })

  const subtotal = getTotal()
  const shippingFee = shippingMethod === 'standard' ? 30000 : 50000
  const total = subtotal + shippingFee

  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.info('Vui lòng đăng nhập để tiến hành thanh toán.')
      router.replace('/login?redirect=/checkout')
    }
  }, [isAuthenticated, user, router, toast])

  const createOrderMutation = useMutation({
    mutationFn: (payload: any) => shopService.createOrder(payload),
    onSuccess: async (response: any) => {
      const order = response.data
      if (formData.payment_method === 'STRIPE') {
        toast.info('Đang chuyển tới cổng thanh toán Stripe...')
        try {
          const stripeResponse = await shopService.createStripeSession(order.id)
          const sessionUrl = stripeResponse.data?.session_url
          if (!sessionUrl) {
            toast.error('Không nhận được liên kết thanh toán từ Stripe.')
            return
          }
          clearCart()
          window.location.href = sessionUrl
        } catch {
          toast.error('Không thể khởi tạo phiên thanh toán Stripe.')
        }
        return
      }
      toast.success('Đặt hàng thành công.')
      clearCart()
      router.push('/dashboard/orders')
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail ||
          error.message ||
          'Không thể đặt hàng. Vui lòng thử lại.'
      )
    },
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (items.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống.')
      return
    }
    createOrderMutation.mutate({
      ...formData,
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    })
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <DataState
          icon={<Package className="h-5 w-5" />}
          title="Giỏ hàng đang trống"
          description="Bạn chưa chọn sản phẩm nào. Hãy quay lại cửa hàng để xem các vật tư đang có."
          action={
            <Button asChild>
              <Link href="/shop">Xem cửa hàng</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
      <div className="border-border border-b pb-7">
        <Link
          href="/shop"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 pt-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại cửa hàng
        </Link>
        <PageTitle
          title="Thanh toán đơn hàng"
          description="Kiểm tra sản phẩm, chọn cách giao hàng và điền thông tin người nhận."
          className="pt-5 pb-0"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-7 pt-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start"
      >
        <div className="space-y-6">
          <section
            className="border-border bg-card rounded-xl border"
            aria-labelledby="cart-heading"
          >
            <div className="border-border border-b px-5 py-4">
              <h2 id="cart-heading" className="font-semibold">
                Sản phẩm ({items.length})
              </h2>
            </div>
            <div className="divide-border divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center sm:p-5"
                >
                  <div className="border-border bg-muted h-14 w-14 overflow-hidden rounded-lg border sm:h-16 sm:w-16">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="text-muted-foreground/50 h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold sm:text-base">
                      {item.name}
                    </h3>
                    <p className="text-primary mt-1 text-sm">
                      {Number(item.price).toLocaleString('vi-VN')} đ /{' '}
                      {item.unit}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Tối đa {item.stock} {item.unit}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:justify-end">
                    <div className="border-input flex items-center rounded-md border">
                      <button
                        type="button"
                        className="hover:bg-muted h-9 w-9 text-sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label={`Giảm số lượng ${item.name}`}
                      >
                        −
                      </button>
                      <span className="w-9 text-center text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="hover:bg-muted h-9 w-9 text-sm disabled:opacity-40"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        aria-label={`Tăng số lượng ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Xóa ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            className="border-border bg-card rounded-xl border p-5"
            aria-labelledby="delivery-heading"
          >
            <h2 id="delivery-heading" className="font-semibold">
              Thông tin nhận hàng
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Số điện thoại *</Label>
                <Input
                  id="contact-phone"
                  required
                  type="tel"
                  autoComplete="tel"
                  value={formData.contact_phone}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      contact_phone: event.target.value,
                    })
                  }
                  placeholder="Ví dụ: 0901 234 567"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="shipping-address">Địa chỉ nhận hàng *</Label>
                <textarea
                  id="shipping-address"
                  required
                  rows={3}
                  autoComplete="street-address"
                  value={formData.shipping_address}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      shipping_address: event.target.value,
                    })
                  }
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="order-notes">Ghi chú</Label>
                <Input
                  id="order-notes"
                  value={formData.notes}
                  onChange={(event) =>
                    setFormData({ ...formData, notes: event.target.value })
                  }
                  placeholder="Ví dụ: Gọi trước khi giao"
                />
              </div>
            </div>
          </section>

          <section
            className="border-border bg-card rounded-xl border p-5"
            aria-labelledby="shipping-heading"
          >
            <h2 id="shipping-heading" className="font-semibold">
              Phương thức giao hàng
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    id: 'standard',
                    title: 'Giao hàng tiêu chuẩn',
                    detail: 'Dự kiến 2–3 ngày',
                    fee: 30000,
                  },
                  {
                    id: 'express',
                    title: 'Giao hàng nhanh',
                    detail: 'Dự kiến trong ngày',
                    fee: 50000,
                  },
                ] as const
              ).map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${shippingMethod === method.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <input
                    type="radio"
                    name="shipping-method"
                    checked={shippingMethod === method.id}
                    onChange={() => setShippingMethod(method.id)}
                    className="accent-primary mt-1"
                  />
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm">{method.title}</strong>
                    <span className="text-muted-foreground mt-1 block text-xs">
                      {method.detail}
                    </span>
                  </span>
                  <strong className="text-sm">
                    {method.fee.toLocaleString('vi-VN')} đ
                  </strong>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <section
            className="border-border bg-card rounded-xl border p-5"
            aria-labelledby="payment-heading"
          >
            <h2 id="payment-heading" className="font-semibold">
              Phương thức thanh toán
            </h2>
            <div className="mt-4 space-y-2">
              {(
                [
                  {
                    id: 'COD',
                    title: 'Thanh toán khi nhận hàng',
                    detail: 'Thanh toán trực tiếp cho đơn vị giao hàng',
                  },
                  {
                    id: 'STRIPE',
                    title: 'Thẻ qua Stripe',
                    detail: 'Chuyển sang cổng Stripe sau khi tạo đơn',
                  },
                  {
                    id: 'BANK_TRANSFER',
                    title: 'Chuyển khoản ngân hàng',
                    detail: 'Quét mã VietQR theo tổng đơn hàng',
                  },
                ] as const
              ).map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-3.5 ${formData.payment_method === method.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={formData.payment_method === method.id}
                    onChange={() =>
                      setFormData({ ...formData, payment_method: method.id })
                    }
                    className="accent-primary mt-1"
                  />
                  <span>
                    <strong className="block text-sm">{method.title}</strong>
                    <span className="text-muted-foreground mt-1 block text-xs leading-5">
                      {method.detail}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {formData.payment_method === 'BANK_TRANSFER' && (
              <div className="border-border bg-muted/40 mt-4 rounded-lg border p-4 text-sm">
                <img
                  src={`https://img.vietqr.io/image/MB-190288889999-compact2.png?amount=${total}&addInfo=${encodeURIComponent(`NOROFARM ${formData.contact_phone || 'SDT'}`)}&accountName=${encodeURIComponent('CONG TY CO PHAN NOROFARM')}`}
                  alt="Mã VietQR thanh toán NoroFarm"
                  className="mx-auto mb-4 w-44 rounded-md bg-white p-2"
                />
                <dl className="grid grid-cols-[100px_1fr] gap-y-2">
                  <dt className="text-muted-foreground">Ngân hàng</dt>
                  <dd className="font-medium">MB Bank</dd>
                  <dt className="text-muted-foreground">Số tài khoản</dt>
                  <dd className="font-semibold">1902 8888 9999</dd>
                  <dt className="text-muted-foreground">Chủ tài khoản</dt>
                  <dd className="font-medium">CONG TY CO PHAN NOROFARM</dd>
                  <dt className="text-muted-foreground">Nội dung</dt>
                  <dd className="font-semibold">
                    NOROFARM {formData.contact_phone || 'SĐT'}
                  </dd>
                </dl>
              </div>
            )}
          </section>

          <section
            className="border-border bg-card rounded-xl border p-5"
            aria-labelledby="summary-heading"
          >
            <h2 id="summary-heading" className="font-semibold">
              Tóm tắt đơn hàng
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Tiền hàng</dt>
                <dd className="font-medium">
                  {subtotal.toLocaleString('vi-VN')} đ
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Phí giao hàng</dt>
                <dd className="font-medium">
                  {shippingFee.toLocaleString('vi-VN')} đ
                </dd>
              </div>
              <div className="border-border flex justify-between gap-4 border-t pt-4 text-base">
                <dt className="font-semibold">Tổng thanh toán</dt>
                <dd className="text-primary text-xl font-bold">
                  {total.toLocaleString('vi-VN')} đ
                </dd>
              </div>
            </dl>
            <Button
              type="submit"
              className="mt-5 h-11 w-full"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? 'Đang xử lý...' : 'Đặt hàng'}
            </Button>
            <p className="text-muted-foreground mt-3 text-xs leading-5">
              Bằng việc đặt hàng, bạn xác nhận thông tin nhận hàng và số lượng
              sản phẩm là chính xác.
            </p>
          </section>
        </aside>
      </form>
    </div>
  )
}
