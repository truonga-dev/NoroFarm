"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [query, setQuery] = React.useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/search')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <button 
        type="submit" 
        aria-label="Tìm kiếm"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
      >
        <Search className="h-4 w-4" />
      </button>
      <Input
        type="text"
        placeholder="Tìm nông sản, tin tức, giá..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-background pl-8 pr-7 h-9 rounded-full text-xs md:w-[150px] lg:w-[220px] transition-all focus:md:w-[220px] focus:lg:w-[300px] border-border/80 focus-visible:ring-primary/30"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  )
}
