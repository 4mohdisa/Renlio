import {
  Building2,
  LayoutDashboard,
  Users,
  Contact,
  FileText,
  CreditCard,
  Receipt,
  Settings,
  Truck,
  LifeBuoy,
} from "lucide-react"

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Tenancies", href: "/tenancies", icon: Users },
  { label: "Contacts", href: "/contacts", icon: Contact },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Bills", href: "/bills", icon: Receipt },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Support", href: "/support", icon: LifeBuoy },
  { label: "Settings", href: "/settings", icon: Settings },
] as const
