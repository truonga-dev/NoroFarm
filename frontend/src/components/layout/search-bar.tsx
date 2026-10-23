"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Tìm kiếm..."
        className="w-full bg-background pl-8 md:w-[140px] lg:w-[200px] transition-all focus:md:w-[200px] focus:lg:w-[280px]"
      />
    </div>
  )
}
