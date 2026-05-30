"use client"
import { use, useState } from "react"
import Link from "next/link"
import { BookOpen, CreditCard, FileText, LogOut, Users } from "lucide-react"
import { Button } from "@/components/ui/button"


import { StatCard } from "@/components/shared/StatCard"

import { SectionHeader } from "@/components/shared/SectionHeader"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { RecordPaymentDialog } from "@/components/shared/RecordPaymentDialog"
import { CreateInvoiceDialog } from "@/components/shared/CreateInvoiceDialog"
import { ErrorBoundary } from "@/components/shared"
import {
  getTenancyById,
  getTenantById,
  getPropertyById,
  getRoomById,
  mockContacts,
  mockTenants,
  mockFolios,
  mockTransactions,
  mockInvoices,
} from "@/lib/mock-data"
import { computeTenancyFinancials, formatArrears } from "@/lib/calculations"
import { formatCurrency, formatDate } from "@/lib/utils"




export default function TenancyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const tenancy = getTenancyById(id)
  const tenant = tenancy ? getTenantById(tenancy.tenant_id) : undefined
  const property = tenancy ? getPropertyById(tenancy.property_id) : undefined
  const room = tenancy?.room_id ? getRoomById(tenancy.room_id) : undefined

  const [isEndTenancyOpen, setIsEndTenancyOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  

  const [activePerson, setActivePerson] = useState(0)

  if (!tenancy || !tenant) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-slate-50 rounded-full p-6 mb-4">
          <Users className="size-12 text-slate-300" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Tenancy not found</h2>
        <p className="text-sm text-slate-500 mt-2 text-center max-w-sm">
          The tenancy you are looking for does not exist or may have been ended.
        </p>
        <div className="flex gap-3 mt-6">
          <Link href="/tenancies">
            <Button variant="outline">Back to Tenancies</Button>
          </Link>
          <Link href="/tenancies/new">
            <Button>New Tenancy</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Compute tenancy financials using calculations engine
  const fin = computeTenancyFinancials(tenancy, mockTransactions, mockInvoices)
  const arrearsInfo = formatArrears(fin.rent_arrears)

  const tenantName = `${tenant.first_name} ${tenant.last_name}`

  const tenantPeople = mockContacts.filter(
    (c) =>
      c.type === 'TENANT' &&
      mockTenants.some(
        (t) =>
          t.id === tenancy.tenant_id &&
          t.first_name === c.first_name &&
          t.last_name === c.last_name
      )
  )
  const location = room
    ? `${room.room_label}, ${property?.name}`
    : property?.name ?? "Unknown"

  const tenantFolio = mockFolios.find((f) => f.folio_type === 'TENANT' && f.reference_id === id)

  return (
    <ErrorBoundary>
      <div className="space-y-2 mb-8">
        <div className="text-sm breadcrumbs">
          <Link href="/tenancies" className="text-muted-foreground hover:text-foreground">Tenancies</Link>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="text-foreground">{tenantName}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">{tenantName}</h1>
          {tenantFolio && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
              {tenantFolio.folio_number}
            </span>
          )}
        </div>
        <p className="text-base text-muted-foreground">{location}</p>
      </div>

      {/* Stat cards with computed financials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Paid To Date"
          value={formatDate(fin.paid_to_date.toISOString())}
        />
        <StatCard
          title="Rent Arrears"
          value={arrearsInfo.display}
          iconClassName={arrearsInfo.isInArrears ? "bg-[#FEE2E2] text-destructive" : "bg-success-light text-success"}
        />
        <StatCard
          title="Bond Status"
          value={tenancy.bond_status.replace(/_/g, " ").toLowerCase()}
          description={`${formatCurrency(tenancy.bond_paid)} / ${formatCurrency(tenancy.bond_required ?? 0)}`}
        />
        <StatCard
          title="Daily Rate"
          value={fin.daily_rate ? formatCurrency(fin.daily_rate) : "—"}
          description={`${formatCurrency(tenancy.rent_amount)}/${tenancy.rent_frequency.toLowerCase()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <SectionHeader title="Tenant Information" />
            {tenantPeople.length > 0 ? (
              <div className="space-y-3">
                {tenantPeople.length > 1 && (
                  <div className="flex border-b border-slate-200 mb-4">
                    {tenantPeople.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActivePerson(index)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                          activePerson === index
                            ? 'text-slate-900 border-blue-600'
                            : 'text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                      >
                        Person {index + 1}
                      </button>
                    ))}
                  </div>
                )}
                {(() => {
                  const person = tenantPeople[activePerson]
                  return person ? (
                    <div key={person.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {person.first_name} {person.last_name}
                        </span>
                        {person.is_primary && (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-600 mt-1">
                        {person.email && (
                          <div><span className="text-xs text-slate-400">Email</span><p>{person.email}</p></div>
                        )}
                        {person.mobile_phone && (
                          <div><span className="text-xs text-slate-400">Phone</span><p>{person.mobile_phone}</p></div>
                        )}
                        {person.address && (
                          <div className="sm:col-span-2"><span className="text-xs text-slate-400">Address</span><p>{person.address}</p></div>
                        )}
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div><span className="text-xs text-slate-400">Name</span><p className="font-medium text-slate-900">{tenant?.first_name} {tenant?.last_name}</p></div>
                <div><span className="text-xs text-slate-400">Email</span><p className="text-slate-700">{tenant?.email ?? '—'}</p></div>
                <div><span className="text-xs text-slate-400">Phone</span><p className="text-slate-700">{tenant?.phone ?? '—'}</p></div>
                <div><span className="text-xs text-slate-400">Payment Reference</span><p className="text-slate-700">{tenant?.payment_reference ?? '—'}</p></div>
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <SectionHeader title="Lease Details" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Lease Start</p>
                <p className="font-medium text-foreground">{formatDate(tenancy.lease_start_date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lease End</p>
                <p className="font-medium text-foreground">{tenancy.lease_end_date ? formatDate(tenancy.lease_end_date) : "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Move-in Date</p>
                <p className="font-medium text-foreground">{formatDate(tenancy.move_in_date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rent</p>
                <p className="font-medium text-foreground">{formatCurrency(tenancy.rent_amount)}/{tenancy.rent_frequency.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <SectionHeader title="Quick Actions" />
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => setIsPaymentOpen(true)}
              >
                <CreditCard className="size-4" />
                Record Payment
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => setIsInvoiceOpen(true)}
              >
                <FileText className="size-4" />
                Create Invoice
              </Button>
              <Link href={`/tenancies/${id}/ledger`}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="size-4" />
                  View Folio
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => setIsEndTenancyOpen(true)}
              >
                <LogOut className="size-4" />
                End Tenancy
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <SectionHeader title="Bond Details" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Required</span>
                <span className="font-medium">{formatCurrency(tenancy.bond_required ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-medium">{formatCurrency(tenancy.bond_paid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Outstanding</span>
                <span className={`font-medium ${fin.bond_outstanding > 0 ? 'text-destructive' : 'text-success'}`}>
                  {formatCurrency(fin.bond_outstanding)}
                </span>
              </div>
              {tenancy.bond_number && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bond Number</span>
                  <span className="font-medium">{tenancy.bond_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* End Tenancy Dialog */}
      <ConfirmDialog
        open={isEndTenancyOpen}
        onOpenChange={setIsEndTenancyOpen}
        title="End Tenancy"
        description={`Are you sure you want to end the tenancy for ${tenantName}? This action cannot be undone.`}
        confirmLabel="End Tenancy"
        variant="destructive"
        onConfirm={() => setIsEndTenancyOpen(false)}
      />

      <RecordPaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
      />

      <CreateInvoiceDialog
        open={isInvoiceOpen}
        onOpenChange={setIsInvoiceOpen}
      />
    </ErrorBoundary>
  )
}
