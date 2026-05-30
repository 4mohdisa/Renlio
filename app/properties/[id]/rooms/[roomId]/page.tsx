"use client"
import { use } from "react"
import Link from "next/link"
import { CreditCard, FileText, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatCard } from "@/components/shared/StatCard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { SectionHeader } from "@/components/shared/SectionHeader"
import {
  getPropertyById,
  getRoomById,
  getTenancyByRoomId,
  getTenantById,
  getInvoicesByTenancyId,
} from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>
}) {
  const { id, roomId } = use(params)
  const property = getPropertyById(id)
  const room = getRoomById(roomId)
  const tenancy = room ? getTenancyByRoomId(room.id) : undefined
  const tenant = tenancy ? getTenantById(tenancy.tenant_id) : undefined
  const invoices = tenancy ? getInvoicesByTenancyId(tenancy.id) : []
  const pendingInvoices = invoices.filter((i) => i.status !== "PAID" && i.status !== "CANCELLED")

  if (!property || !room) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-medium text-foreground">Room not found</h2>
        <Link href="/properties"><Button variant="outline" className="mt-4">Back to Properties</Button></Link>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={room.room_label}
        description={`${property.name} — ${property.city}, ${property.postal_code}`}
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          { label: property.name, href: `/properties/${id}` },
          { label: room.room_label },
        ]}
        actions={<StatusBadge status={tenancy ? "OCCUPIED" : "VACANT"} />}
      />

      {tenant && tenancy ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Current Tenant"
              value={`${tenant.first_name} ${tenant.last_name}`}
              description={tenant.payment_reference ?? "No ref"}
            />
            <StatCard
              title="Paid To Date"
              value={tenancy.paid_to_date ? formatDate(tenancy.paid_to_date) : "—"}
            />
            <StatCard
              title="Rent Arrears"
              value={formatCurrency(tenancy.rent_arrears)}
              iconClassName={tenancy.rent_arrears > 0 ? "bg-[#FEE2E2] text-destructive" : "bg-success-light text-success"}
            />
            <StatCard
              title="Daily Rate"
              value={tenancy.daily_rate ? formatCurrency(tenancy.daily_rate) : "—"}
              description={`${formatCurrency(tenancy.rent_amount)}/${tenancy.rent_frequency.toLowerCase()}`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <SectionHeader title="Tenancy Details" />
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
                    <p className="text-muted-foreground">Rent</p>
                    <p className="font-medium text-foreground">{formatCurrency(tenancy.rent_amount)}/{tenancy.rent_frequency.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bond</p>
                    <p className="font-medium text-foreground">
                      {formatCurrency(tenancy.bond_paid)} / {formatCurrency(tenancy.bond_required ?? 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bond Status</p>
                    <StatusBadge status={tenancy.bond_status} />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bond Number</p>
                    <p className="font-medium text-foreground">{tenancy.bond_number ?? "—"}</p>
                  </div>
                </div>
              </div>

              {pendingInvoices.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <SectionHeader title="Pending Invoices" />
                  <div className="space-y-3">
                    {pendingInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-surface transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{inv.description ?? inv.invoice_number}</p>
                          <p className="text-xs text-muted-foreground">Due {formatDate(inv.due_date)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={inv.status} />
                          <span className="text-sm font-medium">{formatCurrency(inv.remaining_balance)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <SectionHeader title="Quick Actions" />
              <Link href={`/tenancies/${tenancy.id}/ledger`} className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="size-4" />
                  View Ledger
                </Button>
              </Link>
              <Link href="/payments/new" className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <CreditCard className="size-4" />
                  Record Payment
                </Button>
              </Link>
              <Link href="/invoices/new" className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="size-4" />
                  Create Invoice
                </Button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-1">Room is Vacant</h3>
          <p className="text-sm text-muted-foreground mb-4">No active tenancy for this room.</p>
          <Link href={`/properties/${id}/rooms/${roomId}/tenancies/new`}>
            <Button>Start Tenancy</Button>
          </Link>
        </div>
      )}
    </>
  )
}
