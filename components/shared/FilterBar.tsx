"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterOption {
  label: string
  value: string
}

interface FilterBarProps {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function FilterBar({ options, value, onChange, className }: FilterBarProps) {
  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
