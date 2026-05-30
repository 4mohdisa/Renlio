"use client"

import { useMemo, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Truck, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockSuppliers } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { invoiceSchema, type InvoiceFormValues } from "@/lib/validations"
import { toastSuccess } from "@/lib/toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CATEGORY_OPTIONS = [
  { label: "Rent", value: "RENT" },
  { label: "Water Bill", value: "WATER" },
  { label: "Gas", value: "GAS" },
  { label: "Electricity", value: "ELECTRICITY" },
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Cleaning", value: "CLEANING" },
  { label: "Gardening", value: "GARDENING" },
  { label: "Repairs", value: "REPAIRS" },
]

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      category: "RENT",
      description: "",
      amount: 0,
      due_date: "",
      issue_date: "",
      invoice_source: "OWNER",
      supplier_id: "",
      include_tax: false,
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

  const watchAmount = form.watch("amount")
  const watchTax = form.watch("include_tax")
  const watchSource = form.watch("invoice_source")

  const total = useMemo(() => {
    const baseAmount = Number(watchAmount) || 0
    if (watchTax) {
      return (baseAmount * 1.1).toFixed(2)
    }
    return baseAmount.toFixed(2)
  }, [watchAmount, watchTax])

  const handleSubmit = async (values: InvoiceFormValues) => {
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate supplier selection when source is SUPPLIER
      if (values.invoice_source === "SUPPLIER" && !values.supplier_id) {
        throw new Error("Please select a supplier")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      toastSuccess("Invoice created successfully")
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>Issue a new invoice to a tenant.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-1">
            {/* Invoice Source Toggle */}
            <FormField
              control={form.control}
              name="invoice_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Source</FormLabel>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                          field.onChange("OWNER")
                          form.setValue("supplier_id", "")
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 ${
                          field.value === "OWNER"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Building2 className="size-4" />
                        Owner
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => field.onChange("SUPPLIER")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 ${
                          field.value === "SUPPLIER"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Truck className="size-4" />
                        Supplier
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {field.value === "OWNER"
                        ? "The property owner is charging the tenant directly."
                        : "A third-party supplier is charging the tenant."}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Supplier Selector (only when SUPPLIER) */}
            {watchSource === "SUPPLIER" && (
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier *</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm disabled:opacity-50"
                      >
                        <option value="">Select supplier</option>
                        {mockSuppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name} ({supplier.category.toLowerCase()})
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div>
              <FormLabel>Tenancy</FormLabel>
              <div className="rounded-lg border border-dashed border-border p-3 mt-1 text-sm text-muted-foreground">
                Tenancy selector — searchable by tenant name
              </div>
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full mt-1 h-10 rounded-md border border-border bg-background px-3 text-sm disabled:opacity-50"
                    >
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Rent - March 2024" disabled={isSubmitting} {...field} />
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
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="650.00"
                      disabled={isSubmitting}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Include Tax Checkbox */}
            <FormField
              control={form.control}
              name="include_tax"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">Include Tax (10%)</FormLabel>
                </FormItem>
              )}
            />

            {/* Total Display */}
            {watchAmount > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">Total including tax: </span>
                <span className="font-semibold">{formatCurrency(parseFloat(total))}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Issue Invoice
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
