'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Keyboard, X, Search, Home, Users, FileText, CreditCard, Settings, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface Shortcut {
  key: string
  label: string
  icon?: React.ReactNode
  action: () => void
  global?: boolean
}

export function KeyboardShortcuts() {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'))
  }, [])

  const shortcuts: Shortcut[] = [
    {
      key: 'g h',
      label: 'Go to Home',
      icon: <Home className="size-4" />,
      action: () => router.push('/'),
    },
    {
      key: 'g p',
      label: 'Go to Properties',
      icon: <Search className="size-4" />,
      action: () => router.push('/properties'),
    },
    {
      key: 'g t',
      label: 'Go to Tenancies',
      icon: <Users className="size-4" />,
      action: () => router.push('/tenancies'),
    },
    {
      key: 'g i',
      label: 'Go to Invoices',
      icon: <FileText className="size-4" />,
      action: () => router.push('/invoices'),
    },
    {
      key: 'g b',
      label: 'Go to Bills',
      icon: <FileText className="size-4" />,
      action: () => router.push('/bills'),
    },
    {
      key: 'g m',
      label: 'Go to Payments',
      icon: <CreditCard className="size-4" />,
      action: () => router.push('/payments'),
    },
    {
      key: 'g s',
      label: 'Go to Settings',
      icon: <Settings className="size-4" />,
      action: () => router.push('/settings'),
    },
    {
      key: '?',
      label: 'Show Keyboard Shortcuts',
      icon: <HelpCircle className="size-4" />,
      action: () => setShowHelp(true),
      global: true,
    },
    {
      key: 'Escape',
      label: 'Close Dialog / Go Back',
      action: () => {},
      global: true,
    },
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      // Allow Escape key even in inputs
      if (e.key !== 'Escape') return
    }

    // Handle ? key (with or without Shift)
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault()
      setShowHelp(true)
      return
    }

    // Handle g + key combinations
    if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Wait for next key
      const handler = (e2: KeyboardEvent) => {
        if (e2.ctrlKey || e2.metaKey || e2.altKey) return
        
        const combo = `g ${e2.key.toLowerCase()}`
        const shortcut = shortcuts.find(s => s.key === combo)
        
        if (shortcut) {
          e2.preventDefault()
          shortcut.action()
        }
        
        document.removeEventListener('keydown', handler)
      }
      
      document.addEventListener('keydown', handler, { once: true })
      
      // Remove handler after 1 second if no key pressed
      setTimeout(() => {
        document.removeEventListener('keydown', handler)
      }, 1000)
      
      return
    }

    // Handle Escape key
    if (e.key === 'Escape') {
      setShowHelp(false)
      return
    }
  }, [router, shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const formatKey = (key: string): string => {
    if (key === 'Escape') return 'Esc'
    if (key === ' ') return 'Space'
    return key.toUpperCase()
  }

  const modKey = isMac ? '⌘' : 'Ctrl'

  return (
    <>
      {/* Keyboard shortcut help button - visible in footer or sidebar */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => setShowHelp(true)}
      >
        <Keyboard className="size-4" />
        <span className="hidden lg:inline">Shortcuts</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
          {modKey}?
        </kbd>
      </Button>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="size-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              Press <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium">g</kbd> then a letter to navigate quickly.
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Navigation
              </h4>
              <div className="grid gap-1">
                {shortcuts.filter(s => s.key.startsWith('g ')).map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      {shortcut.icon && (
                        <span className="text-muted-foreground">{shortcut.icon}</span>
                      )}
                      <span className="text-sm">{shortcut.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="rounded bg-slate-100 px-2 py-1 text-xs font-medium min-w-[1.5rem] text-center">
                        G
                      </kbd>
                      <span className="text-slate-300">+</span>
                      <kbd className="rounded bg-slate-100 px-2 py-1 text-xs font-medium min-w-[1.5rem] text-center">
                        {formatKey(shortcut.key.split(' ')[1])}
                      </kbd>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                General
              </h4>
              <div className="grid gap-1">
                {shortcuts.filter(s => !s.key.startsWith('g ')).map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      {shortcut.icon && (
                        <span className="text-muted-foreground">{shortcut.icon}</span>
                      )}
                      <span className="text-sm">{shortcut.label}</span>
                    </div>
                    <kbd className={cn(
                      "rounded bg-slate-100 px-2 py-1 text-xs font-medium",
                      shortcut.key === '?' && "min-w-[2rem] text-center"
                    )}>
                      {formatKey(shortcut.key)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowHelp(false)}>
              <X className="size-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Hook to use keyboard shortcuts programmatically
export function useKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false)
  
  return {
    showHelp,
    setShowHelp,
  }
}
