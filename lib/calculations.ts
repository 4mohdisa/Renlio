import type { Tenancy, Transaction, Invoice, Bill, Property } from '@/types'

// ============================================================
// DAILY RATE CALCULATION
// ============================================================

/**
 * Calculate daily rate from rent amount and frequency
 * Weekly: amount / 7
 * Fortnightly: amount / 14
 * Monthly: amount * 12 / 365
 */
export function calculateDailyRate(
  rentAmount: number,
  frequency: string
): number {
  switch (frequency) {
    case 'WEEKLY': return rentAmount / 7
    case 'FORTNIGHTLY': return rentAmount / 14
    case 'MONTHLY': return (rentAmount * 12) / 365
    case 'QUARTERLY': return (rentAmount * 4) / 365
    case 'ANNUALLY': return rentAmount / 365
    default: return (rentAmount * 12) / 365
  }
}

// ============================================================
// PAID TO DATE CALCULATION
// ============================================================

/**
 * Calculate paid-to-date from total rent paid and daily rate
 * paid_to_date = move_in_date + (total_rent_paid / daily_rate) days
 */
export function calculatePaidToDate(
  moveInDate: string,
  totalRentPaid: number,
  dailyRate: number
): Date {
  if (dailyRate === 0) return new Date(moveInDate)
  const daysCovered = Math.floor(totalRentPaid / dailyRate)
  const moveIn = new Date(moveInDate)
  const result = new Date(moveIn)
  result.setDate(result.getDate() + daysCovered)
  return result
}

// ============================================================
// RENT ARREARS CALCULATION
// ============================================================

/**
 * Calculate rent arrears for a tenancy
 * rent_arrears = rent_due_as_of_today - total_rent_paid
 * rent_due = daily_rate * days_since_move_in
 * Returns positive number when in arrears, negative when in advance
 */
export function calculateRentArrears(
  moveInDate: string,
  dailyRate: number,
  totalRentPaid: number,
  asOfDate: Date = new Date()
): number {
  const moveIn = new Date(moveInDate)
  const msPerDay = 1000 * 60 * 60 * 24
  const daysSinceMoveIn = Math.max(
    0,
    Math.floor((asOfDate.getTime() - moveIn.getTime()) / msPerDay)
  )
  const rentDue = dailyRate * daysSinceMoveIn
  return Math.round((rentDue - totalRentPaid) * 100) / 100
}

// ============================================================
// INVOICE ARREARS CALCULATION
// ============================================================

/**
 * Sum of remaining_balance across all non-rent invoices for a tenancy
 * Only includes ISSUED and PARTIALLY_PAID status invoices
 */
export function calculateInvoiceArrears(
  tenancyId: string,
  invoices: Invoice[]
): number {
  return invoices
    .filter(
      (inv) =>
        inv.tenancy_id === tenancyId &&
        inv.category !== 'RENT' &&
        (inv.status === 'ISSUED' || inv.status === 'PARTIALLY_PAID' || inv.status === 'OVERDUE')
    )
    .reduce((sum, inv) => sum + inv.remaining_balance, 0)
}

// ============================================================
// TOTAL RENT PAID FOR A TENANCY
// ============================================================

/**
 * Sum all RENT-allocated transactions for a tenancy
 */
export function calculateTotalRentPaid(
  tenancyId: string,
  transactions: Transaction[]
): number {
  return transactions
    .filter(
      (t) =>
        t.tenancy_id === tenancyId &&
        (t as Transaction & { allocation_target?: string }).allocation_target === 'RENT' &&
        t.status === 'COMPLETED'
    )
    .reduce((sum, t) => sum + t.amount, 0)
}

// ============================================================
// TENANCY FINANCIAL SUMMARY
// ============================================================

export interface TenancyFinancials {
  daily_rate: number
  total_rent_paid: number
  paid_to_date: Date
  rent_arrears: number
  invoice_arrears: number
  total_arrears: number
  bond_outstanding: number
}

/**
 * Compute all financial metrics for a single tenancy
 */
