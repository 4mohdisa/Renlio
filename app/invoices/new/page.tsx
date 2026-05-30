"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { PageHeader } from "@/components/shared/PageHeader"
import { toastSuccess } from "@/lib/toast"
import { mockSuppliers } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { invoiceSchema, type InvoiceFormValues } from "@/lib/validations"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const CATEGORY_OPTIONS = [
  { label: "Rent", value: "RENT" },
  { label: "Water Bill", value: "WATER" },
  { label: "Gas", value: "GAS" },
  { label: "Electricity", value: "ELECTRICITY" },
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Cleaning", value: "CLEANING" },
  { label: "Gardening", value: "GARDENING" },
  { label: "Repairs", value: "REPAIRS" },
]

export default function InvoiceNewPage() {
  const router = useRouter()

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      category: "RENT",
      description: "",
      amount: 0,
      due_date: "",
      issue_date: "",
      invoice_source: "OWNER",
      supplier_id: "",
      include_tax: false,
    },
  })

  const watchAmount = form.watch("amount")
  const watchTax = form.watch("include_tax")
  const watchSource = form.watch("invoice_source")

  const total = useMemo(() => {
    const baseAmount = Number(watchAmount) || 0
    if (watchTax) {
      return (baseAmount * 1.1).toFixed(2)
    }
    return baseAmount.toFixed(2)
  }, [watchAmount, watchTax])

  const handleSubmit = async (values: InvoiceFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const sourceLabel = values.invoice_source === "OWNER" ? "Owner" : "Supplier"
    toastSuccess(`Invoice created successfully (${sourceLabel})`)
    router.push("/invoices")
  }

  return (
    <>
      <PageHeader
        title="Create Invoice"
        description="Issue a new invoice to a tenant."
        breadcrumbs={[
          { label: "Invoices", href: "/invoices" },
          { label: "Create Invoice" },
        ]}
      />

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
            {/* Invoice Source Toggle */}
            <FormField
              control={form.control}
              name="invoice_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Source</FormLabel>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("OWNER")
                          form.setValue("supplier_id", "")
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          field.value === "OWNER"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Building2 className="size-4" />
                        Owner
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("SUPPLIER")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          field.value === "SUPPLIER"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Truck className="size-4" />
                        Supplier
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {field.value === "OWNER"
                        ? "The property owner is charging the tenant directly."
                        : "A third-party supplier is charging the tenant."}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Supplier Selector (only when SUPPLIER) */}
            {watchSource === "SUPPLIER" && (
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier *</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                      >
                        <option value="">Select supplier</option>
                        {mockSuppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name} ({supplier.category.toLowerCase()})
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Tenant</h2>
              <div>
                <FormLabel>Tenancy</FormLabel>
                <div className="rounded-lg border border-dashed border-border p-3 mt-1 text-sm text-muted-foreground">
                  Tenancy selector placeholder — searchable by tenant name
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Invoice Details</h2>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full mt-1 h-10 rounded-md border border-border bg-background px-3 text-sm"
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. Rent - March 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="650.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Include Tax Checkbox */}
              <FormField
                control={form.control}
                name="include_tax"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">Include Tax (10%)</FormLabel>
                  </FormItem>
                )}
              />
              
              {/* Total Display */}
              {watchAmount > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Total including tax: </span>
                  <span className="font-semibold">{formatCurrency(parseFloat(total))}</span>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issue_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Link href="/invoices">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                {form.formState.isSubmitting ? "Creating..." : "Issue Invoice"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
