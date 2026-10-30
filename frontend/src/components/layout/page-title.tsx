import * as React from "react"
import { cn } from "@/lib/utils"

interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

export function PageTitle({ title, description, className, ...props }: PageTitleProps) {
  return (
    <div className={cn("max-w-3xl space-y-2.5 pb-8 pt-5 md:pb-10 md:pt-8", className)} {...props}>
      <h1 className="text-[2rem] font-bold leading-[1.15] tracking-[-0.03em] md:text-[2.5rem] lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
      )}
    </div>
  )
}
