"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề bài viết"),
  summary: z.string().optional(),
  content: z.string().min(1, "Vui lòng nhập nội dung bài viết"),
  thumbnail_url: z.string().optional(),
  category_id: z.number().optional(),
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

  // We should actually fetch by ID, but our API uses slug currently for getArticle
  // Wait, if it's ID we can fetch the list and find it, or we need to update the backend to allow fetching by ID
  // For now, let's assume we can fetch by slug. Actually, I need to know the slug.
  // We'll update the backend to support GET /news/{id} or we can find from the list.
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const contentValue = watch("content")

  // Hacky way: fetch list and find by id since we don't have getArticleById API yet
  const { data: listData, isLoading: isLoadingArticle } = useQuery({
    queryKey: ["admin-news-list"],
    queryFn: async () => {
      const res = await newsService.getArticles({ size: 100 })
      return res.data || res
    }
  })

  React.useEffect(() => {
    if (listData?.items) {
      const article = listData.items.find((a: any) => a.id === Number(id))
      if (article) {
        reset({
          title: article.title,
          summary: article.summary || "",
          content: article.content,
          thumbnail_url: article.thumbnail_url || "",
          category_id: article.category_id,
          is_published: article.is_published,
        })
      }
    }
  }, [listData, id, reset])

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

  const updateMutation = useMutation({
    mutationFn: (data: any) => newsService.updateArticle(Number(id), data),
    onSuccess: () => {
      toast.success("Cập nhật bài viết thành công")
      queryClient.invalidateQueries({ queryKey: ["admin-news-list"] })
      router.push("/admin/news")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Lỗi khi cập nhật bài viết")
    }
  })

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(data)
  }

  if (isLoadingArticle) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-6 h-6" /></div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sửa bài viết</h1>
          <p className="text-muted-foreground mt-1">Cập nhật thông tin bài báo.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border rounded-2xl p-6 shadow-sm">
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
              <div className="flex gap-2 items-center mt-1">
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

        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Link href="/admin/news">
            <Button variant="ghost">Hủy</Button>
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