export function computeTenancyFinancials(
  tenancy: Tenancy,
  transactions: Transaction[],
  invoices: Invoice[]
): TenancyFinancials {
  const dailyRate = calculateDailyRate(tenancy.rent_amount, tenancy.rent_frequency)
  const totalRentPaid = calculateTotalRentPaid(tenancy.id, transactions)
  const paidToDate = calculatePaidToDate(tenancy.move_in_date, totalRentPaid, dailyRate)
  const rentArrears = calculateRentArrears(tenancy.move_in_date, dailyRate, totalRentPaid)
  const invoiceArrears = calculateInvoiceArrears(tenancy.id, invoices)
  const totalArrears = Math.max(0, rentArrears) + invoiceArrears
  const bondOutstanding = Math.max(0, (tenancy.bond_required ?? 0) - (tenancy.bond_paid ?? 0))

  return {
    daily_rate: Math.round(dailyRate * 10000) / 10000,
    total_rent_paid: totalRentPaid,
    paid_to_date: paidToDate,
    rent_arrears: rentArrears,
    invoice_arrears: invoiceArrears,
    total_arrears: totalArrears,
    bond_outstanding: bondOutstanding,
  }
}

// ============================================================
// PROPERTY FINANCIAL SUMMARY
// ============================================================

export interface PropertyFinancials {
  total_monthly_rent: number
  total_rent_arrears: number
  total_invoice_arrears: number
  total_arrears: number
  occupied_rooms: number
  total_rooms: number
  occupancy_rate: number
  pending_bills_value: number
}

/**
 * Aggregate all tenancy financials for a property
 */
export function computePropertyFinancials(
  propertyId: string,
  tenancies: Tenancy[],
  transactions: Transaction[],
  invoices: Invoice[],
  bills: Bill[],
  rooms?: { id: string; property_id: string }[]
): PropertyFinancials {
  const activeTenancies = tenancies.filter(
    (t) => t.property_id === propertyId && t.status === 'ACTIVE'
  )

  let totalMonthlyRent = 0
  let totalRentArrears = 0
  let totalInvoiceArrears = 0

  for (const tenancy of activeTenancies) {
    const fin = computeTenancyFinancials(tenancy, transactions, invoices)
    // Normalise to monthly for display
    const monthlyRent =
      tenancy.rent_frequency === 'WEEKLY'
        ? tenancy.rent_amount * (52 / 12)
        : tenancy.rent_frequency === 'FORTNIGHTLY'
        ? tenancy.rent_amount * (26 / 12)
        : tenancy.rent_amount
    totalMonthlyRent += monthlyRent
    totalRentArrears += Math.max(0, fin.rent_arrears)
    totalInvoiceArrears += fin.invoice_arrears
  }

  const propertyRooms = rooms?.filter((r) => r.property_id === propertyId) ?? []
  const totalRooms = propertyRooms.length
  const occupiedRooms = activeTenancies.length

  const pendingBillsValue = bills
    .filter(
      (b) =>
        b.property_id === propertyId &&
        (b.status === 'PENDING' || b.status === 'OVERDUE')
    )
    .reduce((sum, b) => sum + b.remaining_balance, 0)

  return {
    total_monthly_rent: Math.round(totalMonthlyRent * 100) / 100,
    total_rent_arrears: Math.round(totalRentArrears * 100) / 100,
    total_invoice_arrears: Math.round(totalInvoiceArrears * 100) / 100,
    total_arrears: Math.round((totalRentArrears + totalInvoiceArrears) * 100) / 100,
    occupied_rooms: occupiedRooms,
    total_rooms: totalRooms,
    occupancy_rate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
    pending_bills_value: Math.round(pendingBillsValue * 100) / 100,
  }
}

// ============================================================
// PORTFOLIO SUMMARY (ALL PROPERTIES)
// ============================================================

export interface PortfolioSummary {
  total_properties: number
  total_occupied_rooms: number
  total_rooms: number
  total_pending_invoices: number
  total_pending_invoices_value: number
  total_overdue_bills: number
  total_overdue_bills_value: number
  total_rent_arrears: number
  total_invoice_arrears: number
}

