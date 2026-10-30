'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Package, Search, ShoppingCart } from 'lucide-react'

import { getAssetUrl } from '@/api/client'
import { shopService } from '@/api/services/shop.service'
import { DataState } from '@/components/data-display/data-state'
import { PageTitle } from '@/components/layout/page-title'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast-context'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/useCartStore'

export default function ShopPage() {
  const router = useRouter()
  const toast = useToast()
  const { isAuthenticated, user } = useAuthStore()
  const addItem = useCartStore((state) => state.addItem)
  const cartItemCount = useCartStore((state) => state.getItemCount())
  const cartTotal = useCartStore((state) => state.getTotal())

  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<number | undefined>()
  const [sortBy, setSortBy] = React.useState('default')
  const [farmArea, setFarmArea] = React.useState('1')

  const { data: categoriesData } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: () => shopService.getCategories(),
  })

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['shop-products', search, category],
    queryFn: () =>
      shopService.getProducts({
        page: 1,
        size: 40,
        search: search || undefined,
        category_id: category,
      }),
  })

  const categories: any[] = categoriesData?.data || []
  const products = React.useMemo(() => {
    const rawProducts: any[] = productsData?.data?.items || []
    return [...rawProducts].sort((a, b) => {
      if (sortBy === 'price_asc')
        return Number(a.price || 0) - Number(b.price || 0)
      if (sortBy === 'price_desc')
        return Number(b.price || 0) - Number(a.price || 0)
      if (sortBy === 'in_stock')
        return Number(b.stock || 0) - Number(a.stock || 0)
      return 0
    })
  }, [productsData, sortBy])

  const area = Math.max(0.1, Number(farmArea) || 1)

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated || !user) {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.')
      router.push('/login?redirect=/shop')
      return
    }
    if (product.stock <= 0) {
      toast.error('Sản phẩm hiện đã hết hàng.')
      return
    }
    addItem(product, 1)
    toast.success(`Đã thêm ${product.name} vào giỏ hàng.`)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-4 pb-14 sm:px-6 lg:px-8">
      <div className="border-border flex flex-col gap-5 border-b pb-7 md:flex-row md:items-end md:justify-between">
        <PageTitle
          title="Cửa hàng vật tư nông nghiệp"
          description="Phân bón, hạt giống và vật tư phục vụ sản xuất, trình bày rõ giá bán và lượng hàng còn lại."
          className="pb-0"
        />
        <Button
          asChild
          variant="outline"
          className="h-11 shrink-0 justify-between gap-4 md:min-w-52"
        >
          <Link
            href={
              isAuthenticated && user
                ? '/checkout'
                : '/login?redirect=/checkout'
            }
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Giỏ hàng ({isAuthenticated && user ? cartItemCount : 0})
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <section
        className="border-border bg-card rounded-xl border p-4 md:p-5"
        aria-labelledby="material-estimator"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 id="material-estimator" className="font-semibold">
              Ước tính vật tư theo diện tích
            </h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              Số liệu mang tính tham khảo ban đầu. Định mức thực tế còn phụ
              thuộc cây trồng, đất và giai đoạn sinh trưởng.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 text-sm font-medium">
              Diện tích (ha)
              <Input
                type="number"
                min="0.1"
                step="0.5"
                value={farmArea}
                onChange={(event) => setFarmArea(event.target.value)}
                className="h-9 w-24"
              />
            </label>
            <div className="bg-muted/60 grid grid-cols-2 gap-4 rounded-lg px-4 py-2.5 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">
                  NPK loại 50 kg
                </span>
                <strong>
                  {Math.round(area * 12)}–{Math.round(area * 16)} bao
                </strong>
              </div>
              <div className="border-border border-l pl-4">
                <span className="text-muted-foreground block text-xs">
                  Hữu cơ vi sinh
                </span>
                <strong>
                  {Math.round(area * 25)}–{Math.round(area * 35)} bao
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5" aria-label="Danh sách sản phẩm">
        <div className="border-border bg-card grid gap-3 rounded-xl border p-3 md:grid-cols-[minmax(260px,1fr)_auto_auto]">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm phân bón, hạt giống, dụng cụ..."
              className="pl-9"
            />
          </div>
          <select
            value={category ?? 'all'}
            onChange={(event) =>
              setCategory(
                event.target.value === 'all'
                  ? undefined
                  : Number(event.target.value)
              )
            }
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
            aria-label="Danh mục sản phẩm"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
            aria-label="Sắp xếp sản phẩm"
          >
            <option value="default">Sắp xếp mặc định</option>
            <option value="price_asc">Giá thấp đến cao</option>
            <option value="price_desc">Giá cao đến thấp</option>
            <option value="in_stock">Ưu tiên còn hàng</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            {isLoading ? 'Đang tải sản phẩm...' : `${products.length} sản phẩm`}
          </p>
          {isAuthenticated && user && cartItemCount > 0 && (
            <Link
              href="/checkout"
              className="text-primary font-semibold hover:underline"
            >
              Xem giỏ hàng · {cartTotal.toLocaleString('vi-VN')} đ
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="border-border bg-card overflow-hidden rounded-xl border"
              >
                <div className="bg-muted aspect-[4/3] animate-pulse" />
                <div className="space-y-3 p-4">
                  <div className="bg-muted h-3 w-20 animate-pulse" />
                  <div className="bg-muted h-5 w-4/5 animate-pulse" />
                  <div className="bg-muted h-9 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <DataState
            icon={<Package className="h-5 w-5" />}
            title="Chưa thể tải danh sách sản phẩm"
            description="Kết nối tới cửa hàng đang gặp sự cố. Bạn có thể thử tải lại."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Tải lại
              </Button>
            }
          />
        ) : products.length === 0 ? (
          <DataState
            icon={<Package className="h-5 w-5" />}
            title="Không tìm thấy sản phẩm"
            description="Hãy thử từ khóa khác hoặc chọn lại danh mục."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group border-border bg-card flex overflow-hidden rounded-xl border"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/shop/${product.id}`}
                    className="bg-muted relative block aspect-[4/3] overflow-hidden"
                  >
                    {product.image_url ? (
                      <img
                        src={getAssetUrl(product.image_url)}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="text-muted-foreground/35 h-10 w-10" />
                      </div>
                    )}
                    <span
                      className={`absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-semibold ${product.stock > 0 ? 'bg-background/90 text-foreground' : 'bg-destructive text-destructive-foreground'}`}
                    >
                      {product.stock > 0
                        ? `Còn ${product.stock} ${product.unit}`
                        : 'Hết hàng'}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-muted-foreground text-xs font-medium">
                      {product.category?.name || 'Vật tư nông nghiệp'}
                    </p>
                    <Link
                      href={`/shop/${product.id}`}
                      className="hover:text-primary mt-1 line-clamp-2 leading-6 font-semibold"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <strong className="text-primary block text-lg">
                          {Number(product.price).toLocaleString('vi-VN')} đ
                        </strong>
                        <span className="text-muted-foreground text-xs">
                          mỗi {product.unit}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        aria-label={`Thêm ${product.name} vào giỏ`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="ml-2">Thêm</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
