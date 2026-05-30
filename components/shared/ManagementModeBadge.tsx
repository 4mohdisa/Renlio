import { cn } from "@/lib/utils"

interface ManagementModeBadgeProps {
  mode: "ROOMING" | "WHOLE_PROPERTY"
  className?: string
}

export function ManagementModeBadge({ mode, className }: ManagementModeBadgeProps) {
  const isRooming = mode === "ROOMING"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        isRooming
          ? "bg-info-light text-info-foreground"
          : "bg-success-light text-success-foreground",
        className,
      )}
    >
      {isRooming ? "Rooming" : "Whole Property"}
    </span>
  )
}
