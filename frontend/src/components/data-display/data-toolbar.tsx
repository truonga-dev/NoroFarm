import * as React from 'react'

import { cn } from '@/lib/utils'

interface DataToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  search?: React.ReactNode
  filters?: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
}

export function DataToolbar({
  search,
  filters,
  actions,
  footer,
  className,
  ...props
}: DataToolbarProps) {
  return (
    <div
      className={cn(
        'border-border bg-card rounded-xl border p-3 md:p-4',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {search && <div className="w-full lg:max-w-sm">{search}</div>}
        {filters && <div className="min-w-0 flex-1">{filters}</div>}
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
      {footer && (
        <div className="border-border/70 mt-3 border-t pt-3">{footer}</div>
      )}
    </div>
  )
}
