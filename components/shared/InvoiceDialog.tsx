"use client"

import { useState } from "react"
import { Building2, CreditCard, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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
  mockInvoices,
  mockTransactions,
  getTenancyById,
  getTenantById,
  getPropertyById,
  getSupplierById,
} from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { EditInvoiceDialog } from "./EditInvoiceDialog"

interface InvoiceDialogProps {
  invoiceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceDialog({ invoiceId, open, onOpenChange }: InvoiceDialogProps) {
  const invoice = mockInvoices.find((i) => i.id === invoiceId)
  const tenancy = invoice ? getTenancyById(invoice.tenancy_id) : undefined
  const tenant = tenancy ? getTenantById(tenancy.tenant_id) : undefined
  const property = tenancy ? getPropertyById(tenancy.property_id) : undefined
  const supplier = invoice?.supplier_id ? getSupplierById(invoice.supplier_id) : undefined

  const [isEditOpen, setIsEditOpen] = useState(false)

  // Get payments for this invoice (simulated from transactions)
  const invoicePayments = mockTransactions.filter(
    (t) => t.tenancy_id === invoice?.tenancy_id && t.status === "COMPLETED"
  )

  if (!invoice) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Invoice not found</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const title = `Invoice #${invoice.invoice_number}${invoice.description ? ` — ${invoice.description}` : ""}`

  const isPaid = invoice.status === "PAID"
  const issuedByName = invoice.invoice_source === "OWNER" ? "Property Owner" : supplier?.name ?? "Unknown Supplier"

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none p-0 gap-0">
        <div className="p-6 space-y-6">
          {/* Title */}
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>

          {/* Action Buttons - Removed Receipt and Copy */}
          <div className="flex items-center gap-2">
            {!isPaid && (
              <Link href="/payments/new">
                <Button size="sm" variant="outline">
                  <CreditCard className="size-4 mr-2" />
                  Record Payment
                </Button>
              </Link>
            )}
            <Button variant="secondary" size="sm" className="text-destructive hover:text-destructive">
              <X className="size-4 mr-2" />
              Cancel
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
              <Edit className="size-4 mr-2" />
              Edit
            </Button>
          </div>

          <hr className="border-border" />

          {/* Metadata Grid - Cleaned: Removed Document, Audit #, Priority, Processed By */}
          <div className="grid grid-cols-4 gap-6 text-sm">
            {/* Row 1 */}
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Created Date</p>
              <p className="font-medium text-foreground mt-1">{formatDate(invoice.created_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Issued By</p>
              <div className="flex items-center gap-2 mt-1">
                {invoice.invoice_source === "OWNER" ? (
                  <Building2 className="size-4 text-muted-foreground" />
                ) : (
                  <span className="text-muted-foreground">🚚</span>
                )}
                <span className="font-medium text-foreground">{issuedByName}</span>
              </div>
            </div>
            <div></div>
            <div></div>

            {/* Row 2 */}
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Due Date</p>
              <p className="font-medium text-foreground mt-1">{formatDate(invoice.due_date)}</p>
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

          {/* Invoice Details Card - Cleaned: Removed Folio, Chart Account, Tax columns */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-surface-alt/50">
              <h3 className="text-sm font-semibold text-foreground">Invoice Details</h3>
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
                    {tenant ? (
                      <Link href={`/tenancies/${tenancy?.id}`} className="font-medium text-accent hover:underline">
                        {tenant.first_name} {tenant.last_name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="capitalize">{invoice.category.toLowerCase().replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.description ?? "—"}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(invoice.amount)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="px-4 py-3 border-t border-border bg-surface-alt/30">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold text-foreground">{formatCurrency(invoice.total_amount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Payments Card */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-surface-alt/50">
              <h3 className="text-sm font-semibold text-foreground">Invoice Payments</h3>
            </div>
            {invoicePayments.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-surface-alt hover:bg-surface-alt">
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead className="w-[100px]">Receipt #</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead className="w-[100px] text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoicePayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.transaction_date)}</TableCell>
                        <TableCell>{payment.receipt_number ?? "—"}</TableCell>
                        <TableCell className="capitalize">{payment.type.toLowerCase().replace(/_/g, " ")}</TableCell>
                        <TableCell className="text-muted-foreground">{payment.method.replace(/_/g, " ")}</TableCell>
                        <TableCell className="text-right font-medium text-success">{formatCurrency(payment.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="px-4 py-3 border-t border-border bg-surface-alt/30">
                  <div className="flex justify-end items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                      <p className="font-semibold text-success">{formatCurrency(invoice.amount_paid)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className={cn("font-semibold", invoice.remaining_balance > 0 ? "text-destructive" : "text-success")}>
                        {formatCurrency(invoice.remaining_balance)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">No payments recorded against this invoice</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Record a payment to allocate funds to this invoice.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <EditInvoiceDialog
      invoiceId={invoiceId}
      open={isEditOpen}
      onOpenChange={setIsEditOpen}
    />
    </>
  )
}
