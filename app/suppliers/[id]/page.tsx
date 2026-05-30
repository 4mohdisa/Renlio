'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorBoundary } from '@/components/shared'
import { mockSuppliers, mockContacts, mockFolios } from '@/lib/mock-data'


const CATEGORY_LABELS: Record<string, string> = {
  PLUMBER: 'Plumber', COUNCIL: 'Council', CLEANER: 'Cleaner',
  GARDENING: 'Gardening', ROOFER: 'Roofer', BUILDER: 'Builder', ELECTRICIAN: 'Electrician',
}

interface ContactPerson {
  id: string
  first_name: string
  last_name: string
  company_name?: string | null
  mobile_phone?: string | null
  email?: string | null
  address?: string | null
  is_primary: boolean
}

interface ContactPeopleListProps {
  people: ContactPerson[]
}

function ContactPeopleList({ people }: ContactPeopleListProps) {
  const [activePersonIndex, setActivePersonIndex] = useState(0)
  const person = people[activePersonIndex]
  
  if (!person) return null
  
  return (
    <div className="space-y-3">
      {people.length > 1 && (
        <div className="flex gap-2 mb-3">
          {people.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePersonIndex(idx)}
              className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                activePersonIndex === idx
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Person {idx + 1}
            </button>
          ))}
        </div>
      )}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900">
            {person.first_name} {person.last_name}
          </span>
          {person.is_primary && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
              Primary
            </span>
          )}
        </div>
        {person.company_name && (
          <p className="text-sm text-slate-500">{person.company_name}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
          {person.mobile_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>{person.mobile_phone}</span>
            </div>
          )}
          {person.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>{person.email}</span>
            </div>
          )}
          {person.address && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span>{person.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supplier = mockSuppliers.find((s) => s.id === id)
  const supplierFolio = mockFolios.find((f) => f.folio_type === 'SUPPLIER' && f.reference_id === id)

  if (!supplier) {
    return (
      <EmptyState
        title="Supplier not found"
        description="This supplier does not exist"
        actionLabel="Back to Suppliers"
        actionHref="/suppliers"
      />
    )
  }

  const people = supplier.contact_group_id
    ? mockContacts.filter((c) => c.contact_group_id === supplier.contact_group_id)
    : mockContacts.filter((c) => c.type === 'SUPPLIER' && c.company_name === supplier.name)

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <Link href="/suppliers" className="text-sm text-slate-500 hover:text-slate-700">
            ← Suppliers
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-2xl font-bold text-slate-900">{supplier.name}</h1>
            {supplierFolio && (
              <Link href={`/suppliers/${id}/folio`}>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer">
                  {supplierFolio.folio_number}
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900">Contact</h2>
              {people.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-400">No contact assigned</p>
                </div>
              ) : (
                <ContactPeopleList people={people} />
              )}
            </div>

          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Supplier Details</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              {supplier.category && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Category</p>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">
                    {CATEGORY_LABELS[supplier.category] ?? supplier.category}
                  </span>
                </div>
              )}
              {(supplier as { abn?: string }).abn && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">ABN</p>
                  <p className="text-sm text-slate-700">{(supplier as { abn?: string }).abn}</p>
                </div>
              )}
              {(supplier as { website?: string }).website && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Website</p>
                  <a
                    href={(supplier as { website?: string }).website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {(supplier as { website?: string }).website}
                  </a>
                </div>
              )}
            </div>

            <h2 className="text-base font-semibold text-slate-900">Actions</h2>
            <Link href={`/suppliers/${id}/folio`} className="block">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Folio
              </Button>
            </Link>
            <Link href={`/suppliers/${id}/edit`} className="block">
              <Button variant="outline" className="w-full justify-start">Edit Supplier</Button>
            </Link>
          </div>
        </div>

      </div>
    </ErrorBoundary>
  )
}
