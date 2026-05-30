"use client"
import { useState } from "react"
import { useDisplayPreferences } from "@/lib/store"

import { Plus, FileText, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchBar } from "@/components/shared/SearchBar"
import { Pagination } from "@/components/shared/Pagination"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { CreateInvoiceDialog } from "@/components/shared/CreateInvoiceDialog"
import { InvoiceDialog } from "@/components/shared/InvoiceDialog"
import { SortableTableHead, useSorting } from "@/components/shared/SortableTableHead"
import { mockInvoices, getTenancyById, getTenantById } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"

import { usePagination } from "@/hooks/use-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "ALL" },
  { label: "Rent", value: "RENT" },
  { label: "Deposit", value: "DEPOSIT" },
  { label: "Bond", value: "BOND" },
  { label: "Utilities", value: "UTILITIES" },
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Cleaning", value: "CLEANING" },
  { label: "Late Fee", value: "LATE_FEE" },
  { label: "Admin Fee", value: "ADMIN_FEE" },
  { label: "Damages", value: "DAMAGES" },
  { label: "Other", value: "OTHER" },
]

export default function InvoicesPage() {
  const [search, setSearch] = useState("")
  const [statusTab, setStatusTab] = useState("ALL")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { items_per_page } = useDisplayPreferences()

  const filtered = mockInvoices.filter((inv) => {
    const tenancy = getTenancyById(inv.tenancy_id)
    const tenant = tenancy ? getTenantById(tenancy.tenant_id) : undefined
    const tenantName = tenant ? `${tenant.first_name} ${tenant.last_name}` : ""
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      (inv.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
      tenantName.toLowerCase().includes(search.toLowerCase())
    
    // Status tab filter - Removed Draft
    let matchesStatus = true
    if (statusTab === "ISSUED") {
      matchesStatus = inv.status === "ISSUED"
    } else if (statusTab === "PARTIALLY_PAID") {
      matchesStatus = inv.status === "PARTIALLY_PAID"
    } else if (statusTab === "PAID") {
      matchesStatus = inv.status === "PAID"
    } else if (statusTab === "OVERDUE") {
      matchesStatus = inv.status === "OVERDUE"
    }
    
    const matchesCategory = categoryFilter === "ALL" || inv.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const { sortKey, sortDirection, handleSort, sortedData } = useSorting(filtered)

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
  } = usePagination({ data: sortedData, pageSize: items_per_page })

  const handleRowClick = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId)
    setDialogOpen(true)
  }

  // Determine if we're in a filtered state
  const isFiltered = search !== "" || categoryFilter !== "ALL" || statusTab !== "ALL"

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Manage all tenant invoices."
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" />
            Create Invoice
          </Button>
        }
      />

      {/* Status Tabs - Removed Draft */}
      <Tabs value={statusTab} onValueChange={setStatusTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="ISSUED">Issued</TabsTrigger>
          <TabsTrigger value="PARTIALLY_PAID">Partially Paid</TabsTrigger>
          <TabsTrigger value="PAID">Paid</TabsTrigger>
          <TabsTrigger value="OVERDUE">Overdue</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <SearchBar placeholder="Search invoices..." value={search} onChange={setSearch} />
        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        {paginatedData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-alt">
                <SortableTableHead label="Invoice #" sortKey="invoice_number" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} />
                <TableHead>Tenant</TableHead>
                <TableHead>Category</TableHead>
                <SortableTableHead label="Due Date" sortKey="due_date" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} />
                <TableHead>Status</TableHead>
                <SortableTableHead label="Total" sortKey="total_amount" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="text-right" />
                <SortableTableHead label="Balance" sortKey="remaining_balance" currentSortKey={sortKey} currentDirection={sortDirection} onSort={handleSort} className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((inv) => {
                const tenancy = getTenancyById(inv.tenancy_id)
                const tenant = tenancy ? getTenantById(tenancy.tenant_id) : undefined
                return (
                  <TableRow 
                    key={inv.id} 
                    className="cursor-pointer hover:bg-surface/50"
                    onClick={() => handleRowClick(inv.id)}
                  >
                    <TableCell>
                      <span 
                        className="text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(inv.id)
                        }}
                      >
                        {inv.invoice_number}
                      </span>
                    </TableCell>
                    <TableCell>{tenant ? `${tenant.first_name} ${tenant.last_name}` : "—"}</TableCell>
                    <TableCell className="capitalize">{inv.category.toLowerCase().replace(/_/g, " ")}</TableCell>
                    <TableCell>{formatDate(inv.due_date)}</TableCell>
                    <TableCell><StatusBadge status={inv.status} /></TableCell>
                    <TableCell className="text-right">{formatCurrency(inv.total_amount)}</TableCell>
                    <TableCell className="text-right">
                      <span className={inv.remaining_balance > 0 ? "text-destructive font-medium" : "text-success"}>
                        {formatCurrency(inv.remaining_balance)}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            icon={isFiltered ? <SearchX className="size-10 text-slate-400" /> : <FileText className="size-10 text-slate-400" />}
            title={isFiltered ? "No invoices match your filters" : "No invoices yet"}
            description={isFiltered ? "Try adjusting your search or filters." : "Create an invoice to charge a tenant."}
            actionLabel={isFiltered ? undefined : "Create Invoice"}
            onAction={isFiltered ? undefined : () => setIsCreateOpen(true)}
          />
        )}
      </div>

      {paginatedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={items_per_page}
          onPageChange={goToPage}
        />
      )}
      <CreateInvoiceDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <InvoiceDialog 
        invoiceId={selectedInvoiceId ?? ''} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </>
  )
}
