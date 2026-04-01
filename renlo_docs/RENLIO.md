# Renlio
## Modern Property Management System

---

## Overview

Renlio is a modern, clean property management system for UK property managers handling both room-level (HMO) and whole-property rentals. Built with a focus on simplicity, speed, and beautiful design inspired by Ailo.

---

## Features

### Core Management
- **Property Management** - Add, edit, track properties
- **Dual Mode Support** - ROOMING (HMO) or WHOLE_PROPERTY per property
- **Room Management** - For HMO/student housing
- **Tenant Management** - Complete tenant profiles with payment references
- **Tenancy Lifecycle** - Move-in to move-out tracking

### Financial Management
- **Invoice Generation** - Automatic from rent schedules
- **Payment Recording** - Multiple methods with allocation
- **Tenant Ledger/Folio** - Complete transaction history
- **Paid-To-Date Tracking** - Date rent paid up to
- **Arrears Tracking** - Separate rent and invoice arrears
- **Daily Rate Display** - Pro-rata transparency
- **Receipt Generation** - PDF receipts with allocations
- **Statement Generation** - Monthly/annual statements

### Bond/Deposit Tracking
- **Bond Required** - Amount that should be paid
- **Bond Paid** - Amount actually received
- **Bond Remaining** - Still owed (calculated)
- **Bond Number** - DPS/TDS/MyDeposits reference
- **Bond Allocations** - Track payments, returns, deductions
- **Bond History** - Complete audit trail

### Payment Allocation
- **RENT** - Regular rent payments
- **BOND** - Security deposit payments
- **INVOICE** - Specific bill/charge payments
- **CREDIT** - Overpayment held on account

### Property-Level Features
- **Property Dashboard** - Occupancy, arrears, pending bills
- **Accounts Payable** - Track property expenses
- **Owner Statements** - Rent collected minus expenses
- **Financial Reporting** - Income, expense reports

---

## Architecture

### Dual Mode Architecture (Unified)

```
┌─────────────────────────────────────────────────────────────────┐
│                         RENLIO                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  MODE: ROOMING (HMO/Student Housing)                        ││
│  │                                                             ││
│  │  Property → Rooms → Tenancies → Ledger                     ││
│  │                                                             ││
│  │  • Multiple rooms per property                              ││
│  │  • One active tenancy per room                              ││
│  │  • Individual rent per room                                 ││
│  │  • Room status: Vacant/Occupied                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  MODE: WHOLE_PROPERTY (Family/Corporate)                    ││
│  │                                                             ││
│  │  Property → Tenancy → Ledger                               ││
│  │                                                             ││
│  │  • Single tenancy per property                              ││
│  │  • No room management                                       ││
│  │  • One rent for entire property                             ││
│  │  • Track additional occupants                               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  SHARED COMPONENTS (Both Modes)                             ││
│  │                                                             ││
│  │  • Invoice/Payment system                                   ││
│  │  • Tenant ledger with paid-to-date                          ││
│  │  • Bond tracking                                            ││
│  │  • Arrears calculation                                      ││
│  │  • Receipt/statement generation                             ││
│  │  • Financial reporting                                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Model

```
Organization (Multi-tenancy ready)
├── Properties
│   ├── Rooms (optional, for ROOMING mode)
│   └── Tenancies
│       ├── Tenants
│       ├── Invoices
│       ├── Transactions
│       └── Bond Allocations
├── Owners
├── Bills (Accounts Payable)
└── Audit Logs
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 15 (App Router) | Full-stack React |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **UI Components** | shadcn/ui | Accessible components |
| **State Management** | TanStack Query | Server state, caching |
| **Database** | Supabase PostgreSQL | Database + Auth |
| **Authentication** | Supabase Auth | Email/password |
| **Forms** | React Hook Form + Zod | Validation |
| **Dates** | date-fns | Date formatting |
| **Icons** | Lucide React | Icons |

---

## Database Schema (Supabase SQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ORGANIZATIONS (Multi-tenancy)
-- ============================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'UK',
    logo_url TEXT,
    plan TEXT DEFAULT 'personal',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORGANIZATION MEMBERS
-- ============================================
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER')),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'REMOVED')),
    display_name TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

