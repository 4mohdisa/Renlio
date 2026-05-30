"use client"
import { useState } from "react"
import { useDisplayPreferences } from "@/lib/store"
import { Plus, CreditCard, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchBar } from "@/components/shared/SearchBar"
import { Pagination } from "@/components/shared/Pagination"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { RecordPaymentDialog } from "@/components/shared/RecordPaymentDialog"
import { PaymentDialog } from "@/components/shared/PaymentDialog"
import { DataTable, DataTableColumn } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { mockTransactions, getTenantById } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"

import { usePagination } from "@/hooks/use-pagination"
import { Transaction } from "@/types"

interface TxnExtra {
  onTxnClick: (txn: Transaction) => void
}

const columns: DataTableColumn<Transaction, TxnExtra>[] = [
  {
    key: "transaction_number",
    header: "Transaction #",
    render: (txn, _index, extra) => (
      <span 
        className="text-blue-600 font-medium cursor-pointer hover:underline"
        onClick={(e) => {
          e.stopPropagation()
          extra?.onTxnClick(txn)
        }}
      >
        {txn.transaction_number}
      </span>
    ),
  },
  {
    key: "tenant",
    header: "Tenant",
    render: (txn) => {
      const tenant = txn.tenant_id ? getTenantById(txn.tenant_id) : undefined
      return tenant ? `${tenant.first_name} ${tenant.last_name}` : "—"
    },
  },
  {
    key: "date",
    header: "Date",
    render: (txn) => formatDate(txn.transaction_date),
  },
  {
    key: "method",
    header: "Method",
    render: (txn) => (
      <span className="capitalize">{txn.method.toLowerCase().replace(/_/g, " ")}</span>
    ),
  },
  {
    key: "reference",
    header: "Reference",
    render: (txn) => (
      <span className="text-muted-foreground">{txn.bank_reference ?? "—"}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (txn) => <StatusBadge status={txn.status} />,
  },
  {
    key: "amount",
    header: "Amount",
    width: "120px",
    render: (txn) => (
      <span className="font-medium text-right block">{formatCurrency(txn.amount)}</span>
    ),
  },
]

export default function PaymentsPage() {
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { items_per_page } = useDisplayPreferences()

  const filtered = mockTransactions.filter((txn) => {
    const tenant = txn.tenant_id ? getTenantById(txn.tenant_id) : undefined
    const tenantName = tenant ? `${tenant.first_name} ${tenant.last_name}` : ""
    const matchesSearch =
      txn.transaction_number.toLowerCase().includes(search.toLowerCase()) ||
      tenantName.toLowerCase().includes(search.toLowerCase()) ||
      (txn.bank_reference ?? "").toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
  } = usePagination({ data: filtered, pageSize: items_per_page })

  const handleRowClick = (txn: Transaction) => {
    setSelectedPaymentId(txn.id)
    setDialogOpen(true)
  }

  // Determine if we're in a filtered state
  const isFiltered = search !== ""

  return (
    <>
      <PageHeader
        title="Payments"
        description="Track all tenant payments."
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" />
            Record Payment
          </Button>
        }
      />

      {/* Simple search only - no tabs or filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <SearchBar placeholder="Search payments..." value={search} onChange={setSearch} />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        onRowClick={handleRowClick}
        extra={{ onTxnClick: handleRowClick }}
        emptyState={
          <EmptyState
            icon={isFiltered ? <SearchX className="size-10 text-slate-400" /> : <CreditCard className="size-10 text-slate-400" />}
            title={isFiltered ? "No transactions match your search" : "No transactions yet"}
            description={isFiltered ? "Try adjusting your search terms." : "Transactions will appear here as payments are recorded."}
          />
        }
      />

      {paginatedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={items_per_page}
          onPageChange={goToPage}
        />
      )}
      <RecordPaymentDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <PaymentDialog 
        paymentId={selectedPaymentId ?? ''} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </>
  )
}
