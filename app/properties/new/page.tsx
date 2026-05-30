"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
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

export default function PropertyNewPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      postal_code: "",
      country: "Australia",
      management_mode: "ROOMING",
    },
  })

  const managementMode = form.watch("management_mode")

  const handleSubmit = async (_values: PropertyFormValues) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    toast.success("Property created successfully")
    router.push("/properties")
  }

  return (
    <>
      <PageHeader
        title="Add Property"
        description="Register a new property in your portfolio."
        breadcrumbs={[
          { label: "Properties", href: "/properties" },
          { label: "Add Property" },
        ]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-2xl">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-8">
            {/* SECTION: Management Mode */}
            <div>
              <h2 className="text-base font-semibold text-foreground mb-4">Management Mode</h2>
              <FormField
                control={form.control}
                name="management_mode"
                render={({ field }) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange("ROOMING")}
                      className={`rounded-lg border-2 p-4 text-left transition-colors ${
                        field.value === "ROOMING"
                          ? "border-accent bg-info-light/50"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <p className="font-medium text-foreground">Rooming (HMO)</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Multiple rooms, individual tenants per room
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("WHOLE_PROPERTY")}
                      className={`rounded-lg border-2 p-4 text-left transition-colors ${
                        field.value === "WHOLE_PROPERTY"
                          ? "border-accent bg-info-light/50"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <p className="font-medium text-foreground">Whole Property</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Single tenancy for the entire property
                      </p>
                    </button>
                  </div>
                )}
              />
            </div>

            {/* SECTION: Property Details */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">Property Details</h2>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 123 Main Street" {...field} />
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
                      <Input placeholder="Street address" {...field} />
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
                    <FormLabel>
                      Address Line 2{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment, suite, etc." {...field} />
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
                        <Input placeholder="City" {...field} />
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
                        <Input placeholder="Postal code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {managementMode === "ROOMING" && (
                <FormField
                  control={form.control}
                  name="total_rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Rooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Number of rooms"
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

            {/* FORM ACTIONS */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Link href="/properties">
                <Button type="button" variant="ghost" className="gap-1">
                  <ChevronLeft className="size-4" />
                  Back to Properties
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/properties">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting || form.formState.isSubmitting}>
                  {isSubmitting || form.formState.isSubmitting ? "Saving..." : "Save Property"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}
