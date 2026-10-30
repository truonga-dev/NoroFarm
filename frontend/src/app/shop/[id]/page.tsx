'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Minus, Package, Plus, ShoppingCart } from 'lucide-react'

import { getAssetUrl } from '@/api/client'
import { shopService } from '@/api/services/shop.service'
import { DataState } from '@/components/data-display/data-state'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast-context'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/useCartStore'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const toast = useToast()
  const { isAuthenticated, user } = useAuthStore()
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = React.useState(1)
  const productId = Number(id)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['shop-product', productId],
    queryFn: () => shopService.getProductById(productId),
    enabled: Number.isFinite(productId),
  })
  const product = data?.data

  const validatePurchase = () => {
    if (!isAuthenticated || !user) {
      toast.info('Vui lòng đăng nhập để mua sản phẩm.')
      router.push(`/login?redirect=/shop/${productId}`)
      return false
    }
    if (!product || product.stock <= 0) {
      toast.error('Sản phẩm hiện đã hết hàng.')
      return false
    }
    if (quantity > product.stock) {
      toast.error(
        `Số lượng vượt quá tồn kho hiện tại (${product.stock} ${product.unit}).`
      )
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    if (!validatePurchase() || !product) return
    addItem(product, quantity)
    toast.success(
      `Đã thêm ${quantity} ${product.unit} ${product.name} vào giỏ hàng.`
    )
  }

  const handleBuyNow = () => {
    if (!validatePurchase() || !product) return
    addItem(product, quantity)
    router.push('/checkout')
  }

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="bg-muted mb-6 h-5 w-36 animate-pulse rounded" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-muted aspect-[4/3] animate-pulse rounded-xl" />
          <div className="space-y-5 py-2">
            <div className="bg-muted h-4 w-28 animate-pulse rounded" />
            <div className="bg-muted h-10 w-4/5 animate-pulse rounded" />
            <div className="bg-muted h-20 animate-pulse rounded" />
            <div className="bg-muted h-28 animate-pulse rounded" />
          </div>
        </div>
      </Container>
    )
  }

  if (isError || !product) {
    return (
      <Container className="py-12">
        <DataState
          icon={<Package className="h-5 w-5" />}
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm có thể không còn được bán hoặc dữ liệu tạm thời chưa tải được."
          action={
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/shop">Về cửa hàng</Link>
              </Button>
              {isError && <Button onClick={() => refetch()}>Thử lại</Button>}
            </div>
          }
        />
      </Container>
    )
  }

  const inStock = product.stock > 0

  return (
    <Container className="pt-6 pb-14 md:pt-8">
      <Link
        href="/shop"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại cửa hàng
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-12">
        <div className="border-border bg-muted overflow-hidden rounded-xl border">
          <div className="relative aspect-[4/3]">
            {product.image_url ? (
              <img
                src={getAssetUrl(product.image_url)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="text-muted-foreground/30 h-20 w-20" />
              </div>
            )}
            {!inStock && (
              <div className="bg-background/80 absolute inset-0 flex items-center justify-center">
                <span className="bg-destructive text-destructive-foreground rounded-md px-3 py-2 text-sm font-semibold">
                  Sản phẩm đã hết hàng
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="border-border border-b pb-6">
            <p className="text-primary text-sm font-semibold">
              {product.category?.name || 'Vật tư nông nghiệp'}
            </p>
            <h1 className="mt-2 text-3xl leading-tight font-bold tracking-[-0.025em] md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <strong className="text-primary text-3xl">
                {Number(product.price).toLocaleString('vi-VN')} đ
              </strong>
              <span className="text-muted-foreground text-sm">
                mỗi {product.unit}
              </span>
            </div>
            <p
              className={`mt-3 text-sm font-medium ${inStock ? 'text-emerald-700 dark:text-emerald-400' : 'text-destructive'}`}
            >
              {inStock
                ? `Còn ${product.stock} ${product.unit} trong kho`
                : 'Tạm hết hàng'}
            </p>
          </div>

          <section
            className="border-border border-b py-6"
            aria-labelledby="product-description"
          >
            <h2
              id="product-description"
              className="text-sm font-semibold tracking-wide uppercase"
            >
              Thông tin sản phẩm
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-7 whitespace-pre-line">
              {product.description ||
                'Sản phẩm hiện chưa có mô tả chi tiết. Vui lòng liên hệ NoroFarm nếu bạn cần thêm thông tin trước khi đặt hàng.'}
            </p>
          </section>

          <div className="mt-auto pt-6">
            {inStock && (
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Số lượng</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Đơn vị: {product.unit}
                  </p>
                </div>
                <div className="border-input flex items-center rounded-md border">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    disabled={quantity <= 1}
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={() =>
                      setQuantity((value) => Math.min(product.stock, value + 1))
                    }
                    disabled={quantity >= product.stock}
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {quantity > 1 && inStock && (
              <div className="bg-muted/60 mb-5 flex justify-between rounded-lg px-4 py-3 text-sm">
                <span className="text-muted-foreground">
                  Tạm tính {quantity} {product.unit}
                </span>
                <strong>
                  {(Number(product.price) * quantity).toLocaleString('vi-VN')} đ
                </strong>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="h-11"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Thêm vào giỏ
              </Button>
              <Button
                className="h-11"
                onClick={handleBuyNow}
                disabled={!inStock}
              >
                Mua ngay
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-xs leading-5">
              Phí và thời gian giao hàng được xác định ở bước thanh toán. Hãy
              kiểm tra đúng số lượng trước khi đặt hàng.
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
