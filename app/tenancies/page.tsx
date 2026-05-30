"use client"
import { useState } from "react"
import { useDisplayPreferences } from "@/lib/store"
import Link from "next/link"
import { Plus, Users, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { SearchBar } from "@/components/shared/SearchBar"
import { Pagination } from "@/components/shared/Pagination"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { DataTable, DataTableColumn } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { mockTenancies, mockTransactions, mockInvoices, getTenantById, getPropertyById, getRoomById } from "@/lib/mock-data"
import { computeTenancyFinancials, formatArrears } from "@/lib/calculations"
import { formatCurrency, formatDate } from "@/lib/utils"

import { usePagination } from "@/hooks/use-pagination"
import { Tenancy } from "@/types"

const columns: DataTableColumn<Tenancy>[] = [
  {
    key: "tenant",
    header: "Tenant",
    render: (tenancy) => {
      const tenant = getTenantById(tenancy.tenant_id)
      return (
        <Link
          href={`/tenancies/${tenancy.id}`}
          className="font-medium text-accent hover:underline"
        >
          {tenant ? `${tenant.first_name} ${tenant.last_name}` : "Unknown"}
        </Link>
      )
    },
  },
  {
    key: "property",
    header: "Property / Room",
    render: (tenancy) => {
      const property = getPropertyById(tenancy.property_id)
      const room = tenancy.room_id ? getRoomById(tenancy.room_id) : null
      return (
        <span className="text-muted-foreground">
          {property?.name ?? "—"}
          {room ? ` — ${room.room_label}` : ""}
        </span>
      )
    },
  },
  {
    key: "rent",
    header: "Rent",
    render: (tenancy) => (
      <span>
        {formatCurrency(tenancy.rent_amount)}/
        {tenancy.rent_frequency.toLowerCase().slice(0, 2)}
      </span>
    ),
  },
  {
    key: "paid_to",
    header: "Paid To",
    render: (tenancy) => {
      const fin = computeTenancyFinancials(tenancy, mockTransactions, mockInvoices)
      return <span>{formatDate(fin.paid_to_date.toISOString())}</span>
    },
  },
  {
    key: "arrears",
    header: "Arrears",
    render: (tenancy) => {
      const fin = computeTenancyFinancials(tenancy, mockTransactions, mockInvoices)
      const arrearsInfo = formatArrears(fin.rent_arrears)
      return (
        <span className={`font-medium ${arrearsInfo.color}`}>
          {arrearsInfo.display}
        </span>
      )
    },
  },
  {
    key: "bond",
    header: "Bond",
    render: (tenancy) => <StatusBadge status={tenancy.bond_status} />,
  },
]

export default function TenanciesPage() {
  const [search, setSearch] = useState("")
  const { items_per_page, show_arrears_warning } = useDisplayPreferences()

  const filtered = mockTenancies.filter((t) => {
    const tenant = getTenantById(t.tenant_id)
    const property = getPropertyById(t.property_id)
    const room = t.room_id ? getRoomById(t.room_id) : null
    const tenantName = tenant ? `${tenant.first_name} ${tenant.last_name}` : ""
    const matchesSearch =
      tenantName.toLowerCase().includes(search.toLowerCase()) ||
      (property?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (room?.room_label ?? "").toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
  } = usePagination({ data: filtered, pageSize: items_per_page })

  // Row class name function for arrears warning
  const getRowClassName = (tenancy: Tenancy): string => {
    if (!show_arrears_warning) return ""
    const fin = computeTenancyFinancials(tenancy, mockTransactions, mockInvoices)
    return fin.rent_arrears > 0 ? "bg-red-50/50" : ""
  }

  // Determine if we're in a filtered state
  const isFiltered = search !== ""

  return (
    <>
      <PageHeader
        title="Tenancies"
        description="Manage all tenancies across your properties."
        actions={
          <Link href="/tenancies/new">
            <Button>
              <Plus className="size-4" />
              New Tenancy
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <SearchBar placeholder="Search tenants or properties..." value={search} onChange={setSearch} />
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        rowClassName={getRowClassName}
        emptyState={
          <EmptyState
            icon={isFiltered ? <SearchX className="size-10 text-slate-400" /> : <Users className="size-10 text-slate-400" />}
            title={isFiltered ? "No tenancies match your search" : "No tenancies yet"}
            description={isFiltered ? "Try adjusting your search terms." : "Tenancies are created when you add a room or create a whole property tenancy."}
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
    </>
  )
}
