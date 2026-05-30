"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, MoreHorizontal, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import { Pagination } from "@/components/shared/Pagination"
import { EmptyState } from "@/components/shared/EmptyState"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { mockProperties, mockTenancies, mockTransactions, mockInvoices, mockBills, mockRooms } from "@/lib/mock-data"
import { computePropertyFinancials, formatArrears } from "@/lib/calculations"
import { formatCurrency } from "@/lib/utils"
import { usePagination } from "@/hooks/use-pagination"
import { useDisplayPreferences } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { Property } from "@/types"

export default function PropertiesPage() {
  const { items_per_page, show_arrears_warning } = useDisplayPreferences()
  const [search, setSearch] = useState("")
  const [modeFilter, setModeFilter] = useState<"ALL" | "ROOMING" | "WHOLE_PROPERTY">("ALL")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)

  const filtered = mockProperties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.address_line_1.toLowerCase().includes(search.toLowerCase())
    const matchesMode = modeFilter === "ALL" || p.management_mode === modeFilter
    return matchesSearch && matchesMode
  })

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
  } = usePagination({ data: filtered, pageSize: items_per_page })

  const confirmDelete = () => {
    if (propertyToDelete) {
      toast.success("Property deleted")
      setDeleteDialogOpen(false)
      setPropertyToDelete(null)
    }
  }

  const isFiltered = search !== "" || modeFilter !== "ALL"

  // Row class name function for arrears warning
  const getRowClassName = (property: Property): string => {
    if (!show_arrears_warning) return ""
    const fin = computePropertyFinancials(
      property.id,
      mockTenancies,
      mockTransactions,
      mockInvoices,
      mockBills,
      mockRooms
    )
    return fin.total_rent_arrears > 0 || fin.total_invoice_arrears > 0 ? "bg-red-50/50" : ""
  }

  const columns = [
    {
      key: 'property',
      header: 'Property',
      render: (property: Property) => (
        <Link
          href={`/properties/${property.id}`}
          className="text-sm text-slate-900 hover:text-blue-600"
        >
          {property.address_line_1}, {property.city}
        </Link>
      ),
    },
    {
      key: 'mode',
      header: 'Mode',
      render: (property: Property) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            property.management_mode === 'ROOMING'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {property.management_mode === 'ROOMING' ? 'Rooming' : 'Whole Property'}
        </span>
      ),
    },
    {
      key: 'rent',
      header: 'Rent',
      render: (property: Property) => {
        const fin = computePropertyFinancials(
          property.id,
          mockTenancies,
          mockTransactions,
          mockInvoices,
          mockBills,
          mockRooms
        )
        return fin.total_monthly_rent > 0
          ? <span className="text-sm text-slate-900">{formatCurrency(fin.total_monthly_rent)}/mo</span>
          : <span className="text-slate-400">—</span>
      },
    },
    {
      key: 'rent_arrears',
      header: 'Rent Arrears',
      render: (property: Property) => {
        const fin = computePropertyFinancials(
          property.id,
          mockTenancies,
          mockTransactions,
          mockInvoices,
          mockBills,
          mockRooms
        )
        const arrearsInfo = formatArrears(fin.total_rent_arrears)
        return (
          <span className={`text-sm font-medium ${arrearsInfo.color}`}>
            {arrearsInfo.display}
          </span>
        )
      },
    },
    {
      key: 'invoice_arrears',
      header: 'Invoice Arrears',
      render: (property: Property) => {
        const fin = computePropertyFinancials(
          property.id,
          mockTenancies,
          mockTransactions,
          mockInvoices,
          mockBills,
          mockRooms
        )
        if (fin.total_invoice_arrears === 0) {
          return <span className="text-slate-400">—</span>
        }
        return (
          <span className="text-sm font-medium text-red-600">
            {formatCurrency(fin.total_invoice_arrears)}
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      render: (property: Property) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 focus:outline-none">
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.location.href = `/properties/${property.id}/edit`}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => {
                  setPropertyToDelete(property)
                  setDeleteDialogOpen(true)
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Properties"
        description="Manage your property portfolio."
        actions={
          <Link href="/properties/new">
            <Button>
              <Plus className="size-4" />
              Add Property
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <SearchBar placeholder="Search properties..." value={search} onChange={setSearch} />
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            {(["ALL", "ROOMING", "WHOLE_PROPERTY"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  modeFilter === mode
                    ? "bg-accent text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "ALL" ? "All" : mode === "ROOMING" ? "Rooming" : "Whole Property"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {paginatedData.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={paginatedData}
            rowClassName={getRowClassName}
            emptyState={<EmptyState title="No properties found" />}
          />
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={items_per_page}
              onPageChange={goToPage}
            />
          </div>
        </>
      ) : isFiltered ? (
        <EmptyState
          icon={<SearchX className="size-10 text-slate-400" />}
          title="No properties match your search"
          description="Try adjusting your search terms or filters."
        />
      ) : (
        <EmptyState
          title="No properties yet"
          description="Add your first property to get started."
          actionLabel="Add Property"
          actionHref="/properties/new"
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Property"
        description={
          propertyToDelete
            ? `Are you sure you want to delete "${propertyToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this property? This action cannot be undone."
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </>
  )
}
