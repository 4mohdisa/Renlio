"use client"

import { useMemo } from "react"

interface SkeletonTableProps {
  rows?: number
  columns?: number
}

// Pre-defined widths to avoid hydration mismatch
const HEADER_WIDTHS = ["40%", "55%", "48%", "52%", "45%", "60%", "50%", "58%"]
const CELL_WIDTHS = [
  ["35%", "70%", "45%", "65%", "40%", "55%", "50%", "48%"],
  ["60%", "35%", "55%", "40%", "65%", "45%", "52%", "38%"],
  ["45%", "55%", "35%", "60%", "50%", "40%", "48%", "55%"],
  ["55%", "40%", "60%", "35%", "45%", "58%", "42%", "50%"],
  ["50%", "48%", "55%", "42%", "60%", "35%", "55%", "45%"],
  ["40%", "60%", "38%", "55%", "48%", "52%", "40%", "60%"],
  ["65%", "35%", "50%", "45%", "55%", "40%", "60%", "38%"],
  ["38%", "55%", "42%", "60%", "35%", "50%", "45%", "55%"],
  ["52%", "40%", "58%", "35%", "50%", "45%", "55%", "40%"],
  ["48%", "52%", "35%", "55%", "42%", "60%", "38%", "50%"],
]

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  // Use memo to ensure consistent values during render
  const headerWidths = useMemo(() => {
    return Array.from({ length: columns }, (_, i) => HEADER_WIDTHS[i % HEADER_WIDTHS.length])
  }, [columns])

  const cellWidths = useMemo(() => {
    return Array.from({ length: rows }, (_, rowIndex) => {
      return Array.from({ length: columns }, (_, colIndex) => {
        return CELL_WIDTHS[rowIndex % CELL_WIDTHS.length][colIndex % CELL_WIDTHS[0].length]
      })
    })
  }, [rows, columns])

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
        <div className="flex gap-4">
          {headerWidths.map((width, i) => (
            <div key={`header-${i}`} className="flex-1">
              <div 
                className="h-4 bg-slate-200 rounded"
                style={{ width, maxWidth: '120px' }} 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Body */}
      <div className="divide-y divide-slate-100">
        {cellWidths.map((rowWidths, rowIndex) => (
          <div key={`row-${rowIndex}`} className="px-4 py-4 flex gap-4">
            {rowWidths.map((width, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1">
                <div 
                  className="h-4 bg-slate-100 rounded"
                  style={{ 
                    width,
                    maxWidth: colIndex === columns - 1 ? '80px' : '150px'
                  }} 
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
