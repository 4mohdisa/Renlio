import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  iconClassName?: string
  description?: string
  footer?: ReactNode
}

export function StatCard({ title, value, icon, iconClassName = "bg-accent/10 text-accent", description, footer }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className={`rounded-lg p-2.5 ${iconClassName}`}>
            {icon}
          </div>
        )}
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {footer && (
        <div className="mt-3 pt-3 border-t border-border">
          {footer}
        </div>
      )}
    </div>
  )
}
