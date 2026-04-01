# Renlio UI Specifications
## Modern, Clean Design (Ailo-Inspired)

---

## Design Philosophy

Renlio follows a **clean, modern, minimal** design philosophy inspired by Ailo:
- **Whitespace** - Generous spacing for readability
- **Soft colors** - Muted palette, not harsh
- **Rounded corners** - Friendly, approachable
- **Subtle shadows** - Depth without heaviness
- **Clear hierarchy** - Easy visual scanning

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#0F172A` | Headers, primary buttons, text |
| **Primary Light** | `#1E293B` | Hover states |
| **Accent** | `#3B82F6` | Links, active states, highlights |
| **Accent Light** | `#60A5FA` | Hover on accent |

### Background Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Background** | `#FFFFFF` | Main background |
| **Background Secondary** | `#F8FAFC` | Cards, sections |
| **Background Tertiary** | `#F1F5F9` | Hover, subtle sections |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Text Primary** | `#0F172A` | Headings, important text |
| **Text Secondary** | `#475569` | Body text, labels |
| **Text Tertiary** | `#94A3B8` | Placeholders, hints |
| **Text Inverse** | `#FFFFFF` | Text on dark backgrounds |

### Status Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#10B981` | Paid, active, positive |
| **Success Light** | `#D1FAE5` | Success backgrounds |
| **Warning** | `#F59E0B` | Pending, due soon |
| **Warning Light** | `#FEF3C7` | Warning backgrounds |
| **Error** | `#EF4444` | Overdue, arrears, errors |
| **Error Light** | `#FEE2E2` | Error backgrounds |
| **Info** | `#3B82F6` | Information, links |
| **Info Light** | `#DBEAFE` | Info backgrounds |

### Border Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Border** | `#E2E8F0` | Default borders |
| **Border Light** | `#F1F5F9` | Subtle dividers |

---

## Typography

### Font Family

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1** | 2rem (32px) | 700 | 1.2 | Page titles |
| **H2** | 1.5rem (24px) | 600 | 1.3 | Section headers |
| **H3** | 1.25rem (20px) | 600 | 1.4 | Card titles |
| **H4** | 1.125rem (18px) | 500 | 1.4 | Subsection |
| **Body** | 1rem (16px) | 400 | 1.5 | Body text |
| **Body Small** | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| **Caption** | 0.75rem (12px) | 400 | 1.5 | Labels, hints |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| **space-1** | 0.25rem (4px) | Tight spacing |
| **space-2** | 0.5rem (8px) | Icon gaps |
| **space-3** | 0.75rem (12px) | Small gaps |
| **space-4** | 1rem (16px) | Default padding |
| **space-5** | 1.25rem (20px) | Card padding |
| **space-6** | 1.5rem (24px) | Section gaps |
| **space-8** | 2rem (32px) | Large sections |
| **space-10** | 2.5rem (40px) | Page sections |
| **space-12** | 3rem (48px) | Major sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **rounded-sm** | 0.25rem (4px) | Small elements |
| **rounded** | 0.5rem (8px) | Buttons, inputs |
| **rounded-lg** | 0.75rem (12px) | Cards |
| **rounded-xl** | 1rem (16px) | Large cards |
| **rounded-full** | 9999px | Pills, avatars |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| **shadow-sm** | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Subtle |
| **shadow** | `0 1px 3px 0 rgb(0 0 0 / 0.1)` | Cards |
| **shadow-md** | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | Elevated |
| **shadow-lg** | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | Modals |

---

## Component Styles

### Buttons

```
┌─────────────────────────────────────────┐
│ PRIMARY BUTTON                          │
├─────────────────────────────────────────┤
│                                         │
│  Background: #0F172A                   │
│  Text: #FFFFFF                          │
│  Padding: 0.5rem 1rem                  │
│  Border Radius: 0.5rem                 │
│  Font Weight: 500                       │
│                                         │
│  Hover: Background #1E293B             │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SECONDARY BUTTON                        │
├─────────────────────────────────────────┤
│                                         │
│  Background: #FFFFFF                   │
│  Border: 1px solid #E2E8F0             │
│  Text: #0F172A                         │
│                                         │
│  Hover: Background #F8FAFC             │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ GHOST BUTTON                            │
├─────────────────────────────────────────┤
│                                         │
│  Background: transparent               │
│  Text: #475569                         │
│                                         │
│  Hover: Background #F1F5F9             │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ DESTRUCTIVE BUTTON                      │
├─────────────────────────────────────────┤
│                                         │
│  Background: #EF4444                   │
│  Text: #FFFFFF                          │
│                                         │
│  Hover: Background #DC2626             │
│                                         │
└─────────────────────────────────────────┘
```

### Cards

