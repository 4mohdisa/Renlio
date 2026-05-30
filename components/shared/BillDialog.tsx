"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  mockBills,
  getPropertyById,
  getSupplierById,
} from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { toastSuccess } from "@/lib/toast"
import Link from "next/link"
import { EditBillDialog } from "./EditBillDialog"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface BillDialogProps {
  billId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'CHEQUE', label: 'Cheque' },
] as const

// Schema for bill payment
const billPaymentSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  method: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD", "CHEQUE"]),
  notes: z.string().optional(),
})

interface BillPaymentFormValues {
  amount: number
  date: string
  method: "CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "CHEQUE"
  notes?: string
}

export function BillDialog({ billId, open, onOpenChange }: BillDialogProps) {
  const bill = mockBills.find((b) => b.id === billId)
  const property = bill ? getPropertyById(bill.property_id) : undefined
  const supplier = bill?.supplier_id ? getSupplierById(bill.supplier_id) : undefined

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false)

  // Simulate bill payments
  const hasPayments = bill?.status === "PAID"

  if (!bill) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Bill not found</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const title = `Bill #${bill.bill_number}${bill.description ? ` — ${bill.description}` : ""}`

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none p-0 gap-0">
        <div className="p-6 space-y-6">
          {/* Title */}
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {bill.status !== 'PAID' && (
              <Button size="sm" onClick={() => setRecordPaymentOpen(true)}>
                <CreditCard className="size-4 mr-2" />
                Record Payment
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
              <Edit className="size-4 mr-2" />
              Edit
            </Button>
          </div>

          <hr className="border-border" />

          {/* Metadata Grid - Cleaned */}
          <div className="grid grid-cols-4 gap-6 text-sm">
            {/* Row 1 */}
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Created Date</p>
              <p className="font-medium text-foreground mt-1">{formatDate(bill.created_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Supplier</p>
              {supplier ? (
                <Link href={`/suppliers/${supplier.id}`} className="font-medium text-accent hover:underline mt-1 block">
                  {supplier.name}
                </Link>
              ) : (
                <p className="font-medium text-foreground mt-1">{bill.supplier_name ?? "—"}</p>
              )}
            </div>
            <div></div>
            <div></div>

            {/* Row 2 */}
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Due Date</p>
              <p className="font-medium text-foreground mt-1">{formatDate(bill.due_date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Property</p>
              {property ? (
                <Link href={`/properties/${property.id}`} className="font-medium text-accent hover:underline mt-1 block">
                  {property.name}
                </Link>
              ) : (
                <p className="font-medium text-foreground mt-1">—</p>
              )}
            </div>
            <div></div>
            <div></div>
          </div>

          {/* Bill Details Card - No Tax column */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-surface-alt/50">
              <h3 className="text-sm font-semibold text-foreground">Bill Details</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-alt hover:bg-surface-alt">
                  <TableHead className="w-[200px]">Contact</TableHead>
                  <TableHead className="w-[160px]">Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px] text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span className="font-medium text-foreground">Property Owner</span>
                  </TableCell>
                  <TableCell className="capitalize">{bill.category.toLowerCase().replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-muted-foreground">{bill.description ?? "—"}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(bill.amount)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="px-4 py-3 border-t border-border bg-surface-alt/30">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold text-foreground">{formatCurrency(bill.total_amount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Transactions Card */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-surface-alt/50">
              <h3 className="text-sm font-semibold text-foreground">Payment Transactions</h3>
            </div>
            {hasPayments ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-surface-alt hover:bg-surface-alt">
                      <TableHead className="w-[180px]">Contact</TableHead>
                      <TableHead className="w-[160px]">Category</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead className="w-[120px]">Date</TableHead>
                      <TableHead className="w-[120px] text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <span className="font-medium text-foreground">Property Owner</span>
                      </TableCell>
                      <TableCell className="capitalize">{bill.category.toLowerCase().replace(/_/g, " ")}</TableCell>
                      <TableCell className="text-muted-foreground">Bank Transfer</TableCell>
                      <TableCell>{formatDate(bill.paid_date ?? bill.due_date)}</TableCell>
                      <TableCell className="text-right font-medium text-success">{formatCurrency(bill.amount_paid)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="px-4 py-3 border-t border-border bg-surface-alt/30">
                  <div className="flex justify-end items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                      <p className="font-semibold text-success">{formatCurrency(bill.amount_paid)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className={cn("font-semibold", bill.remaining_balance > 0 ? "text-destructive" : "text-success")}>
                        {formatCurrency(bill.remaining_balance)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">No payment transactions recorded</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This bill has not been paid yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <EditBillDialog
      billId={billId}
      open={isEditOpen}
      onOpenChange={setIsEditOpen}
    />

    <RecordPaymentDialog
      bill={bill}
      open={recordPaymentOpen}
      onOpenChange={setRecordPaymentOpen}
      onPaymentRecorded={() => {
        setRecordPaymentOpen(false)
        onOpenChange(false)
      }}
    />
    </>
  )
}

interface RecordPaymentDialogProps {
  bill: typeof mockBills[0]
  open: boolean
  onOpenChange: (open: boolean) => void
  onPaymentRecorded: () => void
}

function RecordPaymentDialog({ bill, open, onOpenChange, onPaymentRecorded }: RecordPaymentDialogProps) {
  const form = useForm<BillPaymentFormValues>({
    resolver: zodResolver(billPaymentSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: "BANK_TRANSFER",
      notes: "",
    },
  })

  const watchAmount = form.watch("amount")
  const isAmountValid = watchAmount > 0 && watchAmount <= bill.remaining_balance

  const handleSubmit = (values: BillPaymentFormValues) => {
    if (!isAmountValid) return
    toastSuccess(`Payment of ${formatCurrency(values.amount)} recorded against ${bill.bill_number}`)
    onPaymentRecorded()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment — {bill.bill_number}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <Input
                        type="number"
                        min="0.01"
                        max={bill.remaining_balance}
                        step="0.01"
                        className="pl-7"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  {watchAmount > bill.remaining_balance && (
                    <p className="text-sm text-red-500 mt-1">
                      Amount cannot exceed the remaining balance of {formatCurrency(bill.remaining_balance)}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes <span className="text-slate-400">(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this payment..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button 
                type="submit"
                className="w-full"
                disabled={!isAmountValid}
              >
                Record Payment
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
