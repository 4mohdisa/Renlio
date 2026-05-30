"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, LogOut, Settings } from "lucide-react"
import { KeyboardShortcuts } from "@/components/shared"

import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/lib/nav-items"
import { RenlioLogo } from "@/components/shared"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SidebarNavProps {
  mobile?: boolean
  onClose?: () => void
}

// Static user data - will be replaced by Supabase Auth in Phase 2
const USER = {
  name: "Property Manager",
  email: "manager@renlio.app",
}

export function SidebarNav({ mobile, onClose }: SidebarNavProps) {
  const pathname = usePathname()

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const handleSignOut = () => {
    // Clear mock auth cookie
    document.cookie = 'renlio-auth-mock=; path=/; max-age=0'
    toast.success("Signed out successfully")
    // Redirect to sign in
    window.location.href = '/sign-in'
  }

  return (
    <aside className={cn(
      "flex flex-col w-64 h-full bg-sidebar border-r border-sidebar-border",
      mobile ? "lg:hidden" : "hidden lg:flex lg:fixed lg:inset-y-0"
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center px-6 border-b border-sidebar-border shrink-0">
        <RenlioLogo size="md" variant="light" />
      </div>
      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => mobile && onClose?.()}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-white"
                      : "text-white/70 hover:bg-sidebar-accent/60 hover:text-white",
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

      {/* Keyboard Shortcuts & User Menu */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <div className="px-3">
          <KeyboardShortcuts />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger 
            render={
              <Button 
                variant="ghost" 
                className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium justify-start h-auto
                  text-sidebar-foreground/70 
                  hover:bg-sidebar-accent/60 hover:text-sidebar-foreground
                  [&:focus]:text-sidebar-foreground [&:active]:text-sidebar-foreground
                  [&[data-state=open]]:text-sidebar-foreground"
              >
                <div className="size-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
                  <User className="size-4 text-sidebar-primary-foreground" />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sidebar-foreground font-medium text-sm truncate">{USER.name}</p>
                  <p className="text-sidebar-foreground/60 text-xs truncate">{USER.email}</p>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem 
              onClick={() => window.location.href = "/settings/account"}
              className="cursor-pointer"
            >
              <Settings className="size-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
              <LogOut className="size-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
