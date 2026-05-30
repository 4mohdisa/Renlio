"use client"

import { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface DataTableColumn<T, E = unknown> {
  key: string
  header: string
  width?: string
  render: (row: T, index: number, extra?: E) => ReactNode
}

export interface DataTableProps<T, E = unknown> {
  columns: DataTableColumn<T, E>[]
  data: T[]
  onRowClick?: (row: T) => void
  emptyState: ReactNode
  className?: string
  extra?: E
  rowClassName?: (row: T) => string
}

export function DataTable<T, E = unknown>({
  columns,
  data,
  onRowClick,
  emptyState,
  className,
  extra,
  rowClassName,
}: DataTableProps<T, E>) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm", className)}>
      <div className="w-full overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={index}
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-slate-50 transition-colors",
                  rowClassName?.(row)
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>{column.render(row, index, extra)}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-12"
              >
                {emptyState}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
