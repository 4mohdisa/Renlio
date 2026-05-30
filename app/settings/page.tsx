'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Loader2, Trash2, Download, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { useStore, useOrgSettings, useDisplayPreferences, useNotificationPreferences } from '@/lib/store'
import { toastSuccess } from '@/lib/toast'

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

const orgSchema = z.object({
  name: z.string().min(1, 'Organisation name is required'),
  trading_name: z.string().optional(),
  abn: z.string().optional().refine(
    (val) => !val || /^\d{2}\s?\d{3}\s?\d{3}\s?\d{3}$/.test(val.replace(/\s/g, '')),
    { message: 'ABN must be 11 digits' }
  ),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type OrgFormValues = z.infer<typeof orgSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
]

// ============================================================
// SECTION 1: ORGANISATION PROFILE
// ============================================================

function OrganisationSection() {
  const { org, setOrg } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: org,
  })

  useEffect(() => {
    form.reset(org)
  }, [org, form])

  async function onSubmit(values: OrgFormValues) {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 300))
    setOrg({
      name: values.name,
      trading_name: values.trading_name ?? '',
      abn: values.abn ?? '',
      email: values.email,
      phone: values.phone ?? '',
      address: values.address ?? '',
      city: values.city ?? '',
      state: values.state ?? 'SA',
      postcode: values.postcode ?? '',
    })
    toastSuccess('Organisation profile saved')
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organisation Profile</CardTitle>
        <CardDescription>Your organisation details appear on invoices, receipts, and statements</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organisation Name *</Label>
              <Input id="org-name" {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-trading">Trading Name</Label>
              <Input id="org-trading" {...form.register('trading_name')} placeholder="Optional" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org-abn">ABN</Label>
              <Input id="org-abn" {...form.register('abn')} placeholder="12 345 678 901" />
              {form.formState.errors.abn && (
                <p className="text-sm text-red-500">{form.formState.errors.abn.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-email">Email *</Label>
              <Input id="org-email" type="email" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-phone">Phone</Label>
            <Input id="org-phone" {...form.register('phone')} placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-address">Address</Label>
            <Input id="org-address" {...form.register('address')} placeholder="Optional" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org-city">City</Label>
              <Input id="org-city" {...form.register('city')} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-state">State</Label>
              <Select
                value={form.watch('state')}
                onValueChange={(v) => form.setValue('state', v ?? undefined)}
              >
                <SelectTrigger id="org-state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {AUSTRALIAN_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-postcode">Postcode</Label>
              <Input id="org-postcode" {...form.register('postcode')} placeholder="Optional" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Organisation
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

// ============================================================
// SECTION 2: DISPLAY PREFERENCES
// ============================================================

function DisplayPreferencesSection() {
  const { display, setDisplay } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function savePreferences() {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 300))
    toastSuccess('Display preferences saved')
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Preferences</CardTitle>
        <CardDescription>Customise how Renlio displays information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select
              value={display.date_format}
              onValueChange={(v) => setDisplay({ ...display, date_format: v as typeof display.date_format })}
            >
              <SelectTrigger id="date-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency Display</Label>
            <Select
              value={display.currency}
              onValueChange={(v) => setDisplay({ ...display, currency: v as typeof display.currency })}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>
                <SelectItem value="GBP">GBP — British Pound</SelectItem>
                <SelectItem value="USD">USD — US Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rent-freq">Default Rent Frequency</Label>
            <Select
              value={display.default_rent_frequency}
              onValueChange={(v) => setDisplay({ ...display, default_rent_frequency: v as typeof display.default_rent_frequency })}
            >
              <SelectTrigger id="rent-freq">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="FORTNIGHTLY">Fortnightly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="items-page">Items Per Page</Label>
            <Select
              value={String(display.items_per_page)}
              onValueChange={(v) => setDisplay({ ...display, items_per_page: Number(v) as 10 | 25 | 50 })}
            >
              <SelectTrigger id="items-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium">Show Arrears Warning</p>
            <p className="text-xs text-muted-foreground">Highlight rows with arrears in red</p>
          </div>
          <Switch
            checked={display.show_arrears_warning}
            onCheckedChange={(v) => setDisplay({ ...display, show_arrears_warning: v })}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium">Compact Table View</p>
            <p className="text-xs text-muted-foreground">Reduce table row padding</p>
          </div>
          <Switch
            checked={display.compact_table_view}
            onCheckedChange={(v) => setDisplay({ ...display, compact_table_view: v })}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={savePreferences} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  )
}

// ============================================================
// SECTION 3: NOTIFICATION PREFERENCES
// ============================================================

function NotificationPreferencesSection() {
  const { notifications, setNotifications } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function savePreferences() {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 300))
    toastSuccess('Notification preferences saved')
    setIsSubmitting(false)
  }

  const switches = [
    { key: 'rent_overdue', label: 'Rent Overdue Alerts', default: true },
    { key: 'invoice_due', label: 'Invoice Due Reminders', default: true },
    { key: 'bill_due', label: 'Bill Due Reminders', default: true },
    { key: 'lease_expiry', label: 'Lease Expiry Warnings', default: true },
    { key: 'bond_return', label: 'Bond Due for Return', default: false },
    { key: 'new_move_in', label: 'New Tenant Move In', default: true },
  ] as const

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose what you want to be alerted about — email notifications available in Phase 2</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {switches.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between py-2">
            <p className="text-sm font-medium">{label}</p>
            <Switch
              checked={notifications[key as keyof typeof notifications]}
              onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })}
            />
          </div>
        ))}
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 mt-4">
          <p className="text-sm text-blue-700">
            Email and push notifications will be activated when your account is connected in Phase 2. 
            Your preferences are saved and will apply automatically.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={savePreferences} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  )
}

// ============================================================
// SECTION 4: ACCOUNT
// ============================================================

function AccountSection() {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(values: PasswordFormValues) {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    toastSuccess('Password updated — changes will apply when account is connected')
    form.reset()
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your sign in credentials</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account-email">Email Address</Label>
            <Input id="account-email" type="email" value="demo@renlio.app" disabled />
            <p className="text-xs text-muted-foreground">Email changes available in Phase 2</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" {...form.register('currentPassword')} />
            {form.formState.errors.currentPassword && (
              <p className="text-sm text-red-500">{form.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" {...form.register('newPassword')} />
            {form.formState.errors.newPassword && (
              <p className="text-sm text-red-500">{form.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" {...form.register('confirmPassword')} />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

// ============================================================
// SECTION 5: DANGER ZONE
// ============================================================

function DangerZoneSection() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  function handleExport() {
    toastSuccess('Data export will be available in Phase 2')
  }

  function handleDelete() {
    if (confirmText === 'DELETE') {
      toastSuccess('Account deletion available in Phase 2')
      setDeleteDialogOpen(false)
      setConfirmText('')
    }
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>Irreversible actions — proceed with caution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium">Export All Data</p>
            <p className="text-xs text-muted-foreground">Download all your data in JSON format</p>
          </div>
          <Button variant="outline" className="text-destructive border-destructive/30" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-red-600">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all associated data. 
              This action cannot be undone. Type DELETE to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE'}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function SettingsPage() {
  const { isLoaded } = useStore()

  if (!isLoaded) {
    return (
      <>
        <PageHeader title="Settings" description="Manage your account and organisation settings." />
        <div className="max-w-2xl space-y-8">
          <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and organisation settings." />
      <div className="max-w-2xl space-y-8">
        <OrganisationSection />
        <DisplayPreferencesSection />
        <NotificationPreferencesSection />
        <AccountSection />
        <DangerZoneSection />
      </div>
    </>
  )
}
