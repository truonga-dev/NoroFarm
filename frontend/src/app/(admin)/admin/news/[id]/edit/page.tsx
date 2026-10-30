"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { newsService } from "@/api/services/news.service"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useToast } from "@/components/ui/toast-context"
import { AdminPageHeader } from "@/features/admin/components/admin-page"

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề bài viết"),
  summary: z.string().optional(),
  content: z.string().min(1, "Vui lòng nhập nội dung bài viết"),
  thumbnail_url: z.string().optional(),
  category_id: z.coerce.number().optional(),
  is_published: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const queryClient = useQueryClient()
  const toast = useToast()
  const [isUploading, setIsUploading] = React.useState(false)

  const { data: categoriesData } = useQuery({
    queryKey: ["news-categories"],
    queryFn: async () => {
      const res = await newsService.getCategories()
      return res?.data?.data || res?.data || []
    }
  })

  const categories = React.useMemo(() => {
    return Array.isArray(categoriesData) ? categoriesData : []
  }, [categoriesData])

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const contentValue = watch("content")

  // Fetch article by ID
  const { data: articleData, isLoading: isLoadingArticle } = useQuery({
    queryKey: ["admin-news-detail", id],
    queryFn: async () => {
      try {
        const res = await newsService.getArticleById(Number(id))
        return res?.data?.data || res?.data || res
      } catch {
        // Fallback: search in articles list
        const res = await newsService.getArticles({ size: 100 })
        const list = res?.data?.items || res?.items || []
        return list.find((a: any) => a.id === Number(id)) || null
      }
    },
    enabled: Boolean(id)
  })

  React.useEffect(() => {
    if (articleData) {
      reset({
        title: articleData.title || "",
        summary: articleData.summary || "",
        content: articleData.content || "",
        thumbnail_url: articleData.thumbnail_url || "",
        category_id: articleData.category_id || (categories[0]?.id ?? 1),
        is_published: Boolean(articleData.is_published),
      })
    }
  }, [articleData, categories, reset])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const res = await newsService.uploadImage(file)
      const url = (process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '') + (res?.data?.url || res?.url || '')
      setValue("thumbnail_url", url)
      toast.success("Tải ảnh lên thành công")
    } catch {
      toast.error("Lỗi khi tải ảnh lên")
    } finally {
      setIsUploading(false)
    }
  }

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload: any = {
        title: data.title.trim(),
        summary: data.summary?.trim() || undefined,
        content: data.content,
        thumbnail_url: data.thumbnail_url?.trim() || undefined,
        category_id: data.category_id ? Number(data.category_id) : undefined,
        is_published: Boolean(data.is_published),
      }
      return newsService.updateArticle(Number(id), payload)
    },
    onSuccess: () => {
      toast.success("Cập nhật bài viết thành công")
      queryClient.invalidateQueries({ queryKey: ["admin-news-list"] })
      queryClient.invalidateQueries({ queryKey: ["admin-news-detail", id] })
      router.push("/admin/news")
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || "Lỗi khi cập nhật bài viết"
      toast.error(msg)
    }
  })

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(data)
  }

  if (isLoadingArticle) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <AdminPageHeader
        eyebrow="Biên tập nội dung"
        title="Sửa bài viết"
        description="Cập nhật nội dung, ảnh bìa và trạng thái xuất bản."
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/news">
              <ArrowLeft className="mr-2 h-4 w-4" />Danh sách bài viết
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border bg-card p-4 shadow-sm sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Tiêu đề bài viết <span className="text-red-500">*</span></Label>
          <Input id="title" placeholder="Nhập tiêu đề..." {...register("title")} />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category_id">Chuyên mục</Label>
            <select
              id="category_id"
              {...register("category_id")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              {categories.length === 0 && (
                <option value={1}>Chuyên mục chung</option>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Tóm tắt ngắn</Label>
            <Input id="summary" placeholder="Đoạn mô tả ngắn..." {...register("summary")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ảnh bìa</Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input {...register("thumbnail_url")} placeholder="Nhập URL ảnh bìa hoặc tải lên..." className="flex-1" />
            <Label htmlFor="image-upload" className="cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {isUploading ? "Đang tải..." : "Tải lên"}
            </Label>
            <input 
              type="file" 
              id="image-upload" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Nội dung <span className="text-red-500">*</span></Label>
          <RichTextEditor 
            value={contentValue || ""} 
            onChange={(val) => setValue("content", val)}
            placeholder="Nội dung bài viết..." 
          />
          {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
        </div>

        <label className="flex items-start gap-3 rounded-md border bg-muted/20 p-4 cursor-pointer">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-primary" {...register("is_published")} />
          <span>
            <span className="block text-sm font-medium">Đang xuất bản</span>
            <span className="text-xs text-muted-foreground">Bỏ chọn để chuyển bài viết về bản nháp.</span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-end">
          <Link href="/admin/news">
            <Button variant="ghost" type="button">Hủy</Button>
          </Link>
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  )
}