-- ============================================
-- OWNERS
-- ============================================
CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    bank_account_name TEXT,
    bank_account_number TEXT,
    bank_sort_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROPERTIES
-- ============================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES owners(id),
    name TEXT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'UK',
    management_mode TEXT NOT NULL DEFAULT 'ROOMING' CHECK (management_mode IN ('ROOMING', 'WHOLE_PROPERTY')),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE')),
    total_bedrooms INTEGER,
    total_rooms INTEGER DEFAULT 0,
    occupied_rooms INTEGER DEFAULT 0,
    total_monthly_rent DECIMAL(12,2) DEFAULT 0,
    total_arrears DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROOMS (For ROOMING mode)
-- ============================================
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_label TEXT NOT NULL,
    room_number TEXT,
    room_type TEXT DEFAULT 'BEDROOM' CHECK (room_type IN ('BEDROOM', 'STUDIO', 'SUITE', 'APARTMENT')),
    area DECIMAL(8,2),
    features JSONB,
    status TEXT DEFAULT 'VACANT' CHECK (status IN ('VACANT', 'OCCUPIED', 'UNDER_MAINTENANCE')),
    current_tenancy_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TENANTS
-- ============================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    mobile TEXT,
    emergency_name TEXT,
    emergency_phone TEXT,
    address_line_1 TEXT,
    city TEXT,
    postal_code TEXT,
    payment_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TENANCIES
-- ============================================
CREATE TABLE tenancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    additional_occupants JSONB,
    
    -- Lease dates (contractual)
    lease_start_date DATE NOT NULL,
    lease_end_date DATE,
    
    -- Move dates (physical)
    move_in_date DATE NOT NULL,
    move_out_date DATE,
    expected_move_out DATE,
    
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'TERMINATED', 'PENDING')),
    
    -- Rent
    rent_amount DECIMAL(10,2) NOT NULL,
    rent_frequency TEXT DEFAULT 'MONTHLY' CHECK (rent_frequency IN ('WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'QUARTERLY', 'YEARLY')),
    daily_rate DECIMAL(10,4),
    
    -- Bond
    bond_status TEXT DEFAULT 'REQUIRED' CHECK (bond_status IN ('NOT_REQUIRED', 'REQUIRED', 'PARTIALLY_PAID', 'FULLY_PAID', 'HELD', 'RETURNED', 'PARTIALLY_RETURNED')),
    bond_required DECIMAL(10,2),
    bond_paid DECIMAL(10,2) DEFAULT 0,
    bond_remaining DECIMAL(10,2) DEFAULT 0,
    bond_number TEXT,
    bond_scheme TEXT,
    bond_received_date DATE,
    bond_returned_date DATE,
    bond_returned_amount DECIMAL(10,2),
    bond_deductions DECIMAL(10,2),
    bond_deduction_reason TEXT,
    
    -- Calculated fields
    paid_to_date DATE,
    rent_arrears DECIMAL(12,2) DEFAULT 0,
    invoice_arrears DECIMAL(12,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVOICES
-- ============================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenancy_id UUID NOT NULL REFERENCES tenancies(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    period_start DATE,
    period_end DATE,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    remaining_balance DECIMAL(10,2) NOT NULL,
    category TEXT DEFAULT 'RENT' CHECK (category IN ('RENT', 'DEPOSIT', 'BOND', 'UTILITIES', 'MAINTENANCE', 'CLEANING', 'LATE_FEE', 'ADMIN_FEE', 'DAMAGES', 'OTHER')),
    description TEXT,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED')),
    overdue_since DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS (Payments)
-- ============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number TEXT UNIQUE NOT NULL,
    tenancy_id UUID REFERENCES tenancies(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    transaction_date DATE NOT NULL,
    type TEXT DEFAULT 'PAYMENT' CHECK (type IN ('PAYMENT', 'REFUND', 'ADJUSTMENT')),
    status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED')),
    amount DECIMAL(10,2) NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'DIRECT_DEBIT')),
    bank_reference TEXT,
    receipt_number TEXT,
    notes TEXT,
    total_allocated DECIMAL(10,2) DEFAULT 0,
    unallocated_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ALLOCATIONS
-- ============================================
CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    allocation_target TEXT NOT NULL CHECK (allocation_target IN ('RENT', 'BOND', 'INVOICE', 'CREDIT')),
    allocated_amount DECIMAL(10,2) NOT NULL,
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    covers_period_start DATE,
    covers_period_end DATE,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVERSED'))
);

-- ============================================
-- BOND ALLOCATIONS
-- ============================================
CREATE TABLE bond_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenancy_id UUID NOT NULL REFERENCES tenancies(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    allocation_type TEXT NOT NULL CHECK (allocation_type IN ('PAYMENT', 'RETURN', 'DEDUCTION', 'TRANSFER')),
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    returned_at DATE,
    returned_amount DECIMAL(10,2),
    reason TEXT,
    related_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'ACTIVE'
);

-- ============================================
-- BILLS (Accounts Payable)
-- ============================================
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
    bill_number TEXT UNIQUE NOT NULL,
    supplier_name TEXT,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    remaining_balance DECIMAL(10,2) NOT NULL,
    category TEXT DEFAULT 'MAINTENANCE' CHECK (category IN ('MAINTENANCE', 'UTILITIES', 'INSURANCE', 'TAX', 'MANAGEMENT_FEE', 'SUPPLIES', 'REPAIRS', 'CLEANING', 'OTHER')),
    description TEXT,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'PAID', 'OVERDUE')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    organization_id UUID REFERENCES organizations(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    field_name TEXT,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_properties_org ON properties(organization_id);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_rooms_property ON rooms(property_id);
CREATE INDEX idx_tenancies_property ON tenancies(property_id);
CREATE INDEX idx_tenancies_room ON tenancies(room_id);
CREATE INDEX idx_tenancies_tenant ON tenancies(tenant_id);
CREATE INDEX idx_invoices_tenancy ON invoices(tenancy_id);
CREATE INDEX idx_transactions_tenancy ON transactions(tenancy_id);
CREATE INDEX idx_allocations_transaction ON allocations(transaction_id);
CREATE INDEX idx_bond_allocations_tenancy ON bond_allocations(tenancy_id);
CREATE INDEX idx_bills_property ON bills(property_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can view their own orgs
CREATE POLICY "Users can view their organizations"
    ON organizations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = organizations.id
        AND organization_members.user_id = auth.uid()
        AND organization_members.status = 'ACTIVE'
    ));

-- Properties: Users can view properties in their org
CREATE POLICY "Users can view properties in their org"
    ON properties FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_members.organization_id = properties.organization_id
        AND organization_members.user_id = auth.uid()
        AND organization_members.status = 'ACTIVE'
    ));

