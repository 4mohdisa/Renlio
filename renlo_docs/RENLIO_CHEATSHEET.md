# Renlio Development Cheatsheet

Quick reference for common patterns, utilities, and code snippets when building Renlio.

---

## Color Palette (Ailo-Inspired)

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0F172A` | Headers, primary buttons, text |
| Accent | `#3B82F6` | Links, active states, icons |
| Accent Hover | `#2563EB` | Button hover states |
| Background | `#FFFFFF` | Page background |
| Surface | `#F8FAFC` | Cards, panels |
| Surface Alt | `#F1F5F9` | Table headers, alternate rows |
| Border | `#E2E8F0` | Dividers, input borders |
| Border Light | `#F1F5F9` | Subtle separators |
| Text Primary | `#0F172A` | Headings, primary text |
| Text Secondary | `#64748B` | Labels, descriptions |
| Text Muted | `#94A3B8` | Placeholders, hints |
| Success | `#10B981` | Paid status, success states |
| Success Light | `#D1FAE5` | Success backgrounds |
| Warning | `#F59E0B` | Partial payments, warnings |
| Warning Light | `#FEF3C7` | Warning backgrounds |
| Danger | `#EF4444` | Overdue, errors |
| Danger Light | `#FEE2E2` | Error backgrounds |
| Info | `#3B82F6` | Information, neutral |
| Info Light | `#DBEAFE` | Info backgrounds |

---

## Tailwind Utilities Reference

### Spacing (8px Base)
```
1  = 4px    7  = 28px   16 = 64px
2  = 8px    8  = 32px   20 = 80px
3  = 12px   10 = 40px   24 = 96px
4  = 16px   12 = 48px   32 = 128px
5  = 20px   14 = 56px   40 = 160px
6  = 24px   15 = 60px   48 = 192px
```

### Common Patterns
```
/* Card */
bg-white rounded-xl border border-slate-200 p-6 shadow-sm

/* Page Header */
flex items-center justify-between mb-8

/* Section */
space-y-6

/* Form Grid */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

/* Table Container */
bg-white rounded-xl border border-slate-200 overflow-hidden

/* Status Badge */
inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium

/* Input */
flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2

/* Button Primary */
bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-4 py-2

/* Button Secondary */
bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg px-4 py-2

/* Button Ghost */
text-slate-600 hover:bg-slate-100 rounded-lg px-4 py-2
```

---

## TanStack Query Hooks

### Basic Query Pattern
```typescript
// hooks/use-properties.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })
}
```

### Query with Parameters
```typescript
// hooks/use-tenant.ts
export function useTenant(tenantId: string) {
  return useQuery({
    queryKey: ['tenants', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select(`
          *,
          property:properties(name, address),
          room:rooms(name)
        `)
        .eq('id', tenantId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!tenantId
  })
}
```

### Mutation with Optimistic Update
```typescript
// hooks/use-create-payment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreatePayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payment: CreatePaymentInput) => {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['tenant-ledger'] })
    }
  })
}
```

### Ledger Query with Calculations
```typescript
// hooks/use-tenant-ledger.ts
export function useTenantLedger(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-ledger', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_ledger_view')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('transaction_date', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!tenantId
  })
}
```

---

## Supabase Client Setup

### Client Configuration
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Auth Helpers
```typescript
// lib/auth.ts
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

---

## shadcn/ui Components

### Installation Commands
```bash
# Core components
npx shadcn add button
npx shadcn add card
npx shadcn add input
npx shadcn add label
npx shadcn add select
npx shadcn add dialog
npx shadcn add table
npx shadcn add badge
npx shadcn add tabs
npx shadcn add dropdown-menu
npx shadcn add avatar
npx shadcn add calendar
npx shadcn add popover
npx shadcn add toast
npx shadcn add skeleton
npx shadcn add separator
npx shadcn add scroll-area
npx shadcn add sheet
npx shadcn add command
npx shadcn add checkbox
npx shadcn add radio-group
npx shadcn add textarea
npx shadcn add switch
```

### Common Component Patterns

#### Card with Header
```tsx
<Card>
  <CardHeader>
    <CardTitle>Property Details</CardTitle>
    <CardDescription>Manage your property information</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

