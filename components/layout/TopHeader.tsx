"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/lib/nav-items"
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"

interface TopHeaderProps {
  onMenuClick?: () => void
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onMenuClick}
              aria-label="Open navigation"
              className="lg:hidden"
            >
              <Menu className="size-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-muted-foreground">
              Phase 2
            </span>
          </div>
        </div>
      </header>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="flex h-14 items-center gap-2 px-6 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">Renlio</span>
            </div>
          </SheetHeader>
          <nav className="py-4 px-3">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-surface-alt text-foreground"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
