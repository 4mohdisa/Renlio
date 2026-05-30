'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

// ============================================================
// TYPES
// ============================================================

export interface OrgSettings {
  name: string
  trading_name: string
  abn: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postcode: string
}

export interface DisplayPreferences {
  date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  currency: 'AUD' | 'GBP' | 'USD'
  default_rent_frequency: 'WEEKLY' | 'FORTNIGHTLY' | 'MONTHLY'
  items_per_page: 10 | 25 | 50
  show_arrears_warning: boolean
  compact_table_view: boolean
}

export interface NotificationPreferences {
  rent_overdue: boolean
  invoice_due: boolean
  bill_due: boolean
  lease_expiry: boolean
  bond_return: boolean
  new_move_in: boolean
}

const DEFAULT_ORG: OrgSettings = {
  name: 'Demo Organisation',
  trading_name: '',
  abn: '',
  email: 'demo@renlio.app',
  phone: '',
  address: '',
  city: '',
  state: 'SA',
  postcode: '',
}

const DEFAULT_DISPLAY: DisplayPreferences = {
  date_format: 'DD/MM/YYYY',
  currency: 'AUD',
  default_rent_frequency: 'MONTHLY',
  items_per_page: 10,
  show_arrears_warning: true,
  compact_table_view: false,
}

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  rent_overdue: true,
  invoice_due: true,
  bill_due: true,
  lease_expiry: true,
  bond_return: false,
  new_move_in: true,
}

// ============================================================
// CONTEXT
// ============================================================

interface StoreContextType {
  org: OrgSettings
  setOrg: (settings: OrgSettings) => void
  display: DisplayPreferences
  setDisplay: (prefs: DisplayPreferences) => void
  notifications: NotificationPreferences
  setNotifications: (prefs: NotificationPreferences) => void
  isLoaded: boolean
}

const StoreContext = createContext<StoreContextType | null>(null)

function readLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

function writeLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn('[Renlio Store] Failed to write to localStorage')
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [org, setOrgState] = useState<OrgSettings>(DEFAULT_ORG)
  const [display, setDisplayState] = useState<DisplayPreferences>(DEFAULT_DISPLAY)
  const [notifications, setNotificationsState] = useState<NotificationPreferences>(DEFAULT_NOTIFICATIONS)

  useEffect(() => {
    setOrgState(readLocalStorage('renlio-org-settings', DEFAULT_ORG))
    setDisplayState(readLocalStorage('renlio-display-preferences', DEFAULT_DISPLAY))
    setNotificationsState(readLocalStorage('renlio-notification-prefs', DEFAULT_NOTIFICATIONS))
    setIsLoaded(true)
  }, [])

  const setOrg = useCallback((settings: OrgSettings) => {
    setOrgState(settings)
    writeLocalStorage('renlio-org-settings', settings)
  }, [])

  const setDisplay = useCallback((prefs: DisplayPreferences) => {
    setDisplayState(prefs)
    writeLocalStorage('renlio-display-preferences', prefs)
  }, [])

  const setNotifications = useCallback((prefs: NotificationPreferences) => {
    setNotificationsState(prefs)
    writeLocalStorage('renlio-notification-prefs', prefs)
  }, [])

  const value: StoreContextType = {
    org,
    setOrg,
    display,
    setDisplay,
    notifications,
    setNotifications,
    isLoaded,
  }

  return React.createElement(StoreContext.Provider, { value }, children)
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

export function useOrgSettings() {
  return useStore().org
}

export function useDisplayPreferences() {
  return useStore().display
}

export function useNotificationPreferences() {
  return useStore().notifications
}
