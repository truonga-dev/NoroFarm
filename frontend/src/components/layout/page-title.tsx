import * as React from "react"
import { cn } from "@/lib/utils"

interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

export function PageTitle({ title, description, className, ...props }: PageTitleProps) {
  return (
    <div className={cn("space-y-2 pb-8 pt-6 md:pb-12 md:pt-10", className)} {...props}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
