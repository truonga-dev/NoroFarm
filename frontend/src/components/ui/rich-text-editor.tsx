"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-context"
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Heading1, Heading2, Heading3, Link as LinkIcon, 
  Image as ImageIcon, Loader2 
} from "lucide-react"
import { newsService } from "@/api/services/news.service"
import { getAssetUrl } from "@/api/client"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Nhập nội dung bài viết...", 
  className 
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const toast = useToast()

  // Đồng bộ giá trị khởi tạo vào contentEditable
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || ""
      }
    }
  }, [value])

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleImageUpload = () => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null
      if (!file) return

      setIsUploading(true)
      try {
        const res: any = await newsService.uploadImage(file)
        const uploadedUrl = res?.data?.url || res?.url
        if (!uploadedUrl) throw new Error("Upload failed")
        
        const url = getAssetUrl(uploadedUrl)
        executeCommand("insertImage", url)
        toast.success("Đã chèn ảnh vào bài viết")
      } catch (error) {
        toast.error("Lỗi khi tải ảnh lên")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleLink = () => {
    const url = prompt("Nhập đường dẫn URL:")
    if (url) {
      executeCommand("createLink", url)
    }
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden shadow-sm", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "<h1>")}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          title="Tiêu đề 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "<h2>")}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          title="Tiêu đề 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "<h3>")}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          title="Tiêu đề 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          title="In đậm (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          title="Gạch chân (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          title="Danh sách dấu đầu dòng"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          title="Danh sách đánh số"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={handleLink}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          title="Chèn liên kết"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={isUploading}
          className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          title="Chèn ảnh"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <ImageIcon className="w-4 h-4" />}
        </button>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 text-base text-foreground focus:outline-none prose dark:prose-invert max-w-none [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-3"
        data-placeholder={placeholder}
      />
    </div>
  )
}
