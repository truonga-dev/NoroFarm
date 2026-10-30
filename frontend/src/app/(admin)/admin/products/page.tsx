"use client"

import * as React from "react"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast-context"
import { shopService } from "@/api/services/shop.service"
import { apiClient, getAssetUrl } from "@/api/client"
import { cn } from "@/lib/utils"
import {
  AdminDataPanel,
  AdminEmptyState,
  AdminPageHeader,
} from "@/features/admin/components/admin-page"

// ============================================================
// Hằng số & kiểu dữ liệu
// ============================================================

const LOW_STOCK_THRESHOLD = 20
const MAX_IMAGE_SIZE_MB = 5
const NAME_MAX = 150
const DESCRIPTION_MAX = 2000
const UNIT_SUGGESTIONS = ["kg", "bao", "gói", "chai", "lít", "cái", "cuộn", "cây giống", "thùng", "hộp"]
const PAGE_SIZE_OPTIONS = [10, 20, 50]

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "name_asc", label: "Tên A → Z" },
  { value: "name_desc", label: "Tên Z → A" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "stock_asc", label: "Tồn kho ít nhất" },
  { value: "stock_desc", label: "Tồn kho nhiều nhất" },
]

type StatusFilter = "all" | "active" | "inactive"
type StockFilter = "all" | "in" | "low" | "out"

interface ProductFormState {
  category_id: string
  name: string
  description: string
  price: string
  stock: string
  unit: string
  image_url: string
  is_active: boolean
}

type FormErrors = Partial<Record<keyof ProductFormState, string>>

const EMPTY_FORM: ProductFormState = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  stock: "",
  unit: "kg",
  image_url: "",
  is_active: true,
}

const selectClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"

// ============================================================
// Tiện ích
// ============================================================

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

/** Chỉ giữ chữ số, dùng cho ô nhập giá & tồn kho */
const onlyDigits = (value: string) => value.replace(/\D/g, "")

/** Hiển thị số có dấu chấm phân cách hàng nghìn kiểu Việt Nam */
const formatThousands = (digits: string) =>
  digits ? Number(digits).toLocaleString("vi-VN") : ""

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "ellipsis")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push("ellipsis")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push("ellipsis")
  pages.push(total)
  return pages
}

function validateForm(form: ProductFormState): FormErrors {
  const errors: FormErrors = {}
  const name = form.name.trim()
  if (!name) errors.name = "Vui lòng nhập tên sản phẩm."
  else if (name.length < 3) errors.name = "Tên sản phẩm cần ít nhất 3 ký tự."
  else if (name.length > NAME_MAX) errors.name = `Tên sản phẩm tối đa ${NAME_MAX} ký tự.`

  if (!form.category_id) errors.category_id = "Vui lòng chọn danh mục."

  if (!form.price) errors.price = "Vui lòng nhập giá bán."
  else if (Number(form.price) <= 0) errors.price = "Giá bán phải lớn hơn 0."

  if (form.stock === "") errors.stock = "Vui lòng nhập số lượng tồn kho."

  if (!form.unit.trim()) errors.unit = "Vui lòng nhập đơn vị tính."

  if (form.description.length > DESCRIPTION_MAX)
    errors.description = `Mô tả tối đa ${DESCRIPTION_MAX} ký tự.`

  return errors
}

