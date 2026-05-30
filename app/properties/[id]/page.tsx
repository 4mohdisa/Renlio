"use client"
import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, MoreHorizontal, FileText, Plus, Home, DoorOpen, BookOpen, ArrowRight, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatCard } from "@/components/shared/StatCard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { ManagementModeBadge } from "@/components/shared/ManagementModeBadge"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { BillDialog } from "@/components/shared/BillDialog"
import { ErrorBoundary } from "@/components/shared"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getPropertyById,
  getRoomsByPropertyId,
  getTenanciesByPropertyId,
  getTenantById,
  getBillsByPropertyId,
  getInvoicesByPropertyId,
  mockFolios,
  mockContacts,
  mockOwnerLedgerRows,
  mockBills,
  mockTenants,
  mockTenancies,
  mockTransactions,
  mockInvoices,
  mockRooms,
} from "@/lib/mock-data"
import { computePropertyFinancials, computeTenancyFinancials, computeOwnerFolioMetrics, formatArrears } from "@/lib/calculations"
import { toastSuccess } from "@/lib/toast"
import { formatCurrency, formatDate } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface OwnerPeopleListProps {
  contactGroupId: string
}

function OwnerPeopleList({ contactGroupId }: OwnerPeopleListProps) {
  const [activePersonIndex, setActivePersonIndex] = useState(0)
  const ownerPeople = mockContacts.filter((c) => c.contact_group_id === contactGroupId)
  const person = ownerPeople[activePersonIndex]
  
  if (!person) return null
  
  return (
    <div className="space-y-3">
      {ownerPeople.length > 1 && (
        <div className="flex gap-2 mb-3">
          {ownerPeople.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePersonIndex(idx)}
              className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                activePersonIndex === idx
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Person {idx + 1}
            </button>
          ))}
        </div>
      )}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900">{person.first_name} {person.last_name}</span>
          {person.is_primary && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">Primary</span>
          )}
        </div>
        {person.company_name && <p className="text-sm text-slate-500">{person.company_name}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
          {person.mobile_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>{person.mobile_phone}</span>
            </div>
          )}
          {person.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>{person.email}</span>
            </div>
          )}
          {person.address && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>{person.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const property = getPropertyById(id)
  const rooms = getRoomsByPropertyId(id)
  const tenancies = getTenanciesByPropertyId(id)
  const bills = getBillsByPropertyId(id)
  const allInvoices = getInvoicesByPropertyId(id)
  const pendingInvoices = allInvoices.filter((i) => i.status !== "PAID" && i.status !== "CANCELLED")
  const activeTenancies = tenancies.filter((t) => t.status === "ACTIVE")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null)
  const [billDialogOpen, setBillDialogOpen] = useState(false)

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-slate-50 rounded-full p-6 mb-4">
          <Home className="size-12 text-slate-300" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Property not found</h2>
        <p className="text-sm text-slate-500 mt-2 text-center max-w-sm">
          The property you are looking for does not exist or may have been deleted.
        </p>
        <div className="flex gap-3 mt-6">
          <Link href="/properties">
            <Button variant="outline">Back to Properties</Button>
          </Link>
          <Link href="/properties/new">
            <Button>Add New Property</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Compute property financials using calculations engine
  const fin = computePropertyFinancials(
    property.id,
    mockTenancies,
    mockTransactions,
    mockInvoices,
    mockBills,
    mockRooms
  )
  const isRooming = property.management_mode === "ROOMING"

  return (
    <ErrorBoundary>
      <PageHeader
        title={property.name}
        description={`${property.address_line_1}, ${property.city}, ${property.postal_code}`}
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          { label: property.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <ManagementModeBadge mode={property.management_mode} />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="icon-sm" />}
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.location.href = `/properties/${id}/edit`}>
                  <Edit className="size-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteOpen(true)}>
                  <Trash2 className="size-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Stat cards with computed financials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isRooming && (
          <StatCard title="Rooms" value={`${fin.occupied_rooms}/${fin.total_rooms}`} description={`${fin.occupancy_rate}% occupancy`} />
        )}
        <StatCard title="Monthly Rent" value={formatCurrency(fin.total_monthly_rent)} />
        <StatCard
          title="Arrears"
          value={formatCurrency(fin.total_arrears)}
          iconClassName={fin.total_arrears > 0 ? "bg-[#FEE2E2] text-destructive" : "bg-success-light text-success"}
        />
        <StatCard title="Properties" value={1} />
        <StatCard
          title="Pending Invoices"
          value={pendingInvoices.length}
          description={pendingInvoices.length > 0 ? `${formatCurrency(pendingInvoices.reduce((s, i) => s + i.remaining_balance, 0))} outstanding` : "All clear"}
          icon={<FileText className="size-5" />}
          iconClassName={pendingInvoices.length > 0 ? "bg-warning-light text-warning" : "bg-success-light text-success"}
        />
      </div>

      <Tabs defaultValue={isRooming ? "rooms" : "tenancies"} className="space-y-6">
        <TabsList>
          {isRooming && <TabsTrigger value="rooms">Rooms</TabsTrigger>}
          {!isRooming && <TabsTrigger value="tenancies">Tenancy</TabsTrigger>}
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="owner">Owner</TabsTrigger>
        </TabsList>

        {isRooming && (
          <TabsContent value="rooms">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Link href={`/properties/${id}/rooms/new`}>
                  <Button><Plus className="h-4 w-4 mr-2" />Add Room</Button>
                </Link>
              </div>
              {rooms.length === 0 ? (
                <EmptyState
                  icon={<DoorOpen className="size-10 text-slate-400" />}
                  title="No rooms yet"
                  description="Add the first room to this property"
                  actionLabel="Add Room"
                  actionHref={`/properties/${id}/rooms/new`}
                />
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Room</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Tenant</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Rent</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Paid To</th>
                          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Rent Arrears</th>
                          <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">Invoice Arrears</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room) => {
                          const activeTenancy = mockTenancies.find(
                            (t) => t.room_id === room.id && t.status === 'ACTIVE'
                          )
                          const tenant = activeTenancy
                            ? mockTenants.find((t) => t.id === activeTenancy.tenant_id)
                            : null
                          // Compute tenancy financials for this room
                          const tenancyFin = activeTenancy
                            ? computeTenancyFinancials(activeTenancy, mockTransactions, mockInvoices)
                            : null
                          const arrearsInfo = tenancyFin ? formatArrears(tenancyFin.rent_arrears) : null
                          return (
                            <tr
                              key={room.id}
                              className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                              onClick={() => router.push(`/properties/${id}/rooms/${room.id}`)}
                            >
                              <td className="px-4 py-3">
                                <div>
                                  <span className="font-medium text-slate-900">{room.room_label}</span>
                                  <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
                                    {room.room_type.charAt(0) + room.room_type.slice(1).toLowerCase()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {tenant ? (
                                  <span className="text-slate-900">{tenant.first_name} {tenant.last_name}</span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-400">Vacant</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {activeTenancy
                                  ? `${formatCurrency(activeTenancy.rent_amount)}/${activeTenancy.rent_frequency === 'MONTHLY' ? 'mo' : activeTenancy.rent_frequency === 'WEEKLY' ? 'wk' : 'fn'}`
                                  : '—'}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {tenancyFin ? formatDate(tenancyFin.paid_to_date.toISOString()) : '—'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {arrearsInfo ? (
                                  <span className={`font-medium ${arrearsInfo.color}`}>
                                    {arrearsInfo.display}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {tenancyFin && tenancyFin.invoice_arrears > 0 ? (
                                  <span className="text-red-600 font-medium">
                                    {formatCurrency(tenancyFin.invoice_arrears)}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {!isRooming && (
          <TabsContent value="tenancies">
            <div className="space-y-4">
              {activeTenancies.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  {activeTenancies.map((tenancy) => {
                    const tenant = getTenantById(tenancy.tenant_id)
                    const tenancyFin = computeTenancyFinancials(tenancy, mockTransactions, mockInvoices)
                    const arrearsInfo = formatArrears(tenancyFin.rent_arrears)
                    return (
                      <div key={tenancy.id} className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">
                              {tenant ? `${tenant.first_name} ${tenant.last_name}` : "Unknown Tenant"}
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success mt-1">
                              ACTIVE
                            </span>
                          </div>
                          <Link href={`/tenancies/${tenancy.id}`}>
                            <Button variant="secondary" size="sm">
                              View Tenancy
                              <ArrowRight className="size-4 ml-1" />
                            </Button>
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Rent</p>
                            <p className="font-medium text-foreground">
                              {formatCurrency(tenancy.rent_amount)}/{tenancy.rent_frequency.toLowerCase()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Paid To</p>
                            <p className="font-medium text-foreground">
                              {formatDate(tenancyFin.paid_to_date.toISOString())}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Lease End</p>
                            <p className="font-medium text-foreground">
                              {tenancy.lease_end_date ? formatDate(tenancy.lease_end_date) : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Arrears</p>
                            <p className={`font-medium ${arrearsInfo.color}`}>
                              {arrearsInfo.display}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<Home className="size-10 text-slate-400" />}
                  title="No active tenancy"
                  description="This property is currently vacant."
                  actionLabel="Create Tenancy"
                  actionHref={`/properties/${id}/tenancies/new`}
                />
              )}
            </div>
          </TabsContent>
        )}

        <TabsContent value="financial">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <SectionHeader title="Financial Summary" description="Overview of income and expenses for this property" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Total Rent Collected</p>
                <p className="text-xl font-semibold text-foreground mt-1">{formatCurrency(fin.total_monthly_rent * 3)}</p>
                <p className="text-xs text-muted-foreground">Last 3 months</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-semibold text-foreground mt-1">
                  {formatCurrency(bills.reduce((sum, b) => sum + b.total_amount, 0))}
                </p>
                <p className="text-xs text-muted-foreground">All bills</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground">Net Income</p>
                <p className="text-xl font-semibold text-success mt-1">
                  {formatCurrency(fin.total_monthly_rent * 3 - bills.reduce((sum, b) => sum + b.total_amount, 0))}
                </p>
                <p className="text-xs text-muted-foreground">Rent - expenses</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bills">
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-6 pb-0">
              <SectionHeader title="Property Bills" />
            </div>
            {bills.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-surface-alt">
                    <TableHead>Bill #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow 
                      key={bill.id}
                      className="cursor-pointer hover:bg-surface/50"
                      onClick={() => {
                        setSelectedBillId(bill.id)
                        setBillDialogOpen(true)
                      }}
                    >
                      <TableCell>
                        <span className="font-medium text-accent hover:underline">
                          {bill.bill_number}
                        </span>
                      </TableCell>
                      <TableCell>{bill.supplier_name}</TableCell>
                      <TableCell className="capitalize">{bill.category.toLowerCase().replace(/_/g, " ")}</TableCell>
                      <TableCell>{formatDate(bill.due_date)}</TableCell>
                      <TableCell><StatusBadge status={bill.status} /></TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(bill.total_amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                icon={<FileText className="size-10 text-slate-400" />}
                title="No bills yet"
                description="Property bills will appear here."
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="owner">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Financial Summary with computed metrics */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-base font-semibold text-slate-900 mb-4">Financial Summary</h2>
                {(() => {
                  const ownerMetrics = computeOwnerFolioMetrics(id, mockOwnerLedgerRows, mockBills)
                  return (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <p className="text-xs text-slate-400">Gross Income</p>
                          <p className="text-lg font-bold text-green-600 mt-1">{formatCurrency(ownerMetrics.gross_income)}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <p className="text-xs text-slate-400">Total Expenses</p>
                          <p className="text-lg font-bold text-red-600 mt-1">{formatCurrency(ownerMetrics.total_expenses)}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <p className="text-xs text-slate-400">Net Income</p>
                          <p className={`text-lg font-bold mt-1 ${ownerMetrics.net_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(ownerMetrics.net_income)}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <p className="text-xs text-slate-400">Bills Pending</p>
                          <p className="text-lg font-bold text-amber-600 mt-1">{formatCurrency(ownerMetrics.bills_pending)}</p>
                        </div>
                      </div>
                      {/* Additional summary row */}
                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
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
                    </>
                  )
                })()}
              </div>

              {/* Owner Contact */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-base font-semibold text-slate-900">Owner</h2>
                  {(() => {
                    const ownerFolio = mockFolios.find((f) => f.folio_type === 'OWNER' && f.reference_id === id)
                    return ownerFolio ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700">
                        {ownerFolio.folio_number}
                      </span>
                    ) : null
                  })()}
                </div>
                {(() => {
                  const ownerFolio = mockFolios.find((f) => f.folio_type === 'OWNER' && f.reference_id === id)
                  if (!ownerFolio) {
                    return (
                      <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6 text-center">
                        <p className="text-sm text-slate-400">No owner assigned to this property</p>
                        <Button variant="outline" className="mt-4" onClick={() => toastSuccess('Owner assignment coming in Phase 2')}>
                          Assign Owner
                        </Button>
                      </div>
                    )
                  }
                  return <OwnerPeopleList contactGroupId={ownerFolio.contact_group_id} />
                })()}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900">Actions</h2>
              <Link href={`/properties/${id}/owner-ledger`} className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="h-4 w-4" />
                  Folio
                </Button>
              </Link>
              {(() => {
                const ownerFolio = mockFolios.find((f) => f.folio_type === 'OWNER' && f.reference_id === id)
                if (!ownerFolio) {
                  return (
                    <Button variant="outline" className="w-full justify-start" onClick={() => toastSuccess('Owner assignment coming in Phase 2')}>
                      Assign Owner
                    </Button>
                  )
                }
                return null
              })()}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <BillDialog 
        billId={selectedBillId ?? ''} 
        open={billDialogOpen} 
        onOpenChange={setBillDialogOpen} 
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title={activeTenancies.length > 0 ? "Cannot Delete Property" : "Delete Property"}
        description={
          activeTenancies.length > 0
            ? `This property has ${activeTenancies.length} active ${activeTenancies.length === 1 ? "tenancy" : "tenancies"}. You must end all active tenancies and clear pending invoices before deleting this property.`
            : `Are you sure you want to delete "${property.name}"? This action cannot be undone. All rooms and financial records associated with this property will be permanently removed.`
        }
        confirmLabel={activeTenancies.length > 0 ? "Understood" : "Delete Property"}
        variant={activeTenancies.length > 0 ? "default" : "destructive"}
        onConfirm={() => {}}
      />
    </ErrorBoundary>
  )
}
