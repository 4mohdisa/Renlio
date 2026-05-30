'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { mockProperties, mockFolios, mockContacts, mockOwnerLedgerRows, mockBills, mockInvoices } from '@/lib/mock-data'
import { EmptyState } from '@/components/shared/EmptyState'
import { BillDialog } from '@/components/shared/BillDialog'
import { InvoiceDialog } from '@/components/shared/InvoiceDialog'
import { computeOwnerFolioMetrics } from '@/lib/calculations'
import { formatCurrency, formatDate } from '@/lib/utils'

const TABS = ['All Transactions', 'Pending Bills', 'Paid Bills', 'Pending Invoices', 'Paid Invoices'] as const
type Tab = typeof TABS[number]

const TYPE_LABELS: Record<string, string> = {
  RENT_RECEIVED: 'Rent Received',
  INVOICE_RECEIVED: 'Invoice Payment',
  BILL_PAID: 'Bill Paid',
}

const TYPE_COLORS: Record<string, string> = {
  RENT_RECEIVED: 'bg-green-100 text-green-700',
  INVOICE_RECEIVED: 'bg-blue-100 text-blue-700',
  BILL_PAID: 'bg-red-100 text-red-700',
}

export default function OwnerLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<Tab>('All Transactions')
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null)
  const [billDialogOpen, setBillDialogOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)

  const property = mockProperties.find((p) => p.id === id)
  if (!property) return <EmptyState title="Property not found" actionLabel="Back to Properties" actionHref="/properties" />

  const ownerFolio = mockFolios.find((f) => f.folio_type === 'OWNER' && f.reference_id === id)
  const ownerPrimary = ownerFolio ? mockContacts.find((c) => c.contact_group_id === ownerFolio.contact_group_id && c.is_primary) : null

  const allRows = mockOwnerLedgerRows
  const propertyBills = mockBills.filter((b) => b.property_id === id)
  const propertyInvoices = mockInvoices.filter(() => {
    return true
  })

  const pendingBills = propertyBills.filter((b) => b.status === 'PENDING' || b.status === 'OVERDUE')
  const paidBills = propertyBills.filter((b) => b.status === 'PAID')
  const pendingInvoices = propertyInvoices.filter((inv) => inv.status === 'ISSUED' || inv.status === 'PARTIALLY_PAID')
  const paidInvoices = propertyInvoices.filter((inv) => inv.status === 'PAID')

  // Compute owner folio metrics using calculations engine
  const ownerMetrics = computeOwnerFolioMetrics(id, mockOwnerLedgerRows, mockBills)

  const metrics = [
    { label: 'Gross Income', value: ownerMetrics.gross_income, color: 'text-green-600' },
    { label: 'Total Expenses', value: ownerMetrics.total_expenses, color: 'text-red-600' },
    { label: 'Net Income', value: ownerMetrics.net_income, color: ownerMetrics.net_income >= 0 ? 'text-green-600' : 'text-red-600' },
    { label: 'Bills Pending', value: ownerMetrics.bills_pending, color: ownerMetrics.bills_pending > 0 ? 'text-amber-600' : 'text-slate-400' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/properties/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← {property.name}
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold text-slate-900">Owner Folio</h1>
          {ownerFolio && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700">
              {ownerFolio.folio_number}
            </span>
          )}
        </div>
        {ownerPrimary && (
          <p className="text-sm text-slate-500 mt-1">
            {ownerPrimary.first_name} {ownerPrimary.last_name} — {property.address_line_1}, {property.city}
          </p>
        )}
      </div>

      {/* KPI Cards with computed metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-400">{m.label}</p>
            <p className={`text-xl font-bold mt-1 ${m.color}`}>{formatCurrency(m.value)}</p>
          </div>
        ))}
      </div>

      {/* Additional Summary Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Total Rent Collected</p>
            <p className="text-base font-semibold text-slate-900">
              {formatCurrency(mockOwnerLedgerRows
                .filter(r => r.type === 'RENT_RECEIVED')
                .reduce((s, r) => s + r.amount_in, 0))}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Bills Paid</p>
            <p className="text-base font-semibold text-slate-900">
              {formatCurrency(mockOwnerLedgerRows
                .filter(r => r.type === 'BILL_PAID')
                .reduce((s, r) => s + r.amount_out, 0))}
            </p>
          </div>
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
              {tab === 'Pending Bills' && pendingBills.length > 0 && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-1.5 py-0.5 text-xs">{pendingBills.length}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'All Transactions' && (
          allRows.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No transactions recorded</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Folio</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Type</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">In</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Out</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {allRows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(row.date)}</td>
                      <td className="px-4 py-3 text-slate-900">{row.description}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">{row.folio_number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[row.type] ?? 'bg-slate-100 text-slate-600'}`}>
                          {TYPE_LABELS[row.type] ?? row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">{row.amount_in > 0 ? formatCurrency(row.amount_in) : '—'}</td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium">{row.amount_out > 0 ? formatCurrency(row.amount_out) : '—'}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(row.running_balance)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-200 bg-slate-50">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-slate-700">Totals</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-green-600">{formatCurrency(ownerMetrics.gross_income)}</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-red-600">{formatCurrency(ownerMetrics.total_expenses)}</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">{formatCurrency(ownerMetrics.net_income)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )
        )}

        {(activeTab === 'Pending Bills' || activeTab === 'Paid Bills') && (() => {
          const bills = activeTab === 'Pending Bills' ? pendingBills : paidBills
          return bills.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No {activeTab.toLowerCase()}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Bill #</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Due Date</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Amount</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td 
                        className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => { setSelectedBillId(bill.id); setBillDialogOpen(true) }}
                      >{bill.bill_number}</td>
                      <td className="px-4 py-3 text-slate-900">{bill.description ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(bill.due_date)}</td>
                      <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(bill.total_amount)}</td>
                      <td className="px-4 py-3 text-right text-amber-600">{formatCurrency(bill.remaining_balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })()}

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
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td 
                        className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => { setSelectedInvoiceId(inv.id); setInvoiceDialogOpen(true) }}
                      >{inv.invoice_number}</td>
                      <td className="px-4 py-3 text-slate-900">{inv.description ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(inv.due_date)}</td>
                      <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(inv.total_amount)}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatCurrency(inv.amount_paid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })()}
      </div>

      <BillDialog
        billId={selectedBillId ?? ''}
        open={billDialogOpen}
        onOpenChange={setBillDialogOpen}
      />
      <InvoiceDialog
        invoiceId={selectedInvoiceId ?? ''}
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
      />
    </div>
  )
}
