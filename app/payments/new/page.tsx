"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/shared/PageHeader"

export default function PaymentNewPage() {
  const [allocationType, setAllocationType] = useState("RENT")

  return (
    <>
      <PageHeader
        title="Record Payment"
        description="Log a new payment from a tenant."
        breadcrumbs={[
          { label: "Payments", href: "/payments" },
          { label: "Record Payment" },
        ]}
      />

      <div className="max-w-2xl">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Tenant</h2>
            <div>
              <Label htmlFor="tenancy">Tenancy</Label>
              <div className="rounded-lg border border-dashed border-border p-3 mt-1 text-sm text-muted-foreground">
                Tenancy selector placeholder — searchable by tenant name
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Payment Details</h2>
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input id="amount" type="number" placeholder="800.00" className="mt-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Payment Date</Label>
                <Input id="date" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <div className="rounded-lg border border-dashed border-border p-3 mt-1 text-sm text-muted-foreground">
                  Method selector — Bank Transfer, Cash, etc.
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="reference">Bank Reference (optional)</Label>
              <Input id="reference" placeholder="SMITH-001" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" placeholder="Additional notes about this payment" className="mt-1" />
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <h2 className="text-lg font-semibold text-foreground">Allocate This Payment</h2>
            <div>
              <Label>Allocation Target</Label>
              <Select value={allocationType} onValueChange={(v) => { if (v) setAllocationType(v) }}>
                <SelectTrigger className="w-full mt-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RENT">Pay towards Rent</SelectItem>
                  <SelectItem value="BOND">Pay towards Bond</SelectItem>
                  <SelectItem value="INVOICE">Pay specific Invoice</SelectItem>
                  <SelectItem value="CREDIT">Hold as Credit on account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link href="/payments">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button>Record Payment</Button>
          </div>
        </div>
      </div>
    </>
  )
}
