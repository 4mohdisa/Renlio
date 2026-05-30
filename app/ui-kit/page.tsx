"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/PageHeader"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { StatCard } from "@/components/shared/StatCard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { ManagementModeBadge } from "@/components/shared/ManagementModeBadge"
import { EmptyState } from "@/components/shared/EmptyState"
import { SearchBar } from "@/components/shared/SearchBar"
import { FilterBar } from "@/components/shared/FilterBar"
import { RecordPaymentDialog } from "@/components/shared/RecordPaymentDialog"
import { CreateInvoiceDialog } from "@/components/shared/CreateInvoiceDialog"
import { AddBillDialog } from "@/components/shared/AddBillDialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Building2,
  CreditCard,
  FileText,
  AlertTriangle,
  Plus,
  Home,
} from "lucide-react"

export default function UiKitPage() {
  const [searchValue, setSearchValue] = useState("")
  const [filterValue, setFilterValue] = useState("ALL")
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isBillOpen, setIsBillOpen] = useState(false)
  const [selectValue, setSelectValue] = useState("RENT")

  return (
    <>
      <PageHeader
        title="UI Kit"
        description="Component showcase for the Renlo design system."
        breadcrumbs={[{ label: "UI Kit" }]}
      />

      <Tabs defaultValue="buttons" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="shared">Shared Components</TabsTrigger>
          <TabsTrigger value="dialogs">Dialogs & Selects</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
        </TabsList>

        <TabsContent value="typography">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
            <SectionHeader title="System Font — Roboto" description="Roboto is the global primary font across all Renlo surfaces." />

            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Font Family</p>
                <p className="text-lg font-medium text-foreground">Roboto (via next/font/google)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">Regular (400)</p>
                  <p className="text-base font-normal text-foreground">The quick brown fox jumps over the lazy dog.</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">Medium (500)</p>
                  <p className="text-base font-medium text-foreground">The quick brown fox jumps over the lazy dog.</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">Bold (700)</p>
                  <p className="text-base font-bold text-foreground">The quick brown fox jumps over the lazy dog.</p>
                </div>
              </div>
            </div>

            <Separator />

            <SectionHeader title="Type Scale" />
            <div className="space-y-3">
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-16 shrink-0">text-3xl</span>
                <p className="text-3xl font-bold tracking-tight text-foreground">Page Heading</p>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-16 shrink-0">text-xl</span>
                <p className="text-xl font-semibold tracking-tight text-foreground">Section Heading</p>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-16 shrink-0">text-lg</span>
                <p className="text-lg font-semibold text-foreground">Card Title</p>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-16 shrink-0">text-base</span>
                <p className="text-base text-foreground">Body text used for general content and descriptions.</p>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-16 shrink-0">text-sm</span>
                <p className="text-sm text-muted-foreground">Secondary text used in tables, labels, and metadata.</p>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground w-16 shrink-0">text-xs</span>
                <p className="text-xs text-muted-foreground">Caption text used for fine print and auxiliary info.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="buttons">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
            <SectionHeader title="Button Variants" />
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>

            <Separator />

            <SectionHeader title="Button Sizes" />
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>

            <Separator />

            <SectionHeader title="Buttons with Icons" />
            <div className="flex flex-wrap gap-3">
              <Button><Plus className="size-4" /> Add Property</Button>
              <Button variant="outline"><CreditCard className="size-4" /> Record Payment</Button>
              <Button variant="ghost"><FileText className="size-4" /> Create Invoice</Button>
              <Button variant="destructive"><AlertTriangle className="size-4" /> Delete</Button>
            </div>

            <Separator />

            <SectionHeader title="Disabled State" />
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled Primary</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inputs">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
            <SectionHeader title="Text Inputs" />
            <div className="max-w-md space-y-4">
              <div>
                <Label htmlFor="default">Default Input</Label>
                <Input id="default" placeholder="Placeholder text" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="filled">Filled Input</Label>
                <Input id="filled" defaultValue="Pre-filled value" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="disabled">Disabled Input</Label>
                <Input id="disabled" disabled defaultValue="Disabled value" className="mt-1" />
              </div>
            </div>

            <Separator />

            <SectionHeader title="Textarea" />
            <div className="max-w-md">
              <Label htmlFor="textarea">Description</Label>
              <Textarea id="textarea" placeholder="Enter description..." className="mt-1" />
            </div>

            <Separator />

            <SectionHeader title="Checkboxes & Switches" />
            <div className="max-w-md space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox id="check1" defaultChecked />
                <Label htmlFor="check1">Checked</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="check2" />
                <Label htmlFor="check2">Unchecked</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="switch1" defaultChecked />
                <Label htmlFor="switch1">Enabled</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="switch2" />
                <Label htmlFor="switch2">Disabled</Label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
            <SectionHeader title="Status Badges" />
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="ACTIVE" />
              <StatusBadge status="PAID" />
              <StatusBadge status="COMPLETED" />
              <StatusBadge status="ISSUED" />
              <StatusBadge status="PENDING" />
              <StatusBadge status="PARTIALLY_PAID" />
              <StatusBadge status="OVERDUE" />
              <StatusBadge status="EXPIRED" />
              <StatusBadge status="TERMINATED" />
              <StatusBadge status="CANCELLED" />
              <StatusBadge status="DRAFT" />
              <StatusBadge status="VACANT" />
              <StatusBadge status="OCCUPIED" />
              <StatusBadge status="UNDER_MAINTENANCE" />
            </div>

            <Separator />

            <SectionHeader title="Management Mode Badges" />
            <div className="flex flex-wrap gap-2">
              <ManagementModeBadge mode="ROOMING" />
              <ManagementModeBadge mode="WHOLE_PROPERTY" />
            </div>

            <Separator />

            <SectionHeader title="Bond Status Badges" />
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="NOT_REQUIRED" />
              <StatusBadge status="REQUIRED" />
              <StatusBadge status="PARTIALLY_PAID" />
              <StatusBadge status="FULLY_PAID" />
              <StatusBadge status="HELD" />
              <StatusBadge status="RETURNED" />
              <StatusBadge status="PARTIALLY_RETURNED" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cards">
          <div className="space-y-6">
            <SectionHeader title="Stat Cards" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Properties" value={3} icon={<Building2 className="size-5" />} iconClassName="bg-accent/10 text-accent" />
              <StatCard title="Occupancy" value="80%" icon={<Home className="size-5" />} iconClassName="bg-info/10 text-info" description="16 of 20 rooms" />
              <StatCard title="Rent Collected" value="$14,800" icon={<CreditCard className="size-5" />} iconClassName="bg-success/10 text-success" />
              <StatCard title="Arrears" value="$650" icon={<AlertTriangle className="size-5" />} iconClassName="bg-[#FEE2E2] text-destructive" />
            </div>

            <Separator />

            <SectionHeader title="Content Cards" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-2">Standard Card</h3>
                <p className="text-sm text-muted-foreground">Cards use white background, rounded-xl corners, 1px border, p-6 padding, and a subtle shadow.</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Card</h3>
                <p className="text-sm text-muted-foreground">Hover this card to see the shadow increase, indicating interactivity.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shared">
          <div className="space-y-6">
            <SectionHeader title="Search Bar" />
            <SearchBar placeholder="Search anything..." value={searchValue} onChange={setSearchValue} />

            <Separator />

            <SectionHeader title="Filter Bar" />
            <FilterBar
              options={[
                { label: "All", value: "ALL" },
                { label: "Active", value: "ACTIVE" },
                { label: "Pending", value: "PENDING" },
                { label: "Overdue", value: "OVERDUE" },
              ]}
              value={filterValue}
              onChange={setFilterValue}
            />

            <Separator />

            <SectionHeader title="Page Header" description="Used at the top of every page" />
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              The PageHeader component renders breadcrumbs, title, description, and optional action buttons. See every page for examples.
            </div>

            <Separator />

            <SectionHeader title="Section Header" description="Used within cards and sections" />
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              The SectionHeader component renders a title, optional description, and optional action buttons within a section context.
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dialogs">
          <div className="space-y-6">
            <SectionHeader title="Create Flow Dialogs" description="Payments, invoices, and bills now open in dialogs instead of separate pages." />
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setIsPaymentOpen(true)}><CreditCard className="size-4" /> Record Payment</Button>
              <Button onClick={() => setIsInvoiceOpen(true)}><FileText className="size-4" /> Create Invoice</Button>
              <Button onClick={() => setIsBillOpen(true)}><Plus className="size-4" /> Add Bill</Button>
            </div>

            <Separator />

            <SectionHeader title="Select Dropdown" description="Used for payment allocation and other single-choice fields." />
            <div className="max-w-xs">
              <Label>Allocation Target</Label>
              <Select value={selectValue} onValueChange={(v) => { if (v) setSelectValue(v) }}>
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
        </TabsContent>

        <TabsContent value="states">
          <div className="space-y-6">
            <SectionHeader title="Empty State" />
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <EmptyState
                title="No properties found"
                description="Get started by adding your first property to Renlo."
                actionLabel="Add Property"
                actionHref="/properties/new"
              />
            </div>

            <Separator />

            <SectionHeader title="Loading Skeletons" />
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="grid grid-cols-4 gap-4 mt-4">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </div>

            <Separator />

            <SectionHeader title="Color Tokens" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="h-12 bg-primary" />
                <div className="p-2 text-xs"><p className="font-medium">Primary</p><p className="text-muted-foreground">#1E3A5F</p></div>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="h-12 bg-accent" />
                <div className="p-2 text-xs"><p className="font-medium">Accent</p><p className="text-muted-foreground">#0D9488</p></div>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="h-12 bg-success" />
                <div className="p-2 text-xs"><p className="font-medium">Success</p><p className="text-muted-foreground">#059669</p></div>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="h-12 bg-warning" />
                <div className="p-2 text-xs"><p className="font-medium">Warning</p><p className="text-muted-foreground">#D97706</p></div>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="h-12 bg-destructive" />
                <div className="p-2 text-xs"><p className="font-medium">Error</p><p className="text-muted-foreground">#DC2626</p></div>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="h-12 bg-info" />
                <div className="p-2 text-xs"><p className="font-medium">Info</p><p className="text-muted-foreground">#0284C7</p></div>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="h-12 bg-surface" />
                <div className="p-2 text-xs"><p className="font-medium">Surface</p><p className="text-muted-foreground">#F5F7FA</p></div>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="h-12 bg-surface-alt" />
                <div className="p-2 text-xs"><p className="font-medium">Surface Alt</p><p className="text-muted-foreground">#EEF2F6</p></div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <RecordPaymentDialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen} />
      <CreateInvoiceDialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen} />
      <AddBillDialog open={isBillOpen} onOpenChange={setIsBillOpen} />
    </>
  )
}
