'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ContactForm } from '@/components/shared/ContactForm'
import { EmptyState } from '@/components/shared/EmptyState'
import { toastSuccess, toastError } from '@/lib/toast'
import { isRoleCompatible, getRoleConflictMessage } from '@/lib/contact-rules'
import { mockSuppliers, mockContacts } from '@/lib/mock-data'
import type { ContactFormValue } from '@/types'

export default function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const supplier = mockSuppliers.find((s) => s.id === id)

  const existingPeople = mockContacts.filter(
    (c) => c.type === 'SUPPLIER' && c.company_name === supplier?.name
  )
  const fallbackPeople = existingPeople.length > 0
    ? existingPeople
    : mockContacts.filter((c) => c.type === 'SUPPLIER').slice(0, 1)

  const [step, setStep] = useState<1 | 2>(1)
  const [showContactError, setShowContactError] = useState(false)
  const [contact, setContact] = useState<ContactFormValue>({
    people: fallbackPeople.map((p) => ({
      id: p.id,
      first_name: p.first_name,
      last_name: p.last_name,
      company_name: p.company_name ?? '',
      mobile_phone: p.mobile_phone ?? '',
      email: p.email ?? '',
      address: p.address ?? '',
      is_primary: p.is_primary,
    })),
  })
  const [category, setCategory] = useState(supplier?.category ?? '')
  const [abn, setAbn] = useState('')
  const [website, setWebsite] = useState('')

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

  const primary = contact.people[0]
  const step1Complete = primary.first_name.trim() !== '' && primary.last_name.trim() !== ''

  function handleNext() {
    if (step1Complete) {
      // Check for role conflict if a contact was selected
      const selectedContactId = primary.id
      const selectedContact = mockContacts.find((c) => c.id === selectedContactId)
      if (selectedContact && !isRoleCompatible(selectedContact.type, 'SUPPLIER')) {
        toastError(getRoleConflictMessage(selectedContact.type, 'SUPPLIER'))
        return
      }
      setStep(2)
      setShowContactError(false)
    } else {
      setShowContactError(true)
    }
  }

  function handleContactChange(value: ContactFormValue) {
    setContact(value)
    if (showContactError) {
      const p = value.people[0]
      if (p.first_name.trim() !== '' && p.last_name.trim() !== '') {
        setShowContactError(false)
      }
    }
  }

  function handleSave() {
    toastSuccess('Supplier updated')
    router.push(`/suppliers/${id}`)
  }

  const steps: { label: string; num: 1 | 2 }[] = [
    { label: '1. Contact', num: 1 },
    { label: '2. Supplier Details', num: 2 },
  ]

  function canGoToStep(num: 1 | 2) {
    if (num === 1) return true
    return step1Complete
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/suppliers/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← {supplier.name}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Edit Supplier</h1>
      </div>

      <div className="flex border-b border-slate-200 overflow-hidden">
        {steps.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => canGoToStep(s.num) && setStep(s.num)}
            className={`px-4 pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              step === s.num
                ? 'border-blue-600 text-slate-900'
                : canGoToStep(s.num)
                ? 'border-transparent text-slate-400 hover:text-slate-600'
                : 'border-transparent text-slate-300 cursor-not-allowed'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <ContactForm
            mode="create"
            value={contact}
            onChange={handleContactChange}
            contactType="SUPPLIER"
          />
          {showContactError && (
            <p className="text-sm text-red-500">A contact is required. Please fill in at least the first and last name.</p>
          )}
          <div className="flex justify-end">
            <Button onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLUMBER">Plumber</SelectItem>
                <SelectItem value="COUNCIL">Council</SelectItem>
                <SelectItem value="CLEANER">Cleaner</SelectItem>
                <SelectItem value="GARDENING">Gardening</SelectItem>
                <SelectItem value="ROOFER">Roofer</SelectItem>
                <SelectItem value="BUILDER">Builder</SelectItem>
                <SelectItem value="ELECTRICIAN">Electrician</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>ABN <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              value={abn}
              onChange={(e) => setAbn(e.target.value)}
              placeholder="12 345 678 901"
            />
          </div>

          <div className="space-y-2">
            <Label>Website <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com.au"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handleSave}>Save Supplier</Button>
          </div>
        </div>
      )}
    </div>
  )
}
