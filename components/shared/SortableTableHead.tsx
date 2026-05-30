"use client"

import { useState } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { TableHead } from "@/components/ui/table"

export type SortDirection = "asc" | "desc" | null

interface SortableTableHeadProps {
  label: string
  sortKey: string
  currentSortKey: string | null
  currentDirection: SortDirection
  onSort: (key: string) => void
  className?: string
}

export function SortableTableHead({
  label,
  sortKey,
  currentSortKey,
  currentDirection,
  onSort,
  className,
}: SortableTableHeadProps) {
  const isActive = currentSortKey === sortKey

  return (
    <TableHead className={cn("cursor-pointer select-none hover:text-foreground transition-colors", className)}>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 font-medium"
        onClick={() => onSort(sortKey)}
      >
        {label}
        {isActive && currentDirection === "asc" ? (
          <ArrowUp className="size-3.5 text-accent" />
        ) : isActive && currentDirection === "desc" ? (
          <ArrowDown className="size-3.5 text-accent" />
        ) : (
          <ArrowUpDown className="size-3.5 opacity-40" />
        )}
      </button>
    </TableHead>
  )
}

export function useSorting<T>(
  data: T[],
  defaultKey: string | null = null,
  defaultDirection: SortDirection = null,
): {
  sortKey: string | null
  sortDirection: SortDirection
  handleSort: (key: string) => void
  sortedData: T[]
} {
  const [sortKey, setSortKey] = useState<string | null>(defaultKey)
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultDirection)

  function handleSort(key: string): void {
    if (sortKey === key) {
      if (sortDirection === "asc") setSortDirection("desc")
      else if (sortDirection === "desc") {
        setSortKey(null)
        setSortDirection(null)
      }
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0
    const aVal = (a as Record<string, unknown>)[sortKey]
    const bVal = (b as Record<string, unknown>)[sortKey]
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    }
    const aStr = String(aVal)
    const bStr = String(bVal)
    return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  return { sortKey, sortDirection, handleSort, sortedData }
}
