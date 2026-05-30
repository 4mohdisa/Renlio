"use client"

import { useState, useEffect } from "react"
import {
  Building2,
  DoorOpen,
  FileText,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Activity,
} from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"

import { EmptyState } from "@/components/shared/EmptyState"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { InvoiceDialog } from "@/components/shared/InvoiceDialog"
import { BillDialog } from "@/components/shared/BillDialog"
import { PaymentDialog } from "@/components/shared/PaymentDialog"
import { SkeletonCard } from "@/components/shared/SkeletonCard"
import { SkeletonTable } from "@/components/shared/SkeletonTable"
import {
  mockProperties,
  mockInvoices,
  mockBills,
  mockTransactions,
  mockTenancies,
  mockRooms,
  getTenantById,
  getTenancyById,
} from "@/lib/mock-data"
import { computePortfolioSummary } from "@/lib/calculations"
import { formatCurrency, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  // Simulated loading state - will be replaced by TanStack Query isLoading in Phase 2
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Today's date formatted
  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // Compute portfolio summary using calculations engine
  const portfolioSummary = computePortfolioSummary(
    mockProperties,
    mockTenancies,
    mockTransactions,
    mockInvoices,
    mockBills,
    mockRooms
  )

  // Recent activity (transactions sorted by date desc)
  const recentTransactions = [...mockTransactions]
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    .slice(0, 10)

  // Pending invoices sorted by due date (most urgent first)
  const pendingInvoices = mockInvoices.filter(
    (i) => i.status === "ISSUED" || i.status === "PARTIALLY_PAID"
  )
  const urgentInvoices = [...pendingInvoices]
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5)

  // Overdue bills sorted by due date
  const overdueBills = mockBills.filter((b) => b.status === "OVERDUE")
  const urgentBills = [...overdueBills]
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5)

  // Dialog states
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null)
  const [billDialogOpen, setBillDialogOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const handleInvoiceClick = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId)
    setInvoiceDialogOpen(true)
  }

  const handleBillClick = (billId: string) => {
    setSelectedBillId(billId)
    setBillDialogOpen(true)
  }

  const handlePaymentClick = (paymentId: string) => {
    setSelectedPaymentId(paymentId)
    setPaymentDialogOpen(true)
  }

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        description={today}
      />
      {/* SECTION 2 — Top metric cards row (4 cards side by side) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* Card 1 — Total Properties */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg p-2.5 bg-surface-alt text-muted-foreground">
                  <Building2 className="size-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Total Properties</span>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{portfolioSummary.total_properties}</p>
            </div>

            {/* Card 2 — Occupied Rooms */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg p-2.5 bg-surface-alt text-muted-foreground">
                  <DoorOpen className="size-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Occupied Rooms</span>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">
                {portfolioSummary.total_occupied_rooms} <span className="text-muted-foreground text-lg">/ {portfolioSummary.total_rooms}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">rooms</p>
            </div>

            {/* Card 3 — Pending Invoices */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    "rounded-lg p-2.5",
                    portfolioSummary.total_pending_invoices > 0
                      ? "bg-warning/10 text-warning"
                      : "bg-surface-alt text-muted-foreground"
                  )}
                >
                  <FileText className="size-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Pending Invoices</span>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">
                {portfolioSummary.total_pending_invoices}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(portfolioSummary.total_pending_invoices_value)} outstanding
              </p>
            </div>

            {/* Card 4 — Overdue Bills */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    "rounded-lg p-2.5",
                    portfolioSummary.total_overdue_bills > 0
                      ? "bg-destructive/10 text-destructive"
                      : "bg-surface-alt text-muted-foreground"
                  )}
                >
                  <AlertCircle className="size-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Overdue Bills</span>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{portfolioSummary.total_overdue_bills}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(portfolioSummary.total_overdue_bills_value)} overdue
              </p>
            </div>
          </>
        )}
      </div>

      {/* SECTION 3 — Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column (wider, 60%): Attention Required */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Attention Required</h2>

          {/* Pending Invoices subsection */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-surface-alt/50">
              <h3 className="text-sm font-medium text-foreground">
                Pending Invoices ({portfolioSummary.total_pending_invoices})
              </h3>
            </div>
            {isLoading ? (
              <div className="p-4">
                <SkeletonTable rows={3} columns={3} />
              </div>
            ) : urgentInvoices.length > 0 ? (
              <div className="divide-y divide-border">
                {urgentInvoices.map((invoice) => {
                  const tenancy = getTenancyById(invoice.tenancy_id)
                  const tenant = tenancy ? getTenantById(tenancy.tenant_id) : null
                  return (
                    <button
                      key={invoice.id}
                      onClick={() => handleInvoiceClick(invoice.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-accent">
                          {invoice.invoice_number}
                        </div>
                        <div className="text-sm text-foreground">
                          {tenant ? `${tenant.first_name} ${tenant.last_name}` : "Unknown"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(invoice.remaining_balance)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due {formatDate(invoice.due_date)}
                        </div>
                        <StatusBadge status={invoice.status} />
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle2 className="size-10 text-slate-400" />}
                title="No pending invoices"
                description="All invoices are up to date."
              />
            )}
          </div>

          {/* Overdue Bills subsection */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-surface-alt/50">
              <h3 className="text-sm font-medium text-foreground">
                Overdue Bills ({portfolioSummary.total_overdue_bills})
              </h3>
            </div>
            {isLoading ? (
              <div className="p-4">
                <SkeletonTable rows={3} columns={3} />
              </div>
            ) : urgentBills.length > 0 ? (
              <div className="divide-y divide-border">
                {urgentBills.map((bill) => (
                  <button
                    key={bill.id}
                    onClick={() => handleBillClick(bill.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-accent">{bill.bill_number}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {bill.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-destructive">
                        {formatCurrency(bill.remaining_balance)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due {formatDate(bill.due_date)}
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle2 className="size-10 text-slate-400" />}
                title="No overdue bills"
                description="All bills are on track."
              />
            )}
          </div>
        </div>

        {/* Right column (narrower, 40%): Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-4">
                <SkeletonTable rows={5} columns={2} />
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="divide-y divide-border">
                {recentTransactions.map((txn) => {
                  const tenant = txn.tenant_id ? getTenantById(txn.tenant_id) : null
                  return (
                    <button
                      key={txn.id}
                      onClick={() => handlePaymentClick(txn.id)}
                      className="w-full px-4 py-3 hover:bg-surface/50 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium text-accent">
                            {txn.transaction_number}
                          </div>
                          <div className="text-sm text-foreground">
                            {tenant ? `${tenant.first_name} ${tenant.last_name}` : "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(txn.transaction_date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            {formatCurrency(txn.amount)}
                          </div>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mt-1",
                              txn.type === "PAYMENT" && "bg-success/10 text-success",
                              txn.type === "REFUND" && "bg-info/10 text-info",
                              txn.type === "ADJUSTMENT" && "bg-warning/10 text-warning"
                            )}
                          >
                            {txn.type}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={<Activity className="size-10 text-slate-400" />}
                title="No recent activity"
                description="Transactions will appear here as payments are recorded."
              />
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <InvoiceDialog
        invoiceId={selectedInvoiceId ?? ""}
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
      />
      <BillDialog
        billId={selectedBillId ?? ""}
        open={billDialogOpen}
        onOpenChange={setBillDialogOpen}
      />
      <PaymentDialog
        paymentId={selectedPaymentId ?? ""}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
      />
    </>
  )
}
