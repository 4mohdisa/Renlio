import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface CurrencyTextProps {
  amount: number | null | undefined
  className?: string
  showSign?: boolean
}

export function CurrencyText({ amount, className, showSign }: CurrencyTextProps) {
  const isNegative = amount != null && amount < 0
  const isPositive = amount != null && amount > 0

  return (
    <span
      className={cn(
        showSign && isNegative && "text-destructive",
        showSign && isPositive && "text-success",
        className,
      )}
    >
      {formatCurrency(amount ?? 0)}
    </span>
  )
}
