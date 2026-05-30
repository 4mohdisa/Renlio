"use client"
import { useState } from "react"
import { User, Mail, Building2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/shared/PageHeader"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { toast } from "sonner"

export default function AccountSettingsPage() {
  const [name, setName] = useState("Property Manager")
  const [email, setEmail] = useState("manager@example.com")
  const [company, setCompany] = useState("My Property Management")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call - will be replaced with Supabase in Phase 2
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    toast.success("Account settings saved")
    setIsSaving(false)
  }

  return (
    <>
      <PageHeader
        title="Account Settings"
        description="Manage your profile and preferences"
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Account" },
        ]}
      />

      <div className="max-w-2xl space-y-6">
        {/* Profile Section */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <SectionHeader title="Profile Information" />
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="size-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="size-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building2 className="size-4" />
                Company Name
              </Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <SectionHeader title="Preferences" />
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important events
                </p>
              </div>
              <div className="h-6 w-11 rounded-full bg-slate-200 relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">
                  Receive weekly summary reports
                </p>
              </div>
              <div className="h-6 w-11 rounded-full bg-slate-900 relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="size-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </>
  )
}
