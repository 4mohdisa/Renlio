"use client"

import { useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockSuppliers, mockInvoices } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import type { InvoiceCategory } from "@/types"
import { toast } from "sonner"
import { invoiceSchema, type InvoiceFormValues } from "@/lib/validations"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface EditInvoiceDialogProps {
  invoiceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CATEGORY_OPTIONS: { label: string; value: InvoiceCategory }[] = [
  { label: "Rent", value: "RENT" },
  { label: "Deposit", value: "DEPOSIT" },
  { label: "Bond", value: "BOND" },
  { label: "Utilities", value: "UTILITIES" },
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Cleaning", value: "CLEANING" },
  { label: "Late Fee", value: "LATE_FEE" },
  { label: "Admin Fee", value: "ADMIN_FEE" },
  { label: "Damages", value: "DAMAGES" },
  { label: "Other", value: "OTHER" },
]

export function EditInvoiceDialog({ invoiceId, open, onOpenChange }: EditInvoiceDialogProps) {
  const invoice = mockInvoices.find((i) => i.id === invoiceId)
  
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

  // Populate form when dialog opens
  useEffect(() => {
    if (open && invoice) {
      form.reset({
        category: invoice.category,
        description: invoice.description ?? "",
        amount: invoice.amount,
        due_date: invoice.due_date,
        issue_date: invoice.issue_date,
        invoice_source: invoice.invoice_source,
        supplier_id: invoice.supplier_id ?? "",
        include_tax: invoice.tax_amount ? invoice.tax_amount > 0 : false,
      })
    }
  }, [open, invoice, form])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
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

  const handleSubmit = (values: InvoiceFormValues) => {
    toast.success("Invoice updated successfully")
    onOpenChange(false)
  }

  if (!invoice) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>Invoice not found</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none p-0 gap-0">
        <div className="p-6">
          <DialogHeader className="pb-4">
            <DialogTitle>Edit Invoice {invoice.invoice_number}</DialogTitle>
            <DialogDescription>Update invoice details</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Invoice Source Toggle */}
              <FormField
                control={form.control}
                name="invoice_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Source</FormLabel>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("OWNER")
                          form.setValue("supplier_id", "")
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
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
                        onClick={() => field.onChange("SUPPLIER")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          field.value === "SUPPLIER"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Truck className="size-4" />
                        Supplier
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Supplier Selector (only when SUPPLIER) */}
                {watchSource === "SUPPLIER" && (
                  <FormField
                    control={form.control}
                    name="supplier_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockSuppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
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
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">Include Tax (10%)</FormLabel>
                    {watchAmount > 0 && (
                      <span className="text-sm text-muted-foreground ml-2">
                        Total: <span className="font-semibold text-foreground">{formatCurrency(parseFloat(total))}</span>
                      </span>
                    )}
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
                      <Textarea placeholder="e.g. Rent - March 2024" {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
