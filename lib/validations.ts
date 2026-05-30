import * as z from "zod"

// Helper for required string messages
const requiredString = (field: string) => z.string().min(1, `${field} is required`)

// ===============================
// Property Validations
// ===============================
export const propertySchema = z.object({
  name: requiredString("Property name").min(2, "Name must be at least 2 characters"),
  address_line_1: requiredString("Address"),
  address_line_2: z.string().optional(),
  city: requiredString("City"),
  state: z.string().optional(),
  postal_code: requiredString("Postcode").min(3, "Postcode must be at least 3 characters"),
  country: z.string().optional(),
  management_mode: z.enum(["WHOLE_PROPERTY", "ROOMING"]),
  total_rooms: z.number().min(0).optional(),
})

export interface PropertyFormValues {
  name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state?: string
  postal_code: string
  country?: string
  management_mode: "WHOLE_PROPERTY" | "ROOMING"
  total_rooms?: number
}

// ===============================
// Room Validations
// ===============================
export const roomSchema = z.object({
  room_label: requiredString("Room label").min(1, "Room label is required"),
  room_type: z.enum(["BEDROOM", "STUDIO", "SUITE", "OTHER"]),
})

export interface RoomFormValues {
  room_label: string
  room_type: "BEDROOM" | "STUDIO" | "SUITE" | "OTHER"
}

// ===============================
// Invoice Validations
// ===============================
export const invoiceSchema = z.object({
  category: z.enum([
    "RENT",
    "WATER",
    "GAS",
    "ELECTRICITY",
    "MAINTENANCE",
    "CLEANING",
    "GARDENING",
    "REPAIRS",
    "DEPOSIT",
    "BOND",
    "UTILITIES",
    "LATE_FEE",
    "ADMIN_FEE",
    "DAMAGES",
    "OTHER",
  ]),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  due_date: requiredString("Due date"),
  issue_date: z.string().optional(),
  invoice_source: z.enum(["OWNER", "SUPPLIER"]),
  supplier_id: z.string().optional(),
  include_tax: z.boolean().optional(),
  tenancy_id: z.string().optional(),
}).refine(
  (data) => {
    // Supplier is required when invoice_source is SUPPLIER
    if (data.invoice_source === "SUPPLIER" && !data.supplier_id) {
      return false
    }
    return true
  },
  {
    message: "Supplier is required when invoice source is Supplier",
    path: ["supplier_id"],
  }
)

export interface InvoiceFormValues {
  category: "RENT" | "WATER" | "GAS" | "ELECTRICITY" | "MAINTENANCE" | "CLEANING" | "GARDENING" | "REPAIRS" | "DEPOSIT" | "BOND" | "UTILITIES" | "LATE_FEE" | "ADMIN_FEE" | "DAMAGES" | "OTHER"
  description?: string
  amount: number
  due_date: string
  issue_date?: string
  invoice_source: "OWNER" | "SUPPLIER"
  supplier_id?: string
  include_tax?: boolean
  tenancy_id?: string
}

// ===============================
// Bill Validations
// ===============================
export const billSchema = z.object({
  supplier_id: requiredString("Supplier"),
  property_id: requiredString("Property"),
  category: z.enum([
    "MAINTENANCE",
    "CLEANING",
    "GARDENING",
    "UTILITIES",
    "TAX",
    "INSURANCE",
    "REPAIRS",
    "MANAGEMENT_FEE",
    "SUPPLIES",
    "OTHER",
  ]),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  due_date: requiredString("Due date"),
  issue_date: z.string().optional(),
  include_tax: z.boolean().optional(),
})

export interface BillFormValues {
  supplier_id: string
  property_id: string
  category: "MAINTENANCE" | "CLEANING" | "GARDENING" | "UTILITIES" | "TAX" | "INSURANCE" | "REPAIRS" | "MANAGEMENT_FEE" | "SUPPLIES" | "OTHER"
  description?: string
  amount: number
  due_date: string
  issue_date?: string
  include_tax?: boolean
}

// ===============================
// Payment Validations
// ===============================
export const recordPaymentSchema = z.object({
  property_id: requiredString("Property"),
  tenancy_id: requiredString("Tenancy"),
  amount: z.number().positive("Amount must be greater than 0"),
  payment_date: requiredString("Payment date"),
  method: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD", "DEBIT_CARD", "CHECK", "DIRECT_DEBIT"]),
  allocation_target: z.enum(["RENT", "BOND", "INVOICE"]),
  invoice_id: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    // Invoice is required when allocation_target is INVOICE
    if (data.allocation_target === "INVOICE" && !data.invoice_id) {
      return false
    }
    return true
  },
  {
    message: "Please select an invoice to pay",
    path: ["invoice_id"],
  }
)

