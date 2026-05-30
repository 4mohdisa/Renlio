'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { mockSuppliers, mockFolios, mockContacts, mockBills, mockInvoices } from '@/lib/mock-data'
import { EmptyState } from '@/components/shared/EmptyState'
import { BillDialog } from '@/components/shared/BillDialog'
import { InvoiceDialog } from '@/components/shared/InvoiceDialog'
import { computeSupplierFolioMetrics } from '@/lib/calculations'
import { formatCurrency, formatDate } from '@/lib/utils'

const TABS = ['All Transactions', 'Pending Bills', 'Paid Bills', 'Pending Invoices', 'Paid Invoices'] as const
type Tab = typeof TABS[number]

export default function SupplierFolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<Tab>('All Transactions')
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null)
  const [billDialogOpen, setBillDialogOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)

  const supplier = mockSuppliers.find((s) => s.id === id)
  const folio = mockFolios.find((f) => f.folio_type === 'SUPPLIER' && f.reference_id === id)
  const primaryContact = folio ? mockContacts.find((c) => c.contact_group_id === folio.contact_group_id && c.is_primary) : null

  if (!supplier || !folio) {
    return <EmptyState title="Supplier folio not found" actionLabel="Back to Suppliers" actionHref="/suppliers" />
  }

  const supplierBills = mockBills.filter((b) => b.supplier_name === supplier.name)
  const supplierInvoices = mockInvoices.filter((inv) => inv.supplier_id === id)

  const pendingBills = supplierBills.filter((b) => b.status === 'PENDING' || b.status === 'OVERDUE')
  const paidBills = supplierBills.filter((b) => b.status === 'PAID')
  const pendingInvoices = supplierInvoices.filter((inv) => inv.status === 'ISSUED' || inv.status === 'PARTIALLY_PAID')
  const paidInvoices = supplierInvoices.filter((inv) => inv.status === 'PAID')

  // Compute supplier folio metrics using calculations engine
  const supplierMetrics = computeSupplierFolioMetrics(id, supplier.name, mockBills, mockInvoices)
  
  // Calculate additional metrics
  const totalBillsValue = supplierBills.reduce((sum, b) => sum + b.total_amount, 0)
  const pendingInvoicesValue = pendingInvoices.reduce((sum, inv) => sum + inv.remaining_balance, 0)

  function getTabData() {
    switch (activeTab) {
      case 'Pending Bills': return { type: 'bills' as const, data: pendingBills }
      case 'Paid Bills': return { type: 'bills' as const, data: paidBills }
      case 'Pending Invoices': return { type: 'invoices' as const, data: pendingInvoices }
      case 'Paid Invoices': return { type: 'invoices' as const, data: paidInvoices }
      default: return { type: 'all' as const, data: [...supplierBills, ...supplierInvoices] }
    }
  }

  const tabData = getTabData()

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/suppliers/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← {supplier.name}
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Supplier Folio
          </h1>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">
            {folio.folio_number}
          </span>
        </div>
        {primaryContact && (
          <p className="text-sm text-slate-500 mt-1">
            {primaryContact.first_name} {primaryContact.last_name}
            {primaryContact.company_name ? ` — ${primaryContact.company_name}` : ''}
          </p>
        )}
      </div>

      {/* 2x2 Grid of KPI Cards with computed metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-400">Payments Pending</p>
          <p className={`text-2xl font-bold mt-1 ${supplierMetrics.payments_pending > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
            {formatCurrency(supplierMetrics.payments_pending)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{supplierMetrics.pending_bills_count} bill{supplierMetrics.pending_bills_count !== 1 ? 's' : ''} outstanding</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-400">Income Received</p>
          <p className={`text-2xl font-bold mt-1 ${supplierMetrics.income_received > 0 ? 'text-green-600' : 'text-slate-400'}`}>
            {formatCurrency(supplierMetrics.income_received)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{supplierMetrics.paid_invoices_count} invoice{supplierMetrics.paid_invoices_count !== 1 ? 's' : ''} paid</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-400">Total Bills</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">
            {formatCurrency(totalBillsValue)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{supplierBills.length} bill{supplierBills.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-400">Pending Invoices</p>
          <p className={`text-2xl font-bold mt-1 ${pendingInvoicesValue > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
            {formatCurrency(pendingInvoicesValue)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{pendingInvoices.length} invoice{pendingInvoices.length !== 1 ? 's' : ''} pending</p>
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
                activeTab === tab
                  ? 'border-blue-600 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {tab === 'Pending Bills' && pendingBills.length > 0 && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-1.5 py-0.5 text-xs">
                  {pendingBills.length}
                </span>
              )}
              {tab === 'Pending Invoices' && pendingInvoices.length > 0 && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.5 text-xs">
                  {pendingInvoices.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {tabData.type === 'bills' && (
          tabData.data.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No bills in this category</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Bill #</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Due Date</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Amount</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Paid</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {(tabData.data as typeof supplierBills).map((bill) => (
                    <tr key={bill.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td 
                        className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => { setSelectedBillId(bill.id); setBillDialogOpen(true) }}
                      >{bill.bill_number}</td>
                      <td className="px-4 py-3 text-slate-900">{bill.description ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(bill.due_date)}</td>
                      <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(bill.total_amount)}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatCurrency(bill.amount_paid)}</td>
                      <td className="px-4 py-3 text-right text-amber-600">{formatCurrency(bill.remaining_balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {tabData.type === 'invoices' && (
          tabData.data.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No invoices in this category</div>
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
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(tabData.data as typeof supplierInvoices).map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td 
                        className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => { setSelectedInvoiceId(inv.id); setInvoiceDialogOpen(true) }}
                      >{inv.invoice_number}</td>
                      <td className="px-4 py-3 text-slate-900">{inv.description ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(inv.due_date)}</td>
                      <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(inv.total_amount)}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatCurrency(inv.amount_paid)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {tabData.type === 'all' && (
          supplierBills.length === 0 && supplierInvoices.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No transactions recorded</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Ref</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Type</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierBills.map((bill) => (
                    <tr key={`bill-${bill.id}`} className="border-b border-slate-100 hover:bg-slate-50">
                      <td 
                        className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => { setSelectedBillId(bill.id); setBillDialogOpen(true) }}
                      >{bill.bill_number}</td>
                      <td className="px-4 py-3 text-slate-900">{bill.description ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700">Bill</span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(bill.total_amount)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">{bill.status}</span>
                      </td>
                    </tr>
                  ))}
                  {supplierInvoices.map((inv) => (
                    <tr key={`inv-${inv.id}`} className="border-b border-slate-100 hover:bg-slate-50">
                      <td 
                        className="px-4 py-3 text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => { setSelectedInvoiceId(inv.id); setInvoiceDialogOpen(true) }}
                      >{inv.invoice_number}</td>
                      <td className="px-4 py-3 text-slate-900">{inv.description ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">Invoice</span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-900">{formatCurrency(inv.total_amount)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">{inv.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
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