-- Similar policies for other tables...
```

---

## Setup Commands

```bash
# 1. Create project
echo "renlio" | npx shadcn@latest init --yes --template next --base-color slate

cd renlio

# 2. Install dependencies
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install @supabase/supabase-js @supabase/ssr
npm install react-hook-form @hookform/resolvers zod date-fns

# 3. Add shadcn components
npx shadcn add button card input label badge dialog table tabs select textarea form dropdown-menu popover calendar

# 4. Environment variables
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EOF

# 5. Start development
npm run dev
```

---

## Project Structure

```
renlio/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── properties/
│   │   │   ├── page.tsx             # Property list
│   │   │   ├── new/page.tsx         # New property
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Property detail
│   │   │       └── edit/page.tsx    # Edit property
│   │   ├── tenancies/
│   │   │   ├── page.tsx             # Tenancy list
│   │   │   ├── new/page.tsx         # New tenancy
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Tenancy detail
│   │   │       └── ledger/page.tsx  # Tenant ledger
│   │   ├── invoices/
│   │   ├── payments/
│   │   └── settings/
│   ├── _hooks/
│   │   ├── use-properties.ts
│   │   ├── use-tenancies.ts
│   │   ├── use-invoices.ts
│   │   └── use-payments.ts
│   ├── _lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   └── utils.ts
│   ├── _providers/
│   │   └── query-provider.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/ui/          # shadcn components
├── public/
├── middleware.ts
├── next.config.js
└── package.json
```

---

## License

Private - For personal use
