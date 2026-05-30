export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][]
): void {
  // Escape CSV values that contain commas, quotes, or newlines
  const escapeCSV = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return ""
    const str = String(value)
    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  // Build CSV content
  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute(
    "download",
    `${filename}-${new Date().toISOString().split("T")[0]}.csv`
  )
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Format currency for CSV (plain number, no symbol)
export function formatCurrencyForCSV(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return ""
  return amount.toFixed(2)
}

// Format date for CSV (YYYY-MM-DD)
export function formatDateForCSV(date: string | Date | null | undefined): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  return d.toISOString().split("T")[0]
}
