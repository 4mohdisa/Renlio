import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface DateTextProps {
  date: string | Date | null | undefined
  className?: string
  options?: Intl.DateTimeFormatOptions
}

export function DateText({ date, className }: DateTextProps) {
  if (!date) return <span className={cn("text-sm", className)}>—</span>
  return (
    <span className={cn("text-sm", className)}>
      {formatDate(date)}
    </span>
  )
}
