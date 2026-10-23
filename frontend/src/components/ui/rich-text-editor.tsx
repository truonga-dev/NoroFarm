"use client"

import React, { useMemo } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-context"
import { Loader2 } from "lucide-react"
import { newsService } from "@/api/services/news.service"
import { getAssetUrl } from "@/api/client"
// CSS được import trong global.css hoặc layout để tránh lỗi SSR

// Tải ReactQuill động để tránh lỗi SSR (document is not defined)
const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center border rounded-xl bg-card"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
}) as any

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Nhập nội dung bài viết...", className }: RichTextEditorProps) {
  const quillRef = React.useRef<any>(null)
  const toast = useToast()

  // Xử lý upload ảnh khi bấm nút Image trong Toolbar
  const imageHandler = React.useCallback(() => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null
      if (!file) return

      try {
        const res: any = await newsService.uploadImage(file)
        const uploadedUrl = res?.data?.url || res?.url
        if (!uploadedUrl) throw new Error("Upload failed")
        
        const url = getAssetUrl(uploadedUrl)

        const quill = quillRef.current?.getEditor()
        if (quill) {
          const range = quill.getSelection()
          quill.insertEmbed(range?.index || 0, "image", url)
        }
      } catch (error) {
        toast.error("Lỗi khi tải ảnh lên")
      }
    }
  }, [toast])
  
  // Custom toolbar
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler])

  return (
    <div className={cn("rich-text-container", className)}>
      <ReactQuill 
        ref={quillRef}
        theme="snow" 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        modules={modules}
        className="bg-card rounded-xl overflow-hidden [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-border [&_.ql-toolbar]:bg-muted/30 [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-border [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-base"
      />
    </div>
  )
}
