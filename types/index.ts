export interface Property {
  id: string
  name: string
  address_line_1: string
  address_line_2?: string
  city: string
  postal_code: string
  country: string
  management_mode: "ROOMING" | "WHOLE_PROPERTY"
  total_bedrooms?: number
  total_rooms: number
  occupied_rooms: number
  total_monthly_rent: number
  total_arrears: number
  owner_contact_group_id?: string
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  mobile?: string
  emergency_name?: string
  emergency_phone?: string
  address_line_1?: string
  city?: string
  postal_code?: string
  payment_reference?: string
  created_at: string
  updated_at: string
}

export interface Tenancy {
  id: string
  property_id: string
  room_id?: string
  tenant_id: string
  lease_start_date: string
  lease_end_date?: string
  move_in_date: string
  move_out_date?: string
  status: "ACTIVE" | "EXPIRED" | "TERMINATED" | "PENDING"
  rent_amount: number
  rent_frequency: "WEEKLY" | "FORTNIGHTLY" | "MONTHLY" | "QUARTERLY" | "YEARLY"
  daily_rate?: number
  bond_status: "NOT_REQUIRED" | "REQUIRED" | "PARTIALLY_PAID" | "FULLY_PAID" | "HELD" | "RETURNED" | "PARTIALLY_RETURNED"
  bond_required?: number
  bond_paid: number
  bond_remaining: number
  bond_number?: string
  paid_to_date?: string
  rent_arrears: number
  invoice_arrears: number
  created_at: string
  updated_at: string
}

export const PROPERTY_TYPES = {
  ROOMING: "ROOMING",
  WHOLE_PROPERTY: "WHOLE_PROPERTY",
} as const

export const TENANT_STATUSES = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  TERMINATED: "TERMINATED",
  PENDING: "PENDING",
} as const

export const RENT_FREQUENCIES = {
  WEEKLY: "WEEKLY",
  FORTNIGHTLY: "FORTNIGHTLY",
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  YEARLY: "YEARLY",
} as const

export const PAYMENT_METHODS = {
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  CHECK: "CHECK",
  DIRECT_DEBIT: "DIRECT_DEBIT",
} as const

export const ALLOCATION_TARGETS = {
  RENT: "RENT",
  BOND: "BOND",
  INVOICE: "INVOICE",
  CREDIT: "CREDIT",
} as const

export interface Room {
  id: string
  property_id: string
  room_label: string
  room_number?: string
  room_type: "BEDROOM" | "STUDIO" | "SUITE" | "APARTMENT"
  current_tenancy_id?: string
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  organization_id: string
  contact_group_id?: string
  name: string
  email?: string
  phone?: string
  category: "PLUMBER" | "COUNCIL" | "CLEANER" | "GARDENING" | "ROOFER" | "BUILDER" | "ELECTRICIAN"
  notes?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  tenancy_id: string
  invoice_number: string
  issue_date: string
  due_date: string
  period_start?: string
  period_end?: string
  amount: number
  tax_amount: number
  total_amount: number
  amount_paid: number
  remaining_balance: number
  category: "RENT" | "DEPOSIT" | "BOND" | "UTILITIES" | "MAINTENANCE" | "CLEANING" | "LATE_FEE" | "ADMIN_FEE" | "DAMAGES" | "OTHER"
  description?: string
  status: "DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED"
  overdue_since?: string
  invoice_source: "OWNER" | "SUPPLIER"
  supplier_id?: string
  created_at: string
}

export interface Transaction {
  id: string
  transaction_number: string
  tenancy_id?: string
  tenant_id?: string
  transaction_date: string
  type: TransactionType
  status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED"
  amount: number
  method: TransactionMethod
  bank_reference?: string
  receipt_number?: string
  notes?: string
  total_allocated: number
  unallocated_amount: number
  allocation_target?: "RENT" | "BOND" | "INVOICE" | "CREDIT"
  created_at: string
}

export interface Allocation {
  id: string
  transaction_id: string
  invoice_id?: string
  allocation_target: "RENT" | "BOND" | "INVOICE" | "CREDIT"
  allocated_amount: number
  allocated_at: string
  covers_period_start?: string
  covers_period_end?: string
  status: "ACTIVE" | "REVERSED"
}

