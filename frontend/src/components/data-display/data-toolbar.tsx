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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        {search && <div className="min-w-0 md:max-w-lg">{search}</div>}
        {actions && (
          <div className="flex min-w-0 items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
            {actions}
          </div>
        )}
        {filters && <div className="min-w-0 md:col-span-2">{filters}</div>}
      </div>
      {footer && (
        <div className="border-border/70 mt-3 border-t pt-3">{footer}</div>
      )}
    </div>
  )
}
