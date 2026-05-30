"use client"
import { useState } from "react"
import { useDisplayPreferences } from "@/lib/store"
import { Plus, FileText, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchBar } from "@/components/shared/SearchBar"
import { Pagination } from "@/components/shared/Pagination"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { AddBillDialog } from "@/components/shared/AddBillDialog"
import { BillDialog } from "@/components/shared/BillDialog"
import { DataTable, DataTableColumn } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { mockBills, getPropertyById } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"

import { usePagination } from "@/hooks/use-pagination"
import { Bill } from "@/types"

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "ALL" },
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Cleaning", value: "CLEANING" },
  { label: "Gardening", value: "GARDENING" },
  { label: "Utilities", value: "UTILITIES" },
  { label: "Tax", value: "TAX" },
]

interface BillsExtra {
  onBillClick: (bill: Bill) => void
}

const columns: DataTableColumn<Bill, BillsExtra>[] = [
  {
    key: "bill_number",
    header: "Bill #",
    render: (bill, _index, extra) => (
      <span 
        className="text-blue-600 font-medium cursor-pointer hover:underline"
        onClick={(e) => {
          e.stopPropagation()
          extra?.onBillClick(bill)
        }}
      >
        {bill.bill_number}
      </span>
    ),
  },
  {
    key: "supplier",
    header: "Supplier",
    render: (bill) => bill.supplier_name ?? "—",
  },
  {
    key: "property",
    header: "Property",
    render: (bill) => {
      const property = getPropertyById(bill.property_id)
      return (
        <span className="text-muted-foreground">{property?.name ?? "—"}</span>
      )
    },
  },
  {
    key: "category",
    header: "Category",
    render: (bill) => (
      <span className="capitalize">{bill.category.toLowerCase().replace(/_/g, " ")}</span>
    ),
  },
  {
    key: "due_date",
    header: "Due Date",
    render: (bill) => formatDate(bill.due_date),
  },
  {
    key: "status",
    header: "Status",
    render: (bill) => <StatusBadge status={bill.status} />,
  },
  {
    key: "total",
    header: "Total",
    width: "120px",
    render: (bill) => (
      <span className="text-right block">{formatCurrency(bill.total_amount)}</span>
    ),
  },
  {
    key: "balance",
    header: "Balance",
    width: "120px",
    render: (bill) => (
      <span className={`text-right block ${bill.remaining_balance > 0 ? "text-destructive font-medium" : "text-success"}`}>
        {formatCurrency(bill.remaining_balance)}
      </span>
    ),
  },
]

export default function BillsPage() {
  const [search, setSearch] = useState("")
  const [statusTab, setStatusTab] = useState("ALL")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { items_per_page } = useDisplayPreferences()

  const filtered = mockBills.filter((bill) => {
    const property = getPropertyById(bill.property_id)
    const matchesSearch =
      bill.bill_number.toLowerCase().includes(search.toLowerCase()) ||
      (bill.supplier_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (bill.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (property?.name ?? "").toLowerCase().includes(search.toLowerCase())
    
    // Status tab filter
    let matchesStatus = true
    if (statusTab === "PENDING") {
      matchesStatus = bill.status === "PENDING" || bill.status === "APPROVED"
    } else if (statusTab === "PAID") {
      matchesStatus = bill.status === "PAID"
    } else if (statusTab === "OVERDUE") {
      matchesStatus = bill.status === "OVERDUE"
    }
    
    const matchesCategory = categoryFilter === "ALL" || bill.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
  } = usePagination({ data: filtered, pageSize: items_per_page })

  const handleRowClick = (bill: Bill) => {
    setSelectedBillId(bill.id)
    setDialogOpen(true)
  }

  // Determine if we're in a filtered state
  const isFiltered = search !== "" || categoryFilter !== "ALL" || statusTab !== "ALL"

  return (
    <>
      <PageHeader
        title="Bills"
        description="Manage property-level expenses and accounts payable."
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" />
            Add Bill
          </Button>
        }
      />

      {/* Status Tabs */}
      <Tabs value={statusTab} onValueChange={setStatusTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="PAID">Paid</TabsTrigger>
          <TabsTrigger value="OVERDUE">Overdue</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <SearchBar placeholder="Search bills..." value={search} onChange={setSearch} />
        <div className="flex items-center gap-2">
          {/* Category Dropdown - shadcn Select */}
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value ?? "ALL")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        onRowClick={handleRowClick}
        extra={{ onBillClick: handleRowClick }}
        emptyState={
          <EmptyState
            icon={isFiltered ? <SearchX className="size-10 text-slate-400" /> : <FileText className="size-10 text-slate-400" />}
            title={isFiltered ? "No bills match your filters" : "No bills yet"}
            description={isFiltered ? "Try adjusting your search or filters." : "Add bills to track property expenses."}
            actionLabel={isFiltered ? undefined : "Add Bill"}
            onAction={isFiltered ? undefined : () => setIsCreateOpen(true)}
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
      <AddBillDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <BillDialog 
        billId={selectedBillId ?? ''} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </>
  )
}
