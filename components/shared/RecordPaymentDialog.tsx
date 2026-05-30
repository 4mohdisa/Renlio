"use client"

import { useMemo, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockProperties, mockInvoices, mockTenancies, getTenantById } from "@/lib/mock-data"
import { toast } from "sonner"
import { formatCurrency, formatDate } from "@/lib/utils"
import { addDays, parseISO } from "date-fns"
import { recordPaymentSchema, type RecordPaymentFormValues } from "@/lib/validations"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface RecordPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const METHOD_OPTIONS = [
  { label: "Cash", value: "CASH" },
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
  { label: "Credit Card", value: "CREDIT_CARD" },
  { label: "Debit Card", value: "DEBIT_CARD" },
  { label: "Cheque", value: "CHECK" },
  { label: "Direct Debit", value: "DIRECT_DEBIT" },
]

export function RecordPaymentDialog({ open, onOpenChange }: RecordPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RecordPaymentFormValues>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      property_id: "",
      tenancy_id: "",
      amount: 0,
      payment_date: new Date().toISOString().split('T')[0],
      method: "BANK_TRANSFER",
      allocation_target: "RENT",
      invoice_id: "",
      notes: "",
    },
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
      setError(null)
      setIsSubmitting(false)
    }
  }, [open, form])

  const watchPropertyId = form.watch("property_id")
  const watchTenancyId = form.watch("tenancy_id")
  const watchAllocation = form.watch("allocation_target")
  const watchAmount = form.watch("amount")

  // Get pending invoices for the selected tenancy
  const pendingInvoices = useMemo(() => {
    if (!watchTenancyId) return []
    return mockInvoices.filter(
      (inv) => 
        inv.tenancy_id === watchTenancyId && 
        (inv.status === "ISSUED" || inv.status === "PARTIALLY_PAID")
    )
  }, [watchTenancyId])

  // Get selected invoice for validation
  const selectedInvoiceId = form.watch("invoice_id")
  const selectedInvoice = useMemo(() => {
    if (!selectedInvoiceId) return null
    return mockInvoices.find((inv) => inv.id === selectedInvoiceId)
  }, [selectedInvoiceId])

  // Get selected tenancy for bond validation and rent calculations
  const selectedTenancy = useMemo(() => {
    if (!watchTenancyId) return null
    return mockTenancies.find((t) => t.id === watchTenancyId)
  }, [watchTenancyId])

  // Calculate auto-generated rent note
  const generatedRentNote = useMemo(() => {
    if (watchAllocation !== "RENT" || !selectedTenancy || !watchAmount) return null
    
    const amountNum = Number(watchAmount) || 0
    if (amountNum <= 0) return null
    
    const dailyRate = selectedTenancy.daily_rate ?? 0
    if (dailyRate <= 0) return null
    
    const currentPaidToDate = selectedTenancy.paid_to_date 
      ? parseISO(selectedTenancy.paid_to_date)
      : new Date()
    
    const daysCovered = Math.floor(amountNum / dailyRate)
    const newPaidToDate = addDays(currentPaidToDate, daysCovered)
    
    return {
      fromDate: currentPaidToDate,
      toDate: newPaidToDate,
      text: `Paid to ${formatDate(newPaidToDate)} (from ${formatDate(currentPaidToDate)})`,
    }
  }, [watchAllocation, selectedTenancy, watchAmount])

  // Validation: amount cannot exceed invoice remaining balance
  const invoiceRemainingBalance = selectedInvoice?.remaining_balance ?? 0
  const isOverpayingInvoice = watchAllocation === "INVOICE" && selectedInvoice && watchAmount > invoiceRemainingBalance

  const handleAllocationChange = (value: "RENT" | "BOND" | "INVOICE" | null) => {
    if (!value) return
    form.setValue("allocation_target", value)
    form.setValue("invoice_id", "")
    
    // Check for bond validation
    if (value === "BOND" && selectedTenancy) {
      if (selectedTenancy.bond_status === "FULLY_PAID") {
        toast.info("Bond for this tenant is already fully paid")
        form.setValue("allocation_target", "RENT")
      }
    }
    
    // Check for pending invoices
    if (value === "INVOICE" && watchTenancyId) {
      if (pendingInvoices.length === 0) {
        toast.info("No pending invoices for this tenant")
      }
    }
  }

  const handleTenancyChange = (value: string) => {
    form.setValue("tenancy_id", value)
    form.setValue("invoice_id", "")
  }

  const handlePropertyChange = (value: string) => {
    form.setValue("property_id", value)
    form.setValue("tenancy_id", "")
    form.setValue("invoice_id", "")
  }

  const handleSubmit = async (values: RecordPaymentFormValues) => {
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate invoice allocation
      if (values.allocation_target === "INVOICE") {
        if (!values.invoice_id) {
          throw new Error("Please select an invoice to pay")
        }
        if (isOverpayingInvoice) {
          throw new Error(`Amount cannot exceed the outstanding balance of ${formatCurrency(invoiceRemainingBalance)}`)
        }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      toast.success("Payment recorded successfully")
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = watchAmount > 0 && watchPropertyId && watchTenancyId && 
    !(watchAllocation === "INVOICE" && pendingInvoices.length === 0) &&
    !isOverpayingInvoice

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>Log a new payment from a tenant.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-1">
            {/* Property Dropdown */}
            <FormField
              control={form.control}
              name="property_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property *</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(e) => handlePropertyChange(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full mt-1 h-10 rounded-md border border-border bg-background px-3 text-sm disabled:opacity-50"
                    >
                      <option value="">Select property</option>
                      {mockProperties.map((prop) => (
                        <option key={prop.id} value={prop.id}>{prop.name}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tenancy_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenancy *</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(e) => handleTenancyChange(e.target.value)}
                      disabled={!watchPropertyId || isSubmitting}
                      className="w-full mt-1 h-10 rounded-md border border-border bg-background px-3 text-sm disabled:opacity-50"
                    >
                      <option value="">Select tenancy</option>
                      {mockTenancies
                        .filter((t) => t.property_id === watchPropertyId)
                        .map((t) => {
                          const tenant = getTenantById(t.tenant_id)
                          return (
                            <option key={t.id} value={t.id}>
                              {tenant ? `${tenant.first_name} ${tenant.last_name}` : t.id}
                            </option>
                          )
                        })}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="800.00"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  {isOverpayingInvoice && (
                    <p className="text-xs text-destructive mt-1">
                      Amount cannot exceed the outstanding balance of {formatCurrency(invoiceRemainingBalance)}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="payment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date *</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {METHOD_OPTIONS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Conditional Notes Field - Only for INVOICE */}
            {watchAllocation === "INVOICE" && (
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Auto-generated Rent Note Preview */}
            {watchAllocation === "RENT" && generatedRentNote && (
              <div className="space-y-1.5">
                <FormLabel className="text-xs text-muted-foreground">Generated note</FormLabel>
                <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-600">
                  {generatedRentNote.text}
                </div>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <FormField
                control={form.control}
                name="allocation_target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocate This Payment *</FormLabel>
                    <Select value={field.value} onValueChange={handleAllocationChange} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RENT">Pay towards Rent</SelectItem>
                        <SelectItem value="BOND">Pay towards Bond</SelectItem>
                        <SelectItem value="INVOICE">Pay specific Invoice</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Invoice Selection - Show when INVOICE is selected */}
            {watchAllocation === "INVOICE" && (
              <FormField
                control={form.control}
                name="invoice_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Invoice *</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={pendingInvoices.length === 0 || isSubmitting}
                        className="w-full mt-1 h-10 rounded-md border border-border bg-background px-3 text-sm disabled:opacity-50"
                      >
                        <option value="">
                          {pendingInvoices.length === 0 ? "No pending invoices" : "Select invoice"}
                        </option>
                        {pendingInvoices.map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.invoice_number} — {inv.description} — Outstanding: {formatCurrency(inv.remaining_balance)}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Record Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
