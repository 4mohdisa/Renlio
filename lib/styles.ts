/**
 * Renlo shared semantic style presets.
 * Import these constants instead of duplicating class strings across components.
 */

export const cardStyles = {
  base: "bg-card rounded-xl border border-border p-6 shadow-sm",
  hover: "bg-card rounded-xl border border-border p-6 shadow-sm transition-shadow hover:shadow-md",
  compact: "bg-card rounded-lg border border-border p-4 shadow-sm",
} as const

export const pageStyles = {
  container: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8",
  header: "flex items-center justify-between mb-8",
  title: "text-2xl font-semibold text-foreground",
  description: "text-sm text-muted-foreground",
  section: "space-y-6",
} as const

export const inputStyles = {
  base: "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-info-light focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
} as const

export const badgeStyles = {
  base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  default: "bg-surface-alt text-muted-foreground",
  success: "bg-success-light text-success-foreground",
  warning: "bg-warning-light text-warning-foreground",
  error: "bg-[#FEE2E2] text-destructive",
  info: "bg-info-light text-info-foreground",
} as const

export const tableStyles = {
  container: "bg-card rounded-xl border border-border overflow-hidden",
  header: "bg-surface-alt",
} as const
