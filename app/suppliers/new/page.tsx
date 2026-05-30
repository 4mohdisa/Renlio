'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ContactForm } from '@/components/shared/ContactForm'
import { toastSuccess, toastError } from '@/lib/toast'
import { isRoleCompatible, getRoleConflictMessage } from '@/lib/contact-rules'
import { mockContacts } from '@/lib/mock-data'
import type { ContactFormValue } from '@/types'

function defaultContact(): ContactFormValue {
  return {
    people: [
      {
        id: crypto.randomUUID(),
        first_name: '',
        last_name: '',
        company_name: '',
        mobile_phone: '',
        email: '',
        address: '',
        is_primary: true,
      },
    ],
  }
}

export default function NewSupplierPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [contact, setContact] = useState<ContactFormValue>(defaultContact())
  const [showContactError, setShowContactError] = useState(false)
  const [category, setCategory] = useState('')
  const [abn, setAbn] = useState('')
  const [website, setWebsite] = useState('')

  const primary = contact.people[0]
  const step1Complete =
    primary.first_name.trim() !== '' && primary.last_name.trim() !== ''

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
    toastSuccess('Supplier created')
    router.push('/suppliers')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/suppliers" className="text-sm text-slate-500 hover:text-slate-700">
          ← Suppliers
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">New Supplier</h1>
      </div>

      {/* Step indicator */}
      <div className="flex border-b border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`px-4 pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            step === 1
              ? 'border-blue-600 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          1. Contact
        </button>
        <button
          type="button"
          onClick={() => step1Complete && setStep(2)}
          className={`px-4 pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            step === 2
              ? 'border-blue-600 text-slate-900'
              : step1Complete
              ? 'border-transparent text-slate-400 hover:text-slate-600'
              : 'border-transparent text-slate-300 cursor-not-allowed'
          }`}
        >
          2. Supplier Details
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <ContactForm
            mode="select"
            value={contact}
            onChange={handleContactChange}
            contactType="SUPPLIER"
          />
          {showContactError && (
            <p className="text-sm text-red-500">A contact is required. Please fill in at least the first and last name.</p>
          )}
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
            >
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
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={handleSave}>
              Save Supplier
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