```
┌─────────────────────────────────────────┐
│ CARD                                    │
├─────────────────────────────────────────┤
│                                         │
│  Background: #FFFFFF                   │
│  Border: 1px solid #E2E8F0             │
│  Border Radius: 0.75rem                │
│  Padding: 1.5rem                       │
│  Shadow: 0 1px 3px rgba(0,0,0,0.1)     │
│                                         │
│  Hover: Shadow increases               │
│                                         │
└─────────────────────────────────────────┘
```

### Inputs

```
┌─────────────────────────────────────────┐
│ INPUT FIELD                             │
├─────────────────────────────────────────┤
│                                         │
│  Background: #FFFFFF                   │
│  Border: 1px solid #E2E8F0             │
│  Border Radius: 0.5rem                 │
│  Padding: 0.5rem 0.75rem               │
│  Font Size: 0.875rem                   │
│                                         │
│  Focus: Border #3B82F6                 │
│  Focus: Ring 2px #DBEAFE               │
│                                         │
│  Placeholder: #94A3B8                  │
│                                         │
└─────────────────────────────────────────┘
```

### Badges

```
┌─────────────────────────────────────────┐
│ BADGES                                  │
├─────────────────────────────────────────┤
│                                         │
│  Default:                               │
│    Background: #F1F5F9                 │
│    Text: #475569                       │
│                                         │
│  Success (Paid):                        │
│    Background: #D1FAE5                 │
│    Text: #059669                       │
│                                         │
│  Warning (Due):                         │
│    Background: #FEF3C7                 │
│    Text: #B45309                       │
│                                         │
│  Error (Overdue):                       │
│    Background: #FEE2E2                 │
│    Text: #DC2626                       │
│                                         │
│  Border Radius: 9999px (pill)          │
│  Padding: 0.25rem 0.75rem              │
│  Font Size: 0.75rem                    │
│  Font Weight: 500                      │
│                                         │
└─────────────────────────────────────────┘
```

---

## Page Layouts

### Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  RENLIO                                          [User Menu ▼]  │
├──────────────────┬──────────────────────────────────────────────┤
│                  │                                              │
│  Dashboard       │  DASHBOARD                                   │
│  Properties      │                                              │
│  Tenancies       │  ┌─────────────┐ ┌─────────────┐            │
│  Invoices        │  │ Properties  │ │ Occupancy   │            │
│  Payments        │  │     12      │ │    85%      │            │
│  Settings        │  └─────────────┘ └─────────────┘            │
│                  │                                              │
│                  │  ┌─────────────┐ ┌─────────────┐            │
│                  │  │ Total Rent  │ │ Arrears     │            │
│                  │  │  £8,400     │ │   £450      │            │
│                  │  └─────────────┘ └─────────────┘            │
│                  │                                              │
│                  │  RECENT ACTIVITY                             │
│                  │  ┌─────────────────────────────────────────┐ │
│                  │  │ • Rent received: £800 - Room 3         │ │
│                  │  │ • Invoice issued: £150 - Cleaning      │ │
│                  │  │ • Bond paid: £1,000 - Smith Family     │ │
│                  │  └─────────────────────────────────────────┘ │
│                  │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

### Properties List

