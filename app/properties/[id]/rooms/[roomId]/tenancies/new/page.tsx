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
import { mockProperties, mockRooms, mockContacts } from '@/lib/mock-data'
import type { ContactFormValue } from '@/types'

function defaultContact(): ContactFormValue {
  return {
    people: [{
      id: crypto.randomUUID(),
      first_name: '', last_name: '', company_name: '',
      mobile_phone: '', email: '', address: '', is_primary: true,
    }],
  }
}

export default function NewRoomTenancyPage({ params }: { params: Promise<{ id: string; roomId: string }> }) {
  const { id, roomId } = use(params)
  const router = useRouter()
  const property = mockProperties.find((p) => p.id === id)
  const room = mockRooms.find((r) => r.id === roomId)

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [contact, setContact] = useState<ContactFormValue>(defaultContact())
  const [showContactError, setShowContactError] = useState(false)
  const [leaseStart, setLeaseStart] = useState('')
  const [leaseEnd, setLeaseEnd] = useState('')
  const [moveIn, setMoveIn] = useState('')
  const [moveOut, setMoveOut] = useState('')
  const [rentAmount, setRentAmount] = useState('')
  const [rentFrequency, setRentFrequency] = useState('MONTHLY')
  const [bondRequired, setBondRequired] = useState('')
  const [bondScheme, setBondScheme] = useState('')

  if (!property) {
    return <EmptyState title="Property not found" description="This property does not exist" actionLabel="Back to Properties" actionHref="/properties" />
  }
  if (!room) {
    return <EmptyState title="Room not found" description="This room does not exist" actionLabel="Back to Property" actionHref={`/properties/${id}`} />
  }

  const primary = contact.people[0]
  const step1Complete = primary.first_name.trim() !== '' && primary.last_name.trim() !== ''

  function handleNext() {
    if (step1Complete) {
      // Check for role conflict if a contact was selected
      const selectedContactId = primary.id
      const selectedContact = mockContacts.find((c) => c.id === selectedContactId)
      if (selectedContact && !isRoleCompatible(selectedContact.type, 'TENANT')) {
        toastError(getRoleConflictMessage(selectedContact.type, 'TENANT'))
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
  const step2Complete = leaseStart !== '' && moveIn !== ''
  const canCreate = rentAmount !== '' && Number(rentAmount) > 0

  function handleCreate() {
    toastSuccess('Tenancy created')
    router.push('/tenancies')
  }

  const steps: { label: string; num: 1 | 2 | 3 }[] = [
    { label: '1. Contact', num: 1 },
    { label: '2. Lease Details', num: 2 },
    { label: '3. Rent & Bond', num: 3 },
  ]

  function canGoToStep(num: 1 | 2 | 3) {
    if (num === 1) return true
    if (num === 2) return step1Complete
    if (num === 3) return step1Complete && step2Complete
    return false
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/properties/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← {property.name}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          New Tenancy — {property.name} — {room.room_label}
        </h1>
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
          <ContactForm mode="select" value={contact} onChange={handleContactChange} contactType="TENANT" />
          {showContactError && (
            <p className="text-sm text-red-500">A contact is required. Please fill in at least the first and last name.</p>
          )}
          <div className="flex justify-end">
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lease Start Date *</Label>
              <Input type="date" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Lease End Date <span className="text-slate-400 text-xs">(optional)</span></Label>
              <Input type="date" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} />
              <p className="text-xs text-slate-400">Leave blank for periodic tenancy</p>
            </div>
            <div className="space-y-2">
              <Label>Move In Date *</Label>
              <Input type="date" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Expected Move Out Date <span className="text-slate-400 text-xs">(optional)</span></Label>
              <Input type="date" value={moveOut} onChange={(e) => setMoveOut(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)} disabled={!step2Complete}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rent Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                <Input className="pl-7" type="number" min="0" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rent Frequency</Label>
              <Select value={rentFrequency} onValueChange={(v) => setRentFrequency(v ?? 'MONTHLY')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="FORTNIGHTLY">Fortnightly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bond Required <span className="text-slate-400 text-xs">(optional)</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                <Input className="pl-7" type="number" min="0" value={bondRequired} onChange={(e) => setBondRequired(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bond Scheme <span className="text-slate-400 text-xs">(optional)</span></Label>
              <Select value={bondScheme} onValueChange={(v) => setBondScheme(v ?? '')}>
                <SelectTrigger><SelectValue placeholder="Select scheme" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DPS">DPS</SelectItem>
                  <SelectItem value="TDS">TDS</SelectItem>
                  <SelectItem value="MYDEPOSITS">myDeposits</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleCreate} disabled={!canCreate}>Create Tenancy</Button>
          </div>
        </div>
      )}
    </div>
  )
}
