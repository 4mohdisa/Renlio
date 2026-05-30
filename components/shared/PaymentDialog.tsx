"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
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
import { ConfirmDialog } from "./ConfirmDialog"
import {
  mockTransactions,
  getTenantById,
  getTenancyById,
  getPropertyById,
} from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { EditTransactionDialog } from "./EditTransactionDialog"

interface PaymentDialogProps {
  paymentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentDialog({ paymentId, open, onOpenChange }: PaymentDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  const txn = mockTransactions.find((t) => t.id === paymentId)
  const tenant = txn?.tenant_id ? getTenantById(txn.tenant_id) : undefined
  const tenancy = txn?.tenancy_id ? getTenancyById(txn.tenancy_id) : undefined
  const property = tenancy ? getPropertyById(tenancy.property_id) : undefined

  // Dynamic title based on transaction notes
  const title = txn?.notes 
    ? `${txn.notes} — ${formatCurrency(txn.amount)}`
    : `Payment of ${formatCurrency(txn?.amount || 0)} — ${txn?.transaction_date ? formatDate(txn.transaction_date) : "—"}`

  const handleEdit = () => {
    setIsEditOpen(true)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    toast.success("Transaction deleted")
    setShowDeleteConfirm(false)
    onOpenChange(false)
  }

  if (!txn) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Payment not found</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-2xl max-h-[90dvh] overflow-y-auto sm:overflow-y-hidden sm:max-h-none p-0 gap-0">
          <div className="p-6 space-y-6">
            {/* Dynamic Title - No "Receipt" word */}
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>

            {/* Action Buttons - Edit and Delete */}
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleEdit}>
                <Pencil className="size-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="size-4 mr-2" />
                Delete
              </Button>
            </div>

            <hr className="border-border" />

            {/* Metadata Grid - Cleaned: Removed Cleared Date, Processed By */}
            <div className="grid grid-cols-4 gap-6 text-sm">
              {/* Row 1 */}
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Created Date</p>
                <p className="font-medium text-foreground mt-1">{formatDate(txn.created_at)}</p>
              </div>
              <div></div>
              <div></div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Paid by</p>
                <p className="font-medium text-foreground mt-1 capitalize">{txn.method.toLowerCase().replace(/_/g, " ")}</p>
              </div>

              {/* Row 2 */}
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Transaction Date</p>
                <p className="font-medium text-foreground mt-1">{formatDate(txn.transaction_date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Property</p>
                {property ? (
                  <p className="font-medium text-accent mt-1">{property.name}</p>
                ) : (
                  <p className="font-medium text-foreground mt-1">—</p>
                )}
              </div>
              <div></div>
              <div></div>
            </div>

            {/* Transaction Details Card - Cleaned: Removed Chart Account, Folio, Tax */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface-alt/50">
                <h3 className="text-sm font-semibold text-foreground">Transaction Details</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-surface-alt hover:bg-surface-alt">
                    <TableHead className="w-[200px]">Contact</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[120px] text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {tenant ? (
                        <span className="font-medium text-accent">
                          {tenant.first_name} {tenant.last_name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{txn.notes ?? `Payment - ${txn.method.replace(/_/g, " ")}`}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(txn.amount)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="px-4 py-3 border-t border-border bg-surface-alt/30">
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(txn.amount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      <EditTransactionDialog
        transactionId={paymentId}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  )
}