```
┌─────────────────────────────────────────────────────────────────┐
│  PROPERTIES                                    [+ Add Property] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  123 Main Street                              [ROOMING]    ││
│  │  London, SW1A 1AA                                          ││
│  │                                                             ││
│  │  Rooms: 5    Occupied: 4    Arrears: £0                   ││
│  │                                                             ││
│  │  [View Details]  [Edit]                                    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  45 High Road                          [WHOLE PROPERTY]    ││
│  │  Manchester, M1 1AA                                        ││
│  │                                                             ││
│  │  Tenant: Smith Family    Rent: £1,800    Arrears: £0      ││
│  │                                                             ││
│  │  [View Details]  [Edit]                                    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Property Detail (ROOMING Mode)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Properties                                           │
│  123 Main Street                                    [ROOMING]   │
│  London, SW1A 1AA                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Rooms] [Financial Overview] [Bills]                          │
│                                                                  │
│  ROOMS                                                           │
│  ┌──────────┬──────────┬─────────────┬──────────┬──────────┐   │
│  │ Room     │ Status   │ Tenant      │ Rent     │ Arrears  │   │
│  ├──────────┼──────────┼─────────────┼──────────┼──────────┤   │
│  │ Room 1   │ Occupied │ John Smith  │ £650     │ ● £0     │   │
│  │ Room 2   │ Occupied │ Jane Doe    │ £700     │ ○ £200   │   │
│  │ Room 3   │ Vacant   │ —           │ —        │ —        │   │
│  │ Room 4   │ Occupied │ Mike Brown  │ £600     │ ● £0     │   │
│  └──────────┴──────────┴─────────────┴──────────┴──────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tenant Ledger

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Tenancies                                            │
│  John Smith - Room 1, 123 Main Street                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FINANCIAL SUMMARY                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Paid To Date │ │ Rent Arrears │ │ Bond Status  │            │
│  │ 15 Mar 2024  │ │     £0       │ │  FULLY PAID  │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
│  Rent: £650/month  |  Daily Rate: £21.37  |  Bond: £1,000      │
│                                                                  │
│  [Record Payment]  [View Receipts]  [Edit Tenancy]             │
│                                                                  │
│  TRANSACTION HISTORY                                             │
│  ┌──────────┬────────────────┬──────────┬──────────┐           │
│  │ Date     │ Description    │ Amount   │ Balance  │           │
│  ├──────────┼────────────────┼──────────┼──────────┤           │
│  │ 01/03/24 │ Rent - Mar 24  │  £650    │  £650 DR │           │
│  │ 01/03/24 │ Payment        │ -£650    │  £0      │           │
│  │ 01/02/24 │ Rent - Feb 24  │  £650    │  £650 DR │           │
│  │ 01/02/24 │ Payment        │ -£650    │  £0      │           │
│  └──────────┴────────────────┴──────────┴──────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Record Payment Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  Record Payment                                    [×]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Amount *                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ £                                                       │   │
│  │ 800.00                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Payment Date *              Payment Method *                   │
│  ┌─────────────────┐        ┌─────────────────┐                │
│  │ 📅 01/04/2024   │        │ Bank Transfer ▼ │                │
│  └─────────────────┘        └─────────────────┘                │
│                                                                  │
│  Bank Reference                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ SMITH-001                                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ═══════════════════════════════════════════════════════════    │
│                                                                  │
│  ALLOCATE THIS PAYMENT:                                         │
│                                                                  │
│  (●) Pay towards RENT                                           │
│      Invoice: Rent - April 2024 (£800.00)                       │
│                                                                  │
│  ( ) Pay towards BOND                                           │
│      Bond remaining: £0.00 (fully paid)                         │
│                                                                  │
│  ( ) Hold as CREDIT on account                                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Summary:                                                │   │
│  │   Payment: £800.00                                      │   │
│  │   Allocated: £800.00 to Rent                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Cancel]                              [Record Payment]        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Usage Examples

### Example 1: Creating a New Property (ROOMING Mode)

**User Flow:**
1. Navigate to Properties → Click "Add Property"
2. Fill in property details:
   - Name: "123 Main Street"
   - Address: "123 Main Street, London, SW1A 1AA"
   - Management Mode: "ROOMING"
3. Save property
4. Add rooms:
   - Room 1: Bedroom, £650/month
   - Room 2: Bedroom, £700/month
   - Room 3: Studio, £750/month

**System Actions:**
```javascript
// Create property
const property = await createProperty({
  name: '123 Main Street',
  address_line_1: '123 Main Street',
  city: 'London',
  postal_code: 'SW1A 1AA',
  management_mode: 'ROOMING'
})

// Create rooms
await createRoom({ property_id: property.id, room_label: 'Room 1', room_type: 'BEDROOM' })
await createRoom({ property_id: property.id, room_label: 'Room 2', room_type: 'BEDROOM' })
await createRoom({ property_id: property.id, room_label: 'Room 3', room_type: 'STUDIO' })
```

---

### Example 2: Starting a New Tenancy

**User Flow:**
1. Navigate to Room 1 → Click "Start Tenancy"
2. Create or select tenant:
   - First Name: "John"
   - Last Name: "Smith"
   - Email: "john@example.com"
   - Payment Reference: "SMITH-001"
3. Enter tenancy details:
   - Lease Start: 01/01/2024
   - Lease End: 31/12/2024
   - Move In: 01/01/2024
   - Rent: £650/month
   - Bond Required: £1,000
4. Generate first invoice (pro-rata if needed)

**System Actions:**
```javascript
// Create tenant
const tenant = await createTenant({
  first_name: 'John',
  last_name: 'Smith',
  email: 'john@example.com',
  payment_reference: 'SMITH-001'
})

// Create tenancy
const tenancy = await createTenancy({
  property_id: property.id,
  room_id: room.id,
  tenant_id: tenant.id,
  lease_start_date: '2024-01-01',
  lease_end_date: '2024-12-31',
  move_in_date: '2024-01-01',
  rent_amount: 650,
  rent_frequency: 'MONTHLY',
  bond_required: 1000
})

