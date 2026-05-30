"use client"
import { useState } from "react"
import { useDisplayPreferences } from "@/lib/store"
import Link from "next/link"
import { Plus, Truck, Building2, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { DataTable, DataTableColumn } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { mockSuppliers } from "@/lib/mock-data"

import { usePagination } from "@/hooks/use-pagination"
import { Supplier } from "@/types"

const CATEGORY_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Plumber", value: "PLUMBER" },
  { label: "Council", value: "COUNCIL" },
  { label: "Cleaner", value: "CLEANER" },
  { label: "Gardening", value: "GARDENING" },
  { label: "Roofer", value: "ROOFER" },
  { label: "Builder", value: "BUILDER" },
  { label: "Electrician", value: "ELECTRICIAN" },
]

const getCategoryIcon = (category: string) => {
  if (category === "COUNCIL") {
    return <Building2 className="size-3.5 text-muted-foreground" />
  }
  return <Truck className="size-3.5 text-muted-foreground" />
}

const columns: DataTableColumn<Supplier>[] = [
  {
    key: "name",
    header: "Name",
    render: (supplier) => (
      <Link
        href={`/suppliers/${supplier.id}`}
        className="font-medium text-accent hover:underline"
      >
        {supplier.name}
      </Link>
    ),
  },
  {
    key: "category",
    header: "Category",
    render: (supplier) => (
      <span className="inline-flex items-center gap-1 text-sm">
        {getCategoryIcon(supplier.category)}
        <span className="capitalize">{supplier.category.toLowerCase()}</span>
      </span>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (supplier) => (
      <span className="text-sm text-muted-foreground">{supplier.email ?? "—"}</span>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    render: (supplier) => (
      <span className="text-sm text-muted-foreground">{supplier.phone ?? "—"}</span>
    ),
  },
]

export default function SuppliersPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")

  const filtered = mockSuppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.email ?? "").toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "ALL" || s.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const { items_per_page } = useDisplayPreferences()

  const { paginatedData, currentPage, totalPages, totalItems, goToPage } = usePagination({
    data: filtered,
    pageSize: items_per_page,
  })

  // Determine if we're in a filtered state
  const isFiltered = search !== "" || categoryFilter !== "ALL"

  return (
    <>
      <PageHeader
        title="Suppliers"
        description="Manage suppliers and service providers."
        actions={
          <Link href="/suppliers/new">
            <Button>
              <Plus className="size-4 mr-2" />
              Add Supplier
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <SearchBar placeholder="Search suppliers..." value={search} onChange={setSearch} />
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
        emptyState={
          <EmptyState
            icon={isFiltered ? <SearchX className="size-10 text-slate-400" /> : <Truck className="size-10 text-slate-400" />}
            title={isFiltered ? "No suppliers match your search" : "No suppliers yet"}
            description={isFiltered ? "Try adjusting your search or filters." : "Add suppliers to reference on invoices."}
            actionLabel={isFiltered ? undefined : "Add Supplier"}
            actionHref={isFiltered ? undefined : "/suppliers/new"}
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