export function computePortfolioSummary(
  properties: Property[],
  tenancies: Tenancy[],
  transactions: Transaction[],
  invoices: Invoice[],
  bills: Bill[],
  rooms: { id: string; property_id: string }[]
): PortfolioSummary {
  let totalOccupied = 0
  let totalRooms = 0
  let totalRentArrears = 0
  let totalInvoiceArrears = 0

  for (const property of properties) {
    const fin = computePropertyFinancials(
      property.id,
      tenancies,
      transactions,
      invoices,
      bills,
      rooms
    )
    totalOccupied += fin.occupied_rooms
    totalRooms += fin.total_rooms
    totalRentArrears += fin.total_rent_arrears
    totalInvoiceArrears += fin.total_invoice_arrears
  }

  const pendingInvoices = invoices.filter(
    (inv) => inv.status === 'ISSUED' || inv.status === 'PARTIALLY_PAID'
  )
  const overdueBills = bills.filter((b) => b.status === 'OVERDUE')

  return {
    total_properties: properties.length,
    total_occupied_rooms: totalOccupied,
    total_rooms: totalRooms,
    total_pending_invoices: pendingInvoices.length,
    total_pending_invoices_value: pendingInvoices.reduce((s, i) => s + i.remaining_balance, 0),
    total_overdue_bills: overdueBills.length,
    total_overdue_bills_value: overdueBills.reduce((s, b) => s + b.remaining_balance, 0),
    total_rent_arrears: Math.round(totalRentArrears * 100) / 100,
    total_invoice_arrears: Math.round(totalInvoiceArrears * 100) / 100,
  }
}

// ============================================================
// SUPPLIER FOLIO METRICS
// ============================================================

export interface SupplierFolioMetrics {
  payments_pending: number
  pending_bills_count: number
  income_received: number
  paid_invoices_count: number
}

export function computeSupplierFolioMetrics(
  supplierId: string,
  supplierName: string,
  bills: Bill[],
  invoices: Invoice[]
): SupplierFolioMetrics {
  const supplierBills = bills.filter((b) => b.supplier_name === supplierName)
  const supplierInvoices = invoices.filter(
    (inv) => (inv as Invoice & { supplier_id?: string }).supplier_id === supplierId
  )

  const pendingBills = supplierBills.filter(
    (b) => b.status === 'PENDING' || b.status === 'OVERDUE'
  )
  const paidInvoices = supplierInvoices.filter((inv) => inv.status === 'PAID')

  return {
    payments_pending: pendingBills.reduce((s, b) => s + b.remaining_balance, 0),
    pending_bills_count: pendingBills.length,
    income_received: paidInvoices.reduce((s, inv) => s + inv.amount_paid, 0),
    paid_invoices_count: paidInvoices.length,
  }
}

// ============================================================
// OWNER FOLIO METRICS
// ============================================================

export interface OwnerFolioMetrics {
  gross_income: number
  total_expenses: number
  net_income: number
  bills_pending: number
}

export function computeOwnerFolioMetrics(
  propertyId: string,
  ownerLedgerRows: { amount_in: number; amount_out: number }[],
  bills: Bill[]
): OwnerFolioMetrics {
  const grossIncome = ownerLedgerRows.reduce((s, r) => s + r.amount_in, 0)
  const totalExpenses = ownerLedgerRows.reduce((s, r) => s + r.amount_out, 0)
  const billsPending = bills
    .filter(
      (b) =>
        b.property_id === propertyId &&
        (b.status === 'PENDING' || b.status === 'OVERDUE')
    )
    .reduce((s, b) => s + b.remaining_balance, 0)

  return {
    gross_income: Math.round(grossIncome * 100) / 100,
    total_expenses: Math.round(totalExpenses * 100) / 100,
    net_income: Math.round((grossIncome - totalExpenses) * 100) / 100,
    bills_pending: Math.round(billsPending * 100) / 100,
  }
}

// ============================================================
// FORMATTING HELPERS
// ============================================================

export function formatArrears(value: number): {
  display: string
  color: string
  isInArrears: boolean
  isInAdvance: boolean
  isClear: boolean
} {
  const rounded = Math.round(value * 100) / 100
  if (rounded > 0) {
    return {
      display: formatCurrencyValue(rounded),
      color: 'text-red-600',
      isInArrears: true,
      isInAdvance: false,
      isClear: false,
    }
  }
  if (rounded < 0) {
    return {
      display: formatCurrencyValue(Math.abs(rounded)) + ' adv',
      color: 'text-green-600',
      isInArrears: false,
      isInAdvance: true,
      isClear: false,
    }
  }
  return {
    display: 'Clear',
    color: 'text-green-600',
    isInArrears: false,
    isInAdvance: false,
    isClear: true,
  }
}

function formatCurrencyValue(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(value)
}
