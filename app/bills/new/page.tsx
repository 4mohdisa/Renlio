"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/shared/PageHeader"
import { toastSuccess } from "@/lib/toast"
import { mockSuppliers, mockProperties } from "@/lib/mock-data"
import { billSchema, type BillFormValues } from "@/lib/validations"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const CATEGORY_OPTIONS = [
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Cleaning", value: "CLEANING" },
  { label: "Gardening", value: "GARDENING" },
  { label: "Utilities", value: "UTILITIES" },
  { label: "Tax", value: "TAX" },
]

export default function BillNewPage() {
  const router = useRouter()

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      supplier_id: "",
      property_id: "",
      category: "MAINTENANCE",
      description: "",
      amount: 0,
      due_date: "",
      issue_date: "",
      include_tax: false,
    },
  })

  const handleSubmit = async (values: BillFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    toastSuccess("Bill added")
    router.push("/bills")
  }

  return (
    <>
      <PageHeader
        title="Add Bill"
        description="Record a new property expense."
        breadcrumbs={[
          { label: "Bills", href: "/bills" },
          { label: "Add Bill" },
        ]}
      />

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Property</h2>
              
              <FormField
                control={form.control}
                name="property_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property *</FormLabel>
                    <FormControl>
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                      >
                        <option value="">Select property</option>
                        {mockProperties.map((property) => (
                          <option key={property.id} value={property.id}>
                            {property.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Bill Details</h2>
              
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
                      <Textarea placeholder="Description of the bill" {...field} />
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
                        placeholder="320.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              <Link href="/bills">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button 
                type="submit"
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                Save Bill
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