function StockBadge({ stock, unit }: { stock: number; unit: string }) {
  if (stock <= 0)
    return (
      <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-500">
        Hết hàng
      </span>
    )
  if (stock <= LOW_STOCK_THRESHOLD)
    return (
      <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
        Sắp hết · {stock.toLocaleString("vi-VN")} {unit}
      </span>
    )
  return (
    <span className="tabular-nums text-foreground">
      {stock.toLocaleString("vi-VN")} {unit}
    </span>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1 text-xs font-medium text-red-500">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

// ============================================================
// Trang chính
// ============================================================

export default function AdminProductsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  // --- Bộ lọc & phân trang ---
  const [searchInput, setSearchInput] = React.useState("")
  const search = useDebouncedValue(searchInput.trim())
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [stockFilter, setStockFilter] = React.useState<StockFilter>("all")
  const [sort, setSort] = React.useState("newest")
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // Mọi thay đổi bộ lọc đều đưa về trang 1
  React.useEffect(() => {
    setPage(1)
  }, [search, categoryFilter, statusFilter, stockFilter, sort, pageSize])

  const hasActiveFilters =
    searchInput !== "" ||
    categoryFilter !== "all" ||
    statusFilter !== "all" ||
    stockFilter !== "all" ||
    sort !== "newest"

  const resetFilters = () => {
    setSearchInput("")
    setCategoryFilter("all")
    setStatusFilter("all")
    setStockFilter("all")
    setSort("newest")
  }

  // --- Dữ liệu ---
  const { data: categoriesData } = useQuery({
    queryKey: ["shop-categories"],
    queryFn: () => shopService.getCategories(),
  })
  const categories: any[] = React.useMemo(() => categoriesData?.data || [], [categoriesData?.data])

  const queryParams = {
    page,
    size: pageSize,
    search: search || undefined,
    category_id: categoryFilter !== "all" ? Number(categoryFilter) : undefined,
    is_active: statusFilter === "all" ? undefined : statusFilter === "active",
    stock_status: stockFilter === "all" ? undefined : stockFilter,
    sort,
  }

  const { data: productsData, isLoading, isFetching, isError } = useQuery({
    queryKey: ["admin-products", queryParams],
    queryFn: () => shopService.adminGetProducts(queryParams),
    placeholderData: keepPreviousData,
  })

  const products: any[] = productsData?.data?.items || []
  const total: number = productsData?.data?.total ?? 0
  const totalPages: number = Math.max(1, productsData?.data?.pages ?? 1)
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  // Nếu xóa/lọc làm số trang giảm, tự lùi về trang hợp lệ
  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  // --- Form ---
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<any>(null)
  const [form, setForm] = React.useState<ProductFormState>(EMPTY_FORM)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const updateField = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const openCreate = () => {
    setEditingProduct(null)
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id ? String(categories[0].id) : "" })
    setErrors({})
    setIsDialogOpen(true)
  }

  const openEdit = (product: any) => {
    setEditingProduct(product)
    setForm({
      category_id: String(product.category_id ?? ""),
      name: product.name ?? "",
      description: product.description ?? "",
      price: String(Math.round(Number(product.price ?? 0))),
      stock: String(product.stock ?? 0),
      unit: product.unit ?? "kg",
      image_url: product.image_url ?? "",
      is_active: Boolean(product.is_active),
    })
    setErrors({})
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
    setErrors({})
  }

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    queryClient.invalidateQueries({ queryKey: ["shop-products"] })
  }

  const getErrorMessage = (err: any, fallback: string) =>
    err?.data?.detail || err?.response?.data?.detail || err?.message || fallback

  const createMutation = useMutation({
    mutationFn: (data: any) => shopService.adminCreateProduct(data),
    onSuccess: () => {
      toast.success("Đã thêm sản phẩm mới")
      closeDialog()
      invalidateProducts()
    },
    onError: (err: any) => toast.error(getErrorMessage(err, "Lỗi khi thêm sản phẩm")),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => shopService.adminUpdateProduct(id, data),
    onSuccess: () => {
      toast.success("Đã lưu thay đổi sản phẩm")
      closeDialog()
      invalidateProducts()
    },
    onError: (err: any) => toast.error(getErrorMessage(err, "Lỗi khi cập nhật sản phẩm")),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      shopService.adminUpdateProduct(id, { is_active }),
    onSuccess: (_res, vars) => {
      toast.success(vars.is_active ? "Đã mở bán sản phẩm" : "Đã ngừng bán sản phẩm")
      invalidateProducts()
    },
    onError: (err: any) => toast.error(getErrorMessage(err, "Không thể cập nhật trạng thái")),
  })

  const isSaving = createMutation.isPending || updateMutation.isPending

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = "" // cho phép chọn lại cùng một file
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh (JPG, PNG, WEBP).")
      return
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Ảnh vượt quá ${MAX_IMAGE_SIZE_MB}MB.`)
      return
    }

    const uploadData = new FormData()
    uploadData.append("file", file)
    setIsUploading(true)
    try {
      const res: any = await apiClient.post("/media/upload", uploadData)
      const uploadedUrl = res?.data?.url
      if (!uploadedUrl) throw new Error("Không nhận được đường dẫn ảnh")
      updateField("image_url", uploadedUrl)
      toast.success("Tải ảnh lên thành công")
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Lỗi khi tải ảnh lên"))
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateForm(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      toast.error("Vui lòng kiểm tra lại các trường được đánh dấu.")
      return
    }

    const payload = {
      category_id: Number(form.category_id),
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      stock: Number(form.stock),
      unit: form.unit.trim(),
      image_url: form.image_url.trim() || null,
      is_active: form.is_active,
    }

    if (editingProduct) updateMutation.mutate({ id: editingProduct.id, data: payload })
    else createMutation.mutate(payload)
  }

  // ============================================================
  // Giao diện
  // ============================================================

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Cửa hàng B2C"
        title="Kho sản phẩm"
        description="Quản lý danh mục, giá bán, tồn kho và trạng thái hiển thị sản phẩm."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        }
      />

      {/* ---------- Bộ lọc ---------- */}
      <div className="space-y-3 rounded-lg border bg-card p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
          <div className="relative md:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên sản phẩm..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Tìm kiếm sản phẩm"
            />
          </div>

          <select
            className={selectClassName}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Lọc theo danh mục"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className={selectClassName}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            aria-label="Lọc theo trạng thái"
          >
            <option value="all">Mọi trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
          </select>

          <select
            className={selectClassName}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as StockFilter)}
            aria-label="Lọc theo tồn kho"
          >
            <option value="all">Mọi mức tồn kho</option>
            <option value="in">Còn hàng (&gt; {LOW_STOCK_THRESHOLD})</option>
            <option value="low">Sắp hết (≤ {LOW_STOCK_THRESHOLD})</option>
            <option value="out">Hết hàng</option>
          </select>

          <select
            className={selectClassName}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sắp xếp"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-muted-foreground">
            {isLoading ? (
              "Đang tải dữ liệu..."
            ) : (
              <>
                Tìm thấy <span className="font-semibold text-foreground">{total.toLocaleString("vi-VN")}</span> sản phẩm
                {isFetching && <Loader2 className="ml-2 inline h-3.5 w-3.5 animate-spin text-primary" />}
              </>
            )}
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-muted-foreground">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* ---------- Bảng dữ liệu ---------- */}
      <AdminDataPanel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/50 font-medium text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap px-6 py-3.5">Sản phẩm</th>
                <th className="whitespace-nowrap px-6 py-3.5 text-right">Giá bán</th>
                <th className="whitespace-nowrap px-6 py-3.5">Tồn kho</th>
                <th className="whitespace-nowrap px-6 py-3.5">Trạng thái</th>
                <th className="whitespace-nowrap px-6 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y transition-opacity", isFetching && !isLoading && "opacity-60")}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4" colSpan={5}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3.5 w-1/3 animate-pulse rounded bg-muted" />
                          <div className="h-3 w-1/5 animate-pulse rounded bg-muted" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={5}>
                    <AdminEmptyState
                      title="Không tải được danh sách sản phẩm"
                      description="Vui lòng kiểm tra kết nối hoặc đăng nhập lại bằng tài khoản quản trị."
                    />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <AdminEmptyState
                      title={hasActiveFilters ? "Không có sản phẩm phù hợp" : "Chưa có sản phẩm"}
                      description={
                        hasActiveFilters
                          ? "Thử thay đổi từ khóa hoặc xóa bộ lọc để xem toàn bộ sản phẩm."
                          : "Thêm sản phẩm đầu tiên để bắt đầu vận hành cửa hàng."
                      }
                    />
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                          {item.image_url ? (
                            <img
                              src={getAssetUrl(item.image_url)}
                              className="h-full w-full object-cover"
                              alt={item.name}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                              }}
                            />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="max-w-[320px] truncate font-semibold text-foreground" title={item.name}>
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.category?.name || "Chưa phân loại"} · #{item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-right font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {Number(item.price).toLocaleString("vi-VN")} đ
                      <span className="ml-1 text-xs font-normal text-muted-foreground">/ {item.unit}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <StockBadge stock={Number(item.stock)} unit={item.unit} />
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleActiveMutation.mutate({ id: item.id, is_active: !item.is_active })}
                        disabled={toggleActiveMutation.isPending}
                        title={item.is_active ? "Bấm để ngừng bán" : "Bấm để mở bán"}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors disabled:opacity-50",
                          item.is_active
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                            : "border-border bg-muted text-muted-foreground hover:bg-muted/70"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            item.is_active ? "bg-emerald-500" : "bg-muted-foreground"
                          )}
                        />
                        {item.is_active ? "Đang bán" : "Ngừng bán"}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                        <Edit className="mr-1.5 h-4 w-4" /> Sửa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ---------- Phân trang ---------- */}
        {!isLoading && !isError && total > 0 && (
          <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <span>
                Hiển thị{" "}
                <span className="font-semibold text-foreground">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                / {total.toLocaleString("vi-VN")}
              </span>
              <label className="flex items-center gap-2">
                <span>Mỗi trang</span>
                <select
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <nav className="flex items-center gap-1" aria-label="Phân trang">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(1)}
                disabled={page <= 1}
                aria-label="Trang đầu"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers(page, totalPages).map((p, idx) =>
                p === "ellipsis" ? (
                  <span key={`e-${idx}`} className="px-1.5 text-muted-foreground">
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className="h-8 min-w-8 px-2.5 tabular-nums"
                    onClick={() => setPage(p)}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Trang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                aria-label="Trang cuối"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </AdminDataPanel>

      {/* ---------- Form thêm / sửa ---------- */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
        <DialogContent className="flex max-h-[92vh] w-[calc(100vw-2rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b px-6 py-4 text-left">
            <DialogTitle className="text-lg">
              {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? `Chỉnh sửa thông tin sản phẩm #${editingProduct.id}.`
                : "Điền thông tin bên dưới. Các trường có dấu * là bắt buộc."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overflow-x-hidden px-6 py-5">
              {/* Thông tin cơ bản */}
              <FormSection title="Thông tin cơ bản">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="product-name">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {form.name.length}/{NAME_MAX}
                    </span>
                  </div>
                  <Input
                    id="product-name"
                    value={form.name}
                    maxLength={NAME_MAX}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="VD: Phân bón NPK 20-20-15 bao 50kg"
                    aria-invalid={!!errors.name}
                    className={cn(errors.name && "border-red-500 focus-visible:ring-red-500")}
                  />
                  <FieldError message={errors.name} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0 space-y-1.5">
                    <Label htmlFor="product-category">
                      Danh mục <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="product-category"
                      className={cn(selectClassName, errors.category_id && "border-red-500")}
                      value={form.category_id}
                      onChange={(e) => updateField("category_id", e.target.value)}
                      aria-invalid={!!errors.category_id}
                    >
                      <option value="" disabled>
                        {categories.length === 0 ? "Chưa có danh mục" : "-- Chọn danh mục --"}
                      </option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.category_id} />
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <Label>Trạng thái hiển thị</Label>
                    <div className="grid h-10 grid-cols-2 rounded-md border border-input bg-muted/30 p-1">
                      {[
                        { value: true, label: "Đang bán" },
                        { value: false, label: "Ngừng bán" },
                      ].map((opt) => (
                        <button
                          key={String(opt.value)}
                          type="button"
                          onClick={() => updateField("is_active", opt.value)}
                          className={cn(
                            "rounded text-xs font-semibold transition-colors",
                            form.is_active === opt.value
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          aria-pressed={form.is_active === opt.value}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* Giá & tồn kho */}
              <FormSection title="Giá bán & tồn kho">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="min-w-0 space-y-1.5">
                    <Label htmlFor="product-price">
                      Giá bán <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="product-price"
                        inputMode="numeric"
                        value={formatThousands(form.price)}
                        onChange={(e) => updateField("price", onlyDigits(e.target.value).slice(0, 12))}
                        placeholder="0"
                        className={cn("pr-12 text-right tabular-nums", errors.price && "border-red-500")}
                        aria-invalid={!!errors.price}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        VNĐ
                      </span>
                    </div>
                    <FieldError message={errors.price} />
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <Label htmlFor="product-stock">
                      Tồn kho <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="product-stock"
                      inputMode="numeric"
                      value={formatThousands(form.stock)}
                      onChange={(e) => updateField("stock", onlyDigits(e.target.value).slice(0, 9))}
                      placeholder="0"
                      className={cn("text-right tabular-nums", errors.stock && "border-red-500")}
                      aria-invalid={!!errors.stock}
                    />
                    <FieldError message={errors.stock} />
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <Label htmlFor="product-unit">
                      Đơn vị tính <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="product-unit"
                      list="product-unit-options"
                      value={form.unit}
                      maxLength={30}
                      onChange={(e) => updateField("unit", e.target.value)}
                      placeholder="kg, bao, chai..."
                      className={cn(errors.unit && "border-red-500")}
                      aria-invalid={!!errors.unit}
                    />
                    <datalist id="product-unit-options">
                      {UNIT_SUGGESTIONS.map((u) => (
                        <option key={u} value={u} />
                      ))}
                    </datalist>
                    <FieldError message={errors.unit} />
                  </div>
                </div>
                {form.price && form.unit && (
                  <p className="text-xs text-muted-foreground">
                    Hiển thị trên cửa hàng:{" "}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatThousands(form.price)} đ / {form.unit}
                    </span>
                  </p>
                )}
              </FormSection>

              {/* Hình ảnh */}
              <FormSection
                title="Hình ảnh sản phẩm"
                description={`Ảnh vuông, tối đa ${MAX_IMAGE_SIZE_MB}MB (JPG, PNG, WEBP).`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="group relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-input bg-muted/30 transition-colors hover:border-primary/60 hover:bg-muted/50 disabled:cursor-wait"
                    aria-label="Chọn ảnh sản phẩm"
                  >
                    {form.image_url ? (
                      <>
                        <img
                          src={getAssetUrl(form.image_url)}
                          alt="Xem trước"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                          Đổi ảnh
                        </span>
                      </>
                    ) : (
                      <span className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : (
                          <ImagePlus className="h-6 w-6" />
                        )}
                        {isUploading ? "Đang tải..." : "Chọn ảnh"}
                      </span>
                    )}
                    {isUploading && form.image_url && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </span>
                    )}
                  </button>

                  <div className="min-w-0 flex-1 space-y-2">
                    <Label htmlFor="product-image-url" className="text-xs text-muted-foreground">
                      Hoặc dán đường dẫn ảnh
                    </Label>
                    <Input
                      id="product-image-url"
                      value={form.image_url}
                      onChange={(e) => updateField("image_url", e.target.value)}
                      placeholder="https://... hoặc /uploads/..."
                      className="text-xs"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="mr-1.5 h-3.5 w-3.5" />
                        Tải ảnh từ máy
                      </Button>
                      {form.image_url && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateField("image_url", "")}
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Xóa ảnh
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* Mô tả */}
              <FormSection title="Mô tả chi tiết">
                <div className="space-y-1.5">
                  <textarea
                    id="product-description"
                    rows={5}
                    maxLength={DESCRIPTION_MAX}
                    className={cn(
                      "w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring",
                      errors.description && "border-red-500"
                    )}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Thành phần, công dụng, cách sử dụng, lưu ý bảo quản..."
                  />
                  <div className="flex items-center justify-between">
                    <FieldError message={errors.description} />
                    <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                      {form.description.length}/{DESCRIPTION_MAX}
                    </span>
                  </div>
                </div>
              </FormSection>
            </div>

            {/* Footer cố định */}
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSaving}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSaving || isUploading} className="min-w-[140px]">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
