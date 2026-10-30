"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Simple native Select wrapper (no Radix dependency needed)
interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  registerItem: (value: string, label: React.ReactNode) => void
  getLabel: (value: string) => React.ReactNode
}>({
  open: false,
  setOpen: () => {},
  registerItem: () => {},
  getLabel: () => null
})

function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const labelsRef = React.useRef<Record<string, React.ReactNode>>({})

  const registerItem = React.useCallback((val: string, label: React.ReactNode) => {
    labelsRef.current[val] = label
  }, [])

  const getLabel = React.useCallback((val: string) => {
    return labelsRef.current[val] || val
  }, [])

  const selectRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, registerItem, getLabel }}>
      <div ref={selectRef} className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

function SelectGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext)
  return <span>{ctx.value ? ctx.getLabel(ctx.value) : placeholder || ""}</span>
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)

    return (
      <div className="relative">
        <button
          ref={ref}
          type="button"
          onClick={() => ctx.setOpen(!ctx.open)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
            className
          )}
          {...props}
        >
          {children}
          <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
        </button>
      </div>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

function SelectContent({ className, children }: SelectContentProps) {
  const ctx = React.useContext(SelectContext)
  
  if (!ctx.open) return null
  
  return (
    <div
      className={cn(
        "absolute top-full z-50 mt-1.5 min-w-full overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg",
        className
      )}
    >
      <div className="p-1">{children}</div>
    </div>
  )
}

function SelectLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}>{children}</div>
  )
}

interface SelectItemProps {
  value: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}

function SelectItem({ value, className, children, disabled }: SelectItemProps) {
  const ctx = React.useContext(SelectContext)
  const isSelected = ctx.value === value

  React.useEffect(() => {
    ctx.registerItem(value, children)
  }, [value, children, ctx])

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => {
        if (!disabled && ctx.onValueChange) {
          ctx.onValueChange(value)
          ctx.setOpen(false)
        }
      }}
      className={cn(
        "relative flex min-h-9 w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none hover:bg-muted hover:text-foreground",
        isSelected && "bg-accent text-accent-foreground font-medium",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {children}
    </div>
  )
}

function SelectSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
}

// Controlled Select using native HTML for full compatibility
interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

function NativeSelect({ onValueChange, onChange, className, children, ...props }: NativeSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value)
    onChange?.(e)
  }
  return (
    <select
      onChange={handleChange}
      className={cn(
        "flex h-10 w-full items-center rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  NativeSelect,
}