// Generate first invoice
await generateInvoice({
  tenancy_id: tenancy.id,
  category: 'RENT',
  amount: 650,
  period_start: '2024-01-01',
  period_end: '2024-01-31'
})
```

---

### Example 3: Recording Rent Payment

**User Flow:**
1. Navigate to Tenant Ledger → Click "Record Payment"
2. Enter payment details:
   - Amount: £650
   - Date: 01/01/2024
   - Method: Bank Transfer
   - Reference: "SMITH-001"
3. Allocate to rent invoice
4. Save and generate receipt

**System Actions:**
```javascript
// Create transaction
const transaction = await createTransaction({
  tenancy_id: tenancy.id,
  amount: 650,
  method: 'BANK_TRANSFER',
  transaction_date: '2024-01-01',
  bank_reference: 'SMITH-001'
})

// Create allocation
await createAllocation({
  transaction_id: transaction.id,
  invoice_id: invoice.id,
  allocation_target: 'RENT',
  allocated_amount: 650,
  covers_period_start: '2024-01-01',
  covers_period_end: '2024-01-31'
})

// Update invoice
await updateInvoice(invoice.id, {
  amount_paid: 650,
  remaining_balance: 0,
  status: 'PAID'
})

// Update tenancy paid-to-date
await updateTenancy(tenancy.id, {
  paid_to_date: '2024-01-31',
  rent_arrears: 0
})

// Generate receipt
await generateReceipt(transaction.id)
```

---

### Example 4: Recording Bond Payment

**User Flow:**
1. Navigate to Tenant → Bond section → Click "Record Bond Payment"
2. Enter payment:
   - Amount: £1,000
   - Date: 01/01/2024
   - Method: Bank Transfer
   - Bond Number: "DPS-123456789"
3. Save

**System Actions:**
```javascript
// Create transaction
const transaction = await createTransaction({
  tenancy_id: tenancy.id,
  amount: 1000,
  method: 'BANK_TRANSFER',
  transaction_date: '2024-01-01'
})

// Create bond allocation
await createBondAllocation({
  tenancy_id: tenancy.id,
  transaction_id: transaction.id,
  amount: 1000,
  allocation_type: 'PAYMENT'
})

// Update tenancy bond
await updateTenancy(tenancy.id, {
  bond_paid: 1000,
  bond_remaining: 0,
  bond_status: 'FULLY_PAID',
  bond_number: 'DPS-123456789',
  bond_received_date: '2024-01-01'
})
```

---

### Example 5: Ending Tenancy and Returning Bond

**User Flow:**
1. Navigate to Tenancy → Click "End Tenancy"
2. Enter move-out date: 31/12/2024
3. Inspect property - £200 deduction for damages
4. Return £800 bond to tenant
5. Generate bond return receipt

**System Actions:**
```javascript
// Update tenancy
await updateTenancy(tenancy.id, {
  move_out_date: '2024-12-31',
  status: 'EXPIRED'
})

// Create damage invoice
const damageInvoice = await createInvoice({
  tenancy_id: tenancy.id,
  category: 'DAMAGES',
  amount: 200,
  description: 'Broken window repair'
})

// Create bond deduction allocation
await createBondAllocation({
  tenancy_id: tenancy.id,
  amount: 200,
  allocation_type: 'DEDUCTION',
  related_invoice_id: damageInvoice.id,
  reason: 'Broken window repair'
})

// Create bond return allocation
await createBondAllocation({
  tenancy_id: tenancy.id,
  amount: 800,
  allocation_type: 'RETURN',
  returned_amount: 800,
  reason: 'Balance after deductions'
})

// Update tenancy bond status
await updateTenancy(tenancy.id, {
  bond_status: 'PARTIALLY_RETURNED',
  bond_returned_date: '2024-12-31',
  bond_returned_amount: 800,
  bond_deductions: 200,
  bond_deduction_reason: 'Broken window repair'
})
```

---

### Example 6: Checking Arrears

**User Flow:**
1. Navigate to Dashboard
2. View "Arrears" widget showing total arrears
3. Click to see list of tenants in arrears
4. Click tenant to view their ledger

**System Calculation:**
```javascript
// Calculate rent arrears
const rentDue = dailyRate * daysSinceMoveIn
const rentPaid = sumOfPaymentsAllocatedToRent
const rentArrears = rentDue - rentPaid

// Calculate paid-to-date
const paidToDate = moveInDate + (rentPaid / dailyRate)

// Example:
// Move in: 1 Jan 2024
// Daily rate: £21.37 (from £650/month)
// Today: 15 Mar 2024 (74 days)
// Rent due: £21.37 * 74 = £1,581.38
// Rent paid: £1,300 (2 months)
// Arrears: £281.38
// Paid to date: 1 Jan + 60 days = 1 Mar 2024
```

---

## Tailwind Config

```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 222 47% 11%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 222 47% 11%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

*UI Specifications Version: 1.0*
*Design: Clean, Modern, Ailo-Inspired*