#### Data Table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Tenant</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Balance</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {tenants.map((tenant) => (
      <TableRow key={tenant.id}>
        <TableCell>{tenant.full_name}</TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(tenant.status)}>
            {tenant.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          {formatCurrency(tenant.balance)}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Form with Validation
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="tenant@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

#### Dialog for Actions
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Record Payment</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Record Payment</DialogTitle>
      <DialogDescription>
        Enter payment details below
      </DialogDescription>
    </DialogHeader>
    {/* Form */}
    <DialogFooter>
      <Button type="submit">Save Payment</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Utility Functions

### Currency Formatting
```typescript
// lib/utils.ts
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'GBP'
): string {
  if (amount == null) return '-'
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount)
}

// Usage: formatCurrency(1250.50) // £1,250.50
```

### Date Formatting
```typescript
// lib/utils.ts
export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return '-'
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  })
}

// Usage: formatDate('2024-01-15') // 15 Jan 2024
```

### Date Range Format
```typescript
export function formatDateRange(
  start: string | Date,
  end: string | Date
): string {
  return `${formatDate(start)} - ${formatDate(end)}`
}
```

### Status Color Helpers
```typescript
// lib/status.ts
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-600',
    overdue: 'bg-red-100 text-red-700',
    partial: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-blue-100 text-blue-700',
    vacating: 'bg-orange-100 text-orange-700',
    archived: 'bg-slate-100 text-slate-500'
  }
  return colors[status] || 'bg-slate-100 text-slate-600'
}
```

### Calculate Days Overdue
```typescript
export function getDaysOverdue(dueDate: string | Date): number {
  const due = new Date(dueDate)
  const today = new Date()
  const diff = today.getTime() - due.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}
```

---

## Common Type Definitions

```typescript
// types/index.ts
export interface Property {
  id: string
  name: string
  address_line1: string
  address_line2?: string
  city: string
  postcode: string
  country: string
  property_type: 'ROOMING' | 'WHOLE_PROPERTY'
  total_rooms?: number
  is_archived: boolean
  created_at: string
}

export interface Tenant {
  id: string
  full_name: string
  email?: string
  phone?: string
  property_id: string
  room_id?: string
  lease_start_date: string
  lease_end_date?: string
  move_in_date?: string
  move_out_date?: string
  weekly_rent: number
  rent_due_day: number
  bond_required: number
  bond_paid: number
  bond_number?: string
  status: 'ACTIVE' | 'INACTIVE' | 'VACATING'
  payment_reference?: string
  created_at: string
}

export interface Payment {
  id: string
  tenant_id: string
  amount: number
  payment_date: string
  payment_method: 'BANK_TRANSFER' | 'CASH' | 'CARD' | 'OTHER'
  reference?: string
  notes?: string
  created_at: string
}

export interface PaymentAllocation {
  id: string
  payment_id: string
  tenant_id: string
  allocation_type: 'RENT' | 'BOND' | 'INVOICE' | 'CREDIT'
  amount: number
  invoice_id?: string
  notes?: string
  created_at: string
}

export type PaymentMethod = 'BANK_TRANSFER' | 'CASH' | 'CARD' | 'OTHER'
export type AllocationType = 'RENT' | 'BOND' | 'INVOICE' | 'CREDIT'
export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'VACATING'
export type PropertyType = 'ROOMING' | 'WHOLE_PROPERTY'
```

---

## Form Validation (Zod)

```typescript
// lib/validations.ts
import { z } from 'zod'

export const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().default('United Kingdom'),
  property_type: z.enum(['ROOMING', 'WHOLE_PROPERTY']),
  total_rooms: z.number().optional()
})

export const tenantSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  property_id: z.string().uuid('Property is required'),
  room_id: z.string().uuid().optional(),
  lease_start_date: z.string().min(1, 'Lease start date is required'),
  lease_end_date: z.string().optional(),
  move_in_date: z.string().optional(),
  weekly_rent: z.number().min(0, 'Rent must be positive'),
  rent_due_day: z.number().min(1).max(31),
  bond_required: z.number().min(0).default(0),
  bond_number: z.string().optional(),
  payment_reference: z.string().optional()
})

export const paymentSchema = z.object({
  tenant_id: z.string().uuid(),
  amount: z.number().positive('Amount must be positive'),
  payment_date: z.string().min(1, 'Payment date is required'),
  payment_method: z.enum(['BANK_TRANSFER', 'CASH', 'CARD', 'OTHER']),
  reference: z.string().optional(),
  notes: z.string().optional()
})

export const allocationSchema = z.object({
  payment_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  allocation_type: z.enum(['RENT', 'BOND', 'INVOICE', 'CREDIT']),
  amount: z.number().positive(),
  invoice_id: z.string().uuid().optional(),
  notes: z.string().optional()
})

export type PropertyInput = z.infer<typeof propertySchema>
export type TenantInput = z.infer<typeof tenantSchema>
export type PaymentInput = z.infer<typeof paymentSchema>
export type AllocationInput = z.infer<typeof allocationSchema>
```

---

## Project Structure

```
my-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── properties/
│   │   │   ├── page.tsx             # Properties list
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Add property
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Property detail
│   │   ├── tenants/
│   │   │   ├── page.tsx             # Tenants list
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Add tenant
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Tenant detail
│   │   │       └── ledger/
│   │   │           └── page.tsx     # Tenant ledger
│   │   ├── payments/
│   │   │   ├── page.tsx             # Payments list
│   │   │   └── new/
│   │   │       └── page.tsx         # Record payment
│   │   └── settings/
│   │       └── page.tsx             # Settings
│   ├── api/
│   │   └── ...                      # API routes (if needed)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn components
│   ├── properties/
│   ├── tenants/
│   ├── payments/
│   └── layout/
│       ├── sidebar.tsx
│       └── header.tsx
├── hooks/
│   ├── use-properties.ts
│   ├── use-tenants.ts
│   ├── use-payments.ts
│   └── use-ledger.ts
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── validations.ts
├── types/
│   └── index.ts
└── public/
```

---

## Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npx tsc --noEmit

# Add shadcn component
npx shadcn add [component-name]

# Install dependency
npm install [package-name]
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Database Quick Queries

### Get Tenant with Balance
```sql
SELECT 
  t.*,
  COALESCE(SUM(al.amount) FILTER (WHERE al.allocation_type = 'RENT'), 0) as total_rent_paid,
  COALESCE(SUM(al.amount) FILTER (WHERE al.allocation_type = 'BOND'), 0) as total_bond_paid
FROM tenants t
LEFT JOIN payment_allocations al ON t.id = al.tenant_id
WHERE t.id = 'tenant-uuid'
GROUP BY t.id;
```

### Get Overdue Tenants
```sql
SELECT * FROM tenants
WHERE status = 'ACTIVE'
AND paid_until_date < CURRENT_DATE;
```

### Get Bond Summary
```sql
SELECT 
  SUM(bond_required) as total_required,
  SUM(bond_paid) as total_paid,
  SUM(bond_required - bond_paid) as total_remaining
FROM tenants
WHERE status = 'ACTIVE';
```

---

*Last Updated: April 2025*
