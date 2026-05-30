"use client"
import { use, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/PageHeader"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { propertySchema, type PropertyFormValues } from "@/lib/validations"
import { getPropertyById } from "@/lib/mock-data"

export default function PropertyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const property = getPropertyById(id)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      postal_code: "",
      country: "Australia",
      management_mode: "WHOLE_PROPERTY",
    },
  })

  useEffect(() => {
    if (property) {
      form.reset({
        name: property.name,
        address_line_1: property.address_line_1,
        address_line_2: property.address_line_2 ?? "",
        city: property.city,
        postal_code: property.postal_code,
        country: property.country ?? "Australia",
        management_mode: property.management_mode,
        total_rooms: property.total_rooms ?? undefined,
      })
    }
  }, [property, form])

  const handleSubmit = async (_values: PropertyFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    toast.success("Property updated successfully")
    router.push(`/properties/${id}`)
  }

  if (!property) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-medium text-foreground">Property not found</h2>
        <Link href="/properties"><Button variant="outline" className="mt-4">Back to Properties</Button></Link>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={`Edit ${property.name}`}
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          { label: property.name, href: `/properties/${id}` },
          { label: "Edit" },
        ]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-2xl">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Property Details</h2>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line_2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {property.management_mode === "ROOMING" && (
                <FormField
                  control={form.control}
                  name="total_rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Rooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Link href={`/properties/${id}`}>
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}
