"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { newsService } from "@/api/services/news.service"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useToast } from "@/components/ui/toast-context"
import { Upload } from "lucide-react"
import { AdminPageHeader } from "@/features/admin/components/admin-page"

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề bài viết"),
  summary: z.string().optional(),
  content: z.string().min(1, "Vui lòng nhập nội dung bài viết"),
  thumbnail_url: z.string().optional(),
  category_id: z.number().optional(),
  is_published: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateNewsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const toast = useToast()
  const [isUploading, setIsUploading] = React.useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      thumbnail_url: "",
      category_id: 1, // Default fallback
      is_published: true, // Auto publish for testing
    }
  })

  const contentValue = watch("content")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const res = await newsService.uploadImage(file)
      // We assume backend runs on localhost:8000 for now, or just relative URL if same domain
      // If the backend returns a relative URL like /uploads/..., we prefix it with backend URL
      const url = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') + res.data.url
      setValue("thumbnail_url", url)
      toast.success("Tải ảnh lên thành công")
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên")
    } finally {
      setIsUploading(false)
    }
  }

  const createMutation = useMutation({
    mutationFn: (data: any) => newsService.createArticle(data),
    onSuccess: () => {
      toast.success("Tạo bài viết thành công")
      queryClient.invalidateQueries({ queryKey: ["admin-news-list"] })
      router.push("/admin/news")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Lỗi khi tạo bài viết")
    }
  })

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <AdminPageHeader eyebrow="Biên tập nội dung" title="Viết bài mới" description="Soạn thảo và xuất bản nội dung cho chuyên mục tin tức NoroFarm." actions={<Button variant="outline" asChild><Link href="/admin/news"><ArrowLeft className="mr-2 h-4 w-4" />Danh sách bài viết</Link></Button>} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border bg-card p-4 shadow-sm sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Tiêu đề bài viết <span className="text-red-500">*</span></Label>
          <Input id="title" placeholder="Nhập tiêu đề..." {...register("title")} />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Tóm tắt</Label>
          <Input id="summary" placeholder="Đoạn mô tả ngắn..." {...register("summary")} />
        </div>

        <div className="space-y-2">
            <div>
              <Label>Ảnh bìa</Label>
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
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

        <label className="flex items-start gap-3 rounded-md border bg-muted/20 p-4">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-primary" {...register("is_published")} />
          <span><span className="block text-sm font-medium">Xuất bản ngay</span><span className="text-xs text-muted-foreground">Bỏ chọn để lưu bài dưới dạng bản nháp.</span></span>
        </label>

        <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-end">
          <Link href="/admin/news">
            <Button variant="ghost">Hủy</Button>
          </Link>
          <Button type="submit" disabled={createMutation.isPending} className="gap-2">
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu bài viết
          </Button>
        </div>
      </form>
    </div>
  )
}