export interface RecordPaymentFormValues {
  property_id: string
  tenancy_id: string
  amount: number
  payment_date: string
  method: "CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "DEBIT_CARD" | "CHECK" | "DIRECT_DEBIT"
  allocation_target: "RENT" | "BOND" | "INVOICE"
  invoice_id?: string
  notes?: string
}

// ===============================
// Lease/Tenancy Validations
// ===============================
export const leaseSchema = z.object({
  lease_start_date: requiredString("Lease start date"),
  lease_end_date: z.string().optional(),
  move_in_date: requiredString("Move in date"),
  move_out_date: z.string().optional(),
}).refine(
  (data) => {
    // If both dates exist, end date must be after start date
    if (data.lease_end_date && data.lease_start_date) {
      return new Date(data.lease_end_date) > new Date(data.lease_start_date)
    }
    return true
  },
  {
    message: "Lease end date must be after start date",
    path: ["lease_end_date"],
  }
)

export type LeaseFormValues = z.infer<typeof leaseSchema>

// ===============================
// Rent & Bond Validations
// ===============================
export const rentBondSchema = z.object({
  rent_amount: z.number().positive("Rent amount must be greater than 0"),
  rent_frequency: z.enum(["WEEKLY", "FORTNIGHTLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
  bond_required: z.number().min(0, "Bond amount cannot be negative").optional(),
  bond_paid: z.number().min(0, "Bond paid cannot be negative").optional(),
})

export interface RentBondFormValues {
  rent_amount: number
  rent_frequency: "WEEKLY" | "FORTNIGHTLY" | "MONTHLY" | "QUARTERLY" | "YEARLY"
  bond_required?: number
  bond_paid?: number
}

// ===============================
// Contact Validations
// ===============================
export const contactSchema = z.object({
  first_name: requiredString("First name").min(1, "First name is required"),
  last_name: requiredString("Last name").min(1, "Last name is required"),
  email: z.union([z.string().email("Invalid email address"), z.string().length(0)]).optional(),
  mobile_phone: z.string().optional(),
  work_phone: z.string().optional(),
  home_phone: z.string().optional(),
  address: z.string().optional(),
  type: z.enum(["OWNER", "TENANT", "SUPPLIER", "AGENT", "OTHER"]),
  is_primary: z.boolean().default(false),
})

export type ContactFormValues = z.infer<typeof contactSchema>

// ===============================
// Tenant Validations
// ===============================
export const tenantSchema = z.object({
  first_name: requiredString("First name").min(1, "First name is required"),
  last_name: requiredString("Last name").min(1, "Last name is required"),
  email: z.union([z.string().email("Invalid email address"), z.string().length(0)]).optional(),
  phone: z.string().optional(),
  payment_reference: z.string().optional(),
  date_of_birth: z.string().optional(),
})

export type TenantFormValues = z.infer<typeof tenantSchema>

// ===============================
// End Tenancy Validations
// ===============================
export const endTenancySchema = z.object({
  end_date: requiredString("End date"),
  end_reason: z.enum([
    "LEASE_ENDED",
    "MUTUAL_AGREEMENT",
    "TENANT_REQUESTED",
    "BREACH_OF_LEASE",
    "OTHER",
  ]),
  notes: z.string().optional(),
})

export type EndTenancyFormValues = z.infer<typeof endTenancySchema>

// ===============================
// Transaction Validations
// ===============================
export const transactionSchema = z.object({
  tenancy_id: requiredString("Tenancy"),
  type: z.enum(["PAYMENT", "CREDIT", "DEBIT", "ADJUSTMENT", "REFUND"]),
  method: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD", "DEBIT_CARD", "CHECK", "DIRECT_DEBIT"]),
  amount: z.number().positive("Amount must be greater than 0"),
  transaction_date: requiredString("Transaction date"),
  notes: z.string().optional(),
})

export interface TransactionFormValues {
  tenancy_id: string
  type: "PAYMENT" | "CREDIT" | "DEBIT" | "ADJUSTMENT" | "REFUND"
  method: "CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "DEBIT_CARD" | "CHECK" | "DIRECT_DEBIT"
  amount: number
  transaction_date: string
  notes?: string
}
