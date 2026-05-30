import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-success-light text-success-foreground",
  PAID: "bg-success-light text-success-foreground",
  COMPLETED: "bg-success-light text-success-foreground",
  APPROVED: "bg-success-light text-success-foreground",
  FULLY_PAID: "bg-success-light text-success-foreground",
  OCCUPIED: "bg-success-light text-success-foreground",
  ISSUED: "bg-info-light text-info-foreground",
  PENDING: "bg-warning-light text-warning-foreground",
  PARTIALLY_PAID: "bg-warning-light text-warning-foreground",
  REQUIRED: "bg-warning-light text-warning-foreground",
  OVERDUE: "bg-[#FEE2E2] text-destructive",
  EXPIRED: "bg-[#FEE2E2] text-destructive",
  TERMINATED: "bg-[#FEE2E2] text-destructive",
  FAILED: "bg-[#FEE2E2] text-destructive",
  REVERSED: "bg-[#FEE2E2] text-destructive",
  CANCELLED: "bg-surface-alt text-muted-foreground",
  DRAFT: "bg-surface-alt text-muted-foreground",
  INACTIVE: "bg-surface-alt text-muted-foreground",
  VACANT: "bg-surface-alt text-muted-foreground",
  NOT_REQUIRED: "bg-surface-alt text-muted-foreground",
  UNDER_MAINTENANCE: "bg-warning-light text-warning-foreground",
  HELD: "bg-info-light text-info-foreground",
  RETURNED: "bg-surface-alt text-muted-foreground",
  PARTIALLY_RETURNED: "bg-warning-light text-warning-foreground",
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-surface-alt text-muted-foreground"
  const label = status.replace(/_/g, " ")

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
        style,
        className,
      )}
    >
      {label.toLowerCase()}
    </span>
  )
}
