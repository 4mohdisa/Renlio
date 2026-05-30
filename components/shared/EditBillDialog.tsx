"use client"

import { useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { mockSuppliers, mockBills, mockProperties } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import type { BillCategory } from "@/types"
import { toast } from "sonner"
import { billSchema, type BillFormValues } from "@/lib/validations"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface EditBillDialogProps {
  billId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CATEGORY_OPTIONS: { label: string; value: BillCategory }[] = [
  { label: "Utilities", value: "UTILITIES" },
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Insurance", value: "INSURANCE" },
  { label: "Cleaning", value: "CLEANING" },
  { label: "Repairs", value: "REPAIRS" },
  { label: "Tax", value: "TAX" },
  { label: "Management Fee", value: "MANAGEMENT_FEE" },
  { label: "Supplies", value: "SUPPLIES" },
  { label: "Other", value: "OTHER" },
]

export function EditBillDialog({ billId, open, onOpenChange }: EditBillDialogProps) {
  const bill = mockBills.find((b) => b.id === billId)
  
  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      supplier_id: "",
      property_id: "",
      category: "UTILITIES",
      description: "",
      amount: 0,
      due_date: "",
      issue_date: "",
      include_tax: false,
    },
  })

  // Populate form when dialog opens
  useEffect(() => {
    if (open && bill) {
      form.reset({
        supplier_id: bill.supplier_id ?? "",
        property_id: bill.property_id,
        category: bill.category,
        description: bill.description ?? "",
        amount: bill.amount,
        due_date: bill.due_date,
        issue_date: bill.issue_date,
        include_tax: bill.tax_amount ? bill.tax_amount > 0 : false,
      })
    }
  }, [open, bill, form])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const watchAmount = form.watch("amount")
  const watchTax = form.watch("include_tax")

  const total = useMemo(() => {
    const baseAmount = Number(watchAmount) || 0
    if (watchTax) {
      return (baseAmount * 1.1).toFixed(2)
    }
    return baseAmount.toFixed(2)
  }, [watchAmount, watchTax])

  const handleSubmit = (values: BillFormValues) => {
    toast.success("Bill updated successfully")
    onOpenChange(false)
  }

  if (!bill) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none">
          <DialogHeader>
            <DialogTitle>Edit Bill</DialogTitle>
            <DialogDescription>Bill not found</DialogDescription>
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
            <DialogTitle>Edit Bill {bill.bill_number}</DialogTitle>
            <DialogDescription>Update bill details</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <FormField
                  control={form.control}
                  name="property_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockProperties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          placeholder="250.00"
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
                      <Textarea placeholder="e.g. Quarterly water bill" {...field} rows={2} />
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
