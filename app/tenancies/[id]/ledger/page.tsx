'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { mockTenancies, mockTenants, mockFolios, mockTransactions, mockInvoices } from '@/lib/mock-data'
import { EmptyState } from '@/components/shared/EmptyState'
import { PaymentDialog } from '@/components/shared/PaymentDialog'
import { InvoiceDialog } from '@/components/shared/InvoiceDialog'
import { computeTenancyFinancials, formatArrears } from '@/lib/calculations'
import { formatCurrency, formatDate } from '@/lib/utils'

const TABS = ['All Transactions', 'Pending Invoices', 'Paid Invoices'] as const
type Tab = typeof TABS[number]

const ALLOCATION_COLORS: Record<string, string> = {
  RENT: 'bg-blue-100 text-blue-700',
  INVOICE: 'bg-purple-100 text-purple-700',
  BOND: 'bg-amber-100 text-amber-700',
}

export default function TenantFolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<Tab>('All Transactions')
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)

  const tenancy = mockTenancies.find((t) => t.id === id)
  if (!tenancy) return <EmptyState title="Tenancy not found" actionLabel="Back to Tenancies" actionHref="/tenancies" />

  const tenant = mockTenants.find((t) => t.id === tenancy.tenant_id)
  const folio = mockFolios.find((f) => f.folio_type === 'TENANT' && f.reference_id === id)

  // Compute financials using calculations engine
  const fin = computeTenancyFinancials(tenancy, mockTransactions, mockInvoices)
  const arrearsInfo = formatArrears(fin.rent_arrears)

  // Get transactions and invoices for this tenancy
  const tenancyTransactions = mockTransactions
    .filter((t) => t.tenancy_id === id)
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
  
  const tenancyInvoices = mockInvoices.filter((inv) => inv.tenancy_id === id)
  const pendingInvoices = tenancyInvoices
    .filter((inv) => inv.status === 'ISSUED' || inv.status === 'PARTIALLY_PAID')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
  const paidInvoices = tenancyInvoices
    .filter((inv) => inv.status === 'PAID')
    .sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/tenancies/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← {tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Tenancy'}
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold text-slate-900">Tenant Folio</h1>
          {folio && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
              {folio.folio_number}
            </span>
          )}
        </div>
        {tenant && (
          <p className="text-sm text-slate-500 mt-1">
            {tenant.first_name} {tenant.last_name}
          </p>
        )}
      </div>

      {/* Four KPI cards with computed financials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400">Paid To Date</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatDate(fin.paid_to_date.toISOString())}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400">Rent Arrears</p>
          <p className={`text-xl font-bold mt-1 ${arrearsInfo.color}`}>
            {arrearsInfo.display}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400">Daily Rate</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(fin.daily_rate)}<span className="text-sm font-normal text-slate-400">/day</span></p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400">Invoice Arrears</p>
          <p className={`text-xl font-bold mt-1 ${fin.invoice_arrears > 0 ? 'text-amber-600' : 'text-green-600'}`}>
            {fin.invoice_arrears > 0 ? formatCurrency(fin.invoice_arrears) : '—'}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-hidden">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === tab ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {tab === 'Pending Invoices' && pendingInvoices.length > 0 && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-1.5 py-0.5 text-xs">{pendingInvoices.length}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'All Transactions' && (
          tenancyTransactions.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No transactions recorded</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Allocation</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tenancyTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setSelectedPaymentId(txn.id); setPaymentDialogOpen(true) }}
                    >
                      <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline">{txn.transaction_number}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(txn.transaction_date)}</td>
                      <td className="px-4 py-3 text-slate-900">{txn.notes ?? '—'}</td>
                      <td className="px-4 py-3">
                        {txn.allocation_target && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ALLOCATION_COLORS[txn.allocation_target] ?? 'bg-slate-100 text-slate-600'}`}>
                            {txn.allocation_target}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(txn.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {(activeTab === 'Pending Invoices' || activeTab === 'Paid Invoices') && (() => {
          const invoices = activeTab === 'Pending Invoices' ? pendingInvoices : paidInvoices
          return invoices.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No {activeTab.toLowerCase()}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Invoice #</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Due Date</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Amount</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Paid</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setSelectedInvoiceId(inv.id); setInvoiceDialogOpen(true) }}
                    >
                      <td className="px-4 py-3 text-blue-600 font-medium">{inv.invoice_number}</td>
                      <td className="px-4 py-3 text-slate-900">{inv.description ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(inv.due_date)}</td>
                      <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(inv.total_amount)}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatCurrency(inv.amount_paid)}</td>
                      <td className="px-4 py-3 text-right text-amber-600">{formatCurrency(inv.remaining_balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })()}
      </div>

      <PaymentDialog
        paymentId={selectedPaymentId ?? ''}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
      />
      <InvoiceDialog
        invoiceId={selectedInvoiceId ?? ''}
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
      />
    </div>
  )
}
