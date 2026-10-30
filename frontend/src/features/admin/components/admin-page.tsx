import * as React from "react"
import { cn } from "@/lib/utils"

interface AdminPageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  actions?: React.ReactNode
}

export function AdminPageHeader({ eyebrow, title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function AdminToolbar({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center", className)}>{children}</div>
}

export function AdminDataPanel({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("overflow-hidden rounded-lg border bg-card shadow-sm", className)}>{children}</div>
}

export function AdminEmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center">
      <div className="mb-3 h-px w-10 bg-primary/50" />
      <p className="font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
