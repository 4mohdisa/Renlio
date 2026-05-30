import type { ReactNode } from "react"

interface ResponsiveTableProps {
  children: ReactNode
}

export function ResponsiveTable({ children }: ResponsiveTableProps) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        {children}
      </div>
    </div>
  )
}