export interface Bill {
  id: string
  organization_id: string
  property_id: string
  bill_number: string
  supplier_id?: string
  supplier_name?: string
  issue_date: string
  due_date: string
  amount: number
  tax_amount: number
  total_amount: number
  amount_paid: number
  remaining_balance: number
  category: "MAINTENANCE" | "UTILITIES" | "INSURANCE" | "TAX" | "MANAGEMENT_FEE" | "SUPPLIES" | "REPAIRS" | "CLEANING" | "OTHER"
  description?: string
  status: "DRAFT" | "PENDING" | "APPROVED" | "PAID" | "OVERDUE"
  paid_date?: string
  created_at: string
}

export interface LedgerEntry {
  id: string
  date: string
  description: string
  type: "CHARGE" | "PAYMENT" | "ADJUSTMENT"
  amount: number
  balance: number
}

export const INVOICE_STATUSES = {
  DRAFT: "DRAFT",
  ISSUED: "ISSUED",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED",
} as const

export const BILL_CATEGORIES = {
  MAINTENANCE: "MAINTENANCE",
  UTILITIES: "UTILITIES",
  INSURANCE: "INSURANCE",
  TAX: "TAX",
  MANAGEMENT_FEE: "MANAGEMENT_FEE",
  SUPPLIES: "SUPPLIES",
  REPAIRS: "REPAIRS",
  CLEANING: "CLEANING",
  OTHER: "OTHER",
} as const

export const INVOICE_CATEGORIES = {
  RENT: "RENT",
  DEPOSIT: "DEPOSIT",
  BOND: "BOND",
  UTILITIES: "UTILITIES",
  MAINTENANCE: "MAINTENANCE",
  CLEANING: "CLEANING",
  LATE_FEE: "LATE_FEE",
  ADMIN_FEE: "ADMIN_FEE",
  DAMAGES: "DAMAGES",
  OTHER: "OTHER",
} as const

export const ROOM_TYPES = {
  BEDROOM: "BEDROOM",
  STUDIO: "STUDIO",
  SUITE: "SUITE",
  APARTMENT: "APARTMENT",
} as const

export const SUPPLIER_CATEGORIES = {
  PLUMBER: "PLUMBER",
  COUNCIL: "COUNCIL",
  CLEANER: "CLEANER",
  GARDENING: "GARDENING",
  ROOFER: "ROOFER",
  BUILDER: "BUILDER",
  ELECTRICIAN: "ELECTRICIAN",
} as const

export type SupplierCategory = "PLUMBER" | "COUNCIL" | "CLEANER" | "GARDENING" | "ROOFER" | "BUILDER" | "ELECTRICIAN"
export type InvoiceSource = "OWNER" | "SUPPLIER"
export type BillCategory = "MAINTENANCE" | "UTILITIES" | "INSURANCE" | "TAX" | "MANAGEMENT_FEE" | "SUPPLIES" | "REPAIRS" | "CLEANING" | "OTHER"
export type InvoiceCategory = "RENT" | "DEPOSIT" | "BOND" | "UTILITIES" | "MAINTENANCE" | "CLEANING" | "LATE_FEE" | "ADMIN_FEE" | "DAMAGES" | "OTHER"
export type TransactionType = "PAYMENT" | "REFUND" | "ADJUSTMENT" | "CREDIT" | "DEBIT"
export type TransactionMethod = "CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "DEBIT_CARD" | "CHECK" | "DIRECT_DEBIT"

export type ContactType = 'TENANT' | 'SUPPLIER' | 'OWNER' | 'OTHER'

export interface ContactGroup {
  id: string
  organization_id: string
  created_at: string
}

export interface Contact {
  id: string
  organization_id: string
  contact_group_id: string
  first_name: string
  last_name: string
  company_name?: string
  mobile_phone?: string
  email?: string
  address?: string
  type: ContactType
  is_primary: boolean
  created_at: string
  updated_at: string
}
export interface PersonFormValue {
  id: string
  first_name: string
  last_name: string
  company_name: string
  mobile_phone: string
  email: string
  address: string
  is_primary: boolean
}

export interface ContactFormValue {
  people: PersonFormValue[]
}

export type FolioType = 'OWNER' | 'TENANT' | 'SUPPLIER'

export interface Folio {
  id: string
  contact_group_id: string
  folio_type: FolioType
  folio_number: string
  reference_id: string
  organization_id: string
  created_at: string
}

export interface OwnerLedgerRow {
  id: string
  date: string
  description: string
  folio_number: string
  folio_type: FolioType
  type: 'RENT_RECEIVED' | 'INVOICE_RECEIVED' | 'BILL_PAID'
  amount_in: number
  amount_out: number
  running_balance: number
}

export interface OwnerSummary {
  gross_income: number
  total_expenses: number
  net_income: number
  bills_pending: number
}
