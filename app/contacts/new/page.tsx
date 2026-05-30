'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ContactForm } from '@/components/shared/ContactForm'
import { toastSuccess } from '@/lib/toast'
import type { ContactFormValue } from '@/types'

function defaultFormValue(): ContactFormValue {
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

export default function NewContactPage() {
  const router = useRouter()
  const [formValue, setFormValue] = useState<ContactFormValue>(defaultFormValue())
  const [showContactError, setShowContactError] = useState(false)

  const primary = formValue.people[0]
  const canSave = primary.first_name.trim() !== '' && primary.last_name.trim() !== ''

  function handleSave() {
    if (!canSave) {
      setShowContactError(true)
      return
    }
    toastSuccess('Contact created')
    router.push('/contacts')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/contacts" className="text-sm text-slate-500 hover:text-slate-700">← Contacts</Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">New Contact</h1>
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
        <Link href="/contacts">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave}>
          Save Contact
        </Button>
      </div>
    </div>
  )
}
