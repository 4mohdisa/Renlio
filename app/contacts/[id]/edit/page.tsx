'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactForm } from '@/components/shared/ContactForm'
import { EmptyState } from '@/components/shared/EmptyState'
import { toastSuccess } from '@/lib/toast'
import { mockContactGroups, mockContacts } from '@/lib/mock-data'
import type { ContactFormValue } from '@/types'

export default function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [showContactError, setShowContactError] = useState(false)

  const group = mockContactGroups.find((g) => g.id === id)
  const people = mockContacts.filter((c) => c.contact_group_id === id)

  const [formValue, setFormValue] = useState<ContactFormValue>({
    people: people.map((p) => ({
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

  if (!group || people.length === 0) {
    return (
      <EmptyState
        title="Contact not found"
        description="This contact does not exist"
        actionLabel="Back to Contacts"
        actionHref="/contacts"
      />
    )
  }

  const primary = formValue.people.find((p) => p.is_primary) ?? formValue.people[0]
  const canSave = primary.first_name.trim() !== '' && primary.last_name.trim() !== ''

  function handleSave() {
    if (!canSave) {
      setShowContactError(true)
      return
    }
    toastSuccess('Contact updated')
    router.push(`/contacts/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/contacts/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← {primary.first_name} {primary.last_name}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Edit Contact</h1>
      </div>

      <ContactForm
        mode="create"
        value={formValue}
        onChange={setFormValue}
      />

      {/* Validation Error Message */}
      {showContactError && !canSave && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Contact required</p>
            <p className="text-sm text-destructive/80">
              Please enter a first and last name for the primary contact before saving.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Link href={`/contacts/${id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
