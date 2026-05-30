import { Building2 } from "lucide-react"
import Link from "next/link"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="size-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">Renlo</span>
        </Link>
        <nav className="flex items-center gap-1">
          <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-muted-foreground">
            Phase 1
          </span>
        </nav>
      </div>
    </header>
  )
}
