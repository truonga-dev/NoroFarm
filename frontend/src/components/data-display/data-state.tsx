import * as React from 'react'

import { cn } from '@/lib/utils'

interface DataStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function DataState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: DataStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-card flex min-h-64 flex-col items-center justify-center rounded-xl border px-6 py-12 text-center',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="bg-muted text-muted-foreground flex h-11 w-11 items-center justify-center rounded-full">
          {icon}
        </div>
      )}
      <h2 className="mt-4 text-lg font-semibold tracking-[-0.01em]">{title}</h2>
      {description && (
        <p className="text-muted-foreground mt-1.5 max-w-md text-sm leading-6">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
