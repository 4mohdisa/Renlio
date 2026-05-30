'use client'

import { useState, useMemo } from 'react'
import { useDisplayPreferences } from "@/lib/store"
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { usePagination } from '@/hooks/use-pagination'
import { mockContactGroups, mockContacts, mockTenancies, mockTenants } from '@/lib/mock-data'
import type { ContactGroup } from '@/types'

function getPrimaryName(groupId: string): string {
  const primary = mockContacts.find(
    (c) => c.contact_group_id === groupId && c.is_primary
  )
  if (!primary) return 'Unknown'
  return `${primary.first_name} ${primary.last_name}`
}

function getPrimaryContact(groupId: string) {
  return mockContacts.find(
    (c) => c.contact_group_id === groupId && c.is_primary
  )
}

function getPeopleCount(groupId: string): number {
  return mockContacts.filter((c) => c.contact_group_id === groupId).length
}

/**
 * Count active tenancies for a tenant contact
 * Matches by name since contact_group_id links to tenant through folio
 */
function getTenantActiveTenancyCount(groupId: string): number {
  const primary = getPrimaryContact(groupId)
  if (!primary || primary.type !== 'TENANT') return 0
  
  // Find all tenants with matching first/last name
  const matchingTenants = mockTenants.filter(
    (t) => t.first_name === primary.first_name && t.last_name === primary.last_name
  )
  
  // Count active tenancies for those tenants
  return mockTenancies.filter(
    (tenancy) => 
      tenancy.status === 'ACTIVE' &&
      matchingTenants.some((t) => t.id === tenancy.tenant_id)
  ).length
}

const TYPE_COLORS: Record<string, string> = {
  TENANT: 'bg-blue-100 text-blue-700',
  SUPPLIER: 'bg-purple-100 text-purple-700',
  OWNER: 'bg-amber-100 text-amber-700',
  OTHER: 'bg-slate-100 text-slate-600',
}

const TYPE_LABELS: Record<string, string> = {
  TENANT: 'Tenant',
  SUPPLIER: 'Supplier',
  OWNER: 'Owner',
  OTHER: 'Other',
}

export default function ContactsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  const filtered = useMemo(() => {
    return mockContactGroups.filter((group) => {
      const primary = getPrimaryContact(group.id)
      if (!primary) return false
      const fullName = `${primary.first_name} ${primary.last_name}`.toLowerCase()
      const email = (primary.email ?? '').toLowerCase()
      const matchesSearch =
        search === '' ||
        fullName.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase())
      const matchesType =
        typeFilter === 'ALL' || primary.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [search, typeFilter])

  const { items_per_page } = useDisplayPreferences()

  const { paginatedData, currentPage, totalPages, totalItems, goToNextPage, goToPreviousPage } =
    usePagination({ data: filtered, pageSize: items_per_page })

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (group: ContactGroup) => (
        <Link
          href={`/contacts/${group.id}`}
          className="font-medium text-slate-900 hover:text-blue-600"
        >
          {getPrimaryName(group.id)}
        </Link>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (group: ContactGroup) => {
        const primary = getPrimaryContact(group.id)
        const type = primary?.type ?? 'OTHER'
        const tenancyCount = type === 'TENANT' ? getTenantActiveTenancyCount(group.id) : 0
        
        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                TYPE_COLORS[type] ?? TYPE_COLORS.OTHER
              }`}
            >
              {TYPE_LABELS[type] ?? 'Other'}
            </span>
            {tenancyCount > 0 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600">
                {tenancyCount} {tenancyCount === 1 ? 'tenancy' : 'tenancies'}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'email',
      header: 'Email',
      render: (group: ContactGroup) => {
        const primary = getPrimaryContact(group.id)
        return (
          <span className="text-slate-600 text-sm">
            {primary?.email ?? '—'}
          </span>
        )
      },
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (group: ContactGroup) => {
        const primary = getPrimaryContact(group.id)
        return (
          <span className="text-slate-600 text-sm">
            {primary?.mobile_phone ?? '—'}
          </span>
        )
      },
    },
    {
      key: 'people',
      header: 'People',
      render: (group: ContactGroup) => {
        const count = getPeopleCount(group.id)
        return (
          <span className="text-slate-500 text-sm">
            {count === 1 ? '1 person' : `${count} people`}
          </span>
        )
      },
    },
  ]

  const emptyState =
    search !== '' || typeFilter !== 'ALL' ? (
      <EmptyState
        title="No contacts match your search"
        description="Try adjusting your search or filter"
      />
    ) : (
      <EmptyState
        title="No contacts yet"
        description="Add your first contact to get started"
        actionLabel="Add Contact"
        actionHref="/contacts/new"
      />
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        actions={
          <Link href="/contacts/new">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? 'ALL')}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="TENANT">Tenant</SelectItem>
            <SelectItem value="SUPPLIER">Supplier</SelectItem>
            <SelectItem value="OWNER">Owner</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        emptyState={emptyState}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing {(currentPage - 1) * items_per_page + 1}–{Math.min(currentPage * items_per_page, totalItems)} of {totalItems}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
