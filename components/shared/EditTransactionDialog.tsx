"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { mockTransactions, mockTenancies, mockTenants } from "@/lib/mock-data"
import type { TransactionType, TransactionMethod } from "@/types"
import { toast } from "sonner"
import { transactionSchema, type TransactionFormValues } from "@/lib/validations"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface EditTransactionDialogProps {
  transactionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TYPE_OPTIONS: { label: string; value: TransactionType }[] = [
  { label: "Payment", value: "PAYMENT" },
  { label: "Credit", value: "CREDIT" },
  { label: "Debit", value: "DEBIT" },
  { label: "Adjustment", value: "ADJUSTMENT" },
]

const METHOD_OPTIONS: { label: string; value: TransactionMethod }[] = [
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
  { label: "Cash", value: "CASH" },
  { label: "Credit Card", value: "CREDIT_CARD" },
  { label: "Debit Card", value: "DEBIT_CARD" },
  { label: "Check", value: "CHECK" },
  { label: "Direct Debit", value: "DIRECT_DEBIT" },
]

export function EditTransactionDialog({ transactionId, open, onOpenChange }: EditTransactionDialogProps) {
  const transaction = mockTransactions.find((t) => t.id === transactionId)
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      tenancy_id: "",
      type: "PAYMENT",
      method: "BANK_TRANSFER",
      amount: 0,
      transaction_date: "",
      notes: "",
    },
  })

  // Populate form when dialog opens
  useEffect(() => {
    if (open && transaction) {
      form.reset({
        tenancy_id: transaction.tenancy_id ?? "",
        type: transaction.type,
        method: transaction.method,
        amount: transaction.amount,
        transaction_date: transaction.transaction_date,
        notes: transaction.notes ?? "",
      })
    }
  }, [open, transaction, form])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const handleSubmit = (values: TransactionFormValues) => {
    toast.success("Transaction updated successfully")
    onOpenChange(false)
  }

  if (!transaction) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Transaction not found</DialogDescription>
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
            <DialogTitle>Edit Transaction {transaction.receipt_number}</DialogTitle>
            <DialogDescription>Update transaction details</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tenancy_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenancy *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenancy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockTenancies.map((tenancy) => {
                            const tenant = mockTenants.find((t) => t.id === tenancy.tenant_id)
                            return (
                              <SelectItem key={tenancy.id} value={tenancy.id}>
                                {tenant ? `${tenant.first_name} ${tenant.last_name}` : tenancy.id}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TYPE_OPTIONS.map((opt) => (
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
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Method</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {METHOD_OPTIONS.map((opt) => (
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
                  name="transaction_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. Monthly rent payment" {...field} rows={2} />
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
