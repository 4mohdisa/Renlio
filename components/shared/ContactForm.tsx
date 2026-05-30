'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, X, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { mockContacts } from '@/lib/mock-data'
import { filterCompatibleContacts, isRoleCompatible, getRoleConflictMessage } from '@/lib/contact-rules'
import { toastError } from '@/lib/toast'
import type { ContactType, ContactFormValue, PersonFormValue } from '@/types'

function emptyPerson(isPrimary: boolean): PersonFormValue {
  return {
    id: crypto.randomUUID(),
    first_name: '',
    last_name: '',
    company_name: '',
    mobile_phone: '',
    email: '',
    address: '',
    is_primary: isPrimary,
  }
}

interface ContactFormProps {
  mode?: 'create' | 'select'
  value: ContactFormValue
  onChange: (value: ContactFormValue) => void
  maxPeople?: number
  contactType?: ContactType
}

export function ContactForm({
  mode = 'create',
  value,
  onChange,
  maxPeople = 4,
  contactType = 'OTHER',
}: ContactFormProps) {
  const [selectedContactId, setSelectedContactId] = useState<string>('')

  const people = value.people

  function updatePerson(index: number, field: keyof PersonFormValue, val: string) {
    const updated = people.map((p, i) =>
      i === index ? { ...p, [field]: val } : p
    )
    onChange({ people: updated })
  }

  function setPrimary(index: number) {
    const updated = people.map((p, i) => ({ ...p, is_primary: i === index }))
    onChange({ people: updated })
  }

  function addPerson() {
    if (people.length >= maxPeople) return
    onChange({ people: [...people, emptyPerson(false)] })
  }

  function removePerson(index: number) {
    if (people.length <= 1) return
    const updated = people.filter((_, i) => i !== index)
    const hasPrimary = updated.some((p) => p.is_primary)
    if (!hasPrimary) updated[0] = { ...updated[0], is_primary: true }
    onChange({ people: updated })
  }

  function handleSelectExisting(contactId: string) {
    const contact = mockContacts.find((c) => c.id === contactId)
    if (!contact) return

    // Check role compatibility
    if (!isRoleCompatible(contact.type, contactType)) {
      toastError(getRoleConflictMessage(contact.type, contactType))
      return
    }

    setSelectedContactId(contactId)
    const prefilled: PersonFormValue = {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      company_name: contact.company_name ?? '',
      mobile_phone: contact.mobile_phone ?? '',
      email: contact.email ?? '',
      address: contact.address ?? '',
      is_primary: true,
    }
    const rest = people.slice(1).map((p) => ({ ...p, is_primary: false }))
    onChange({ people: [prefilled, ...rest] })
  }

  const existingContacts = filterCompatibleContacts(
    mockContacts.filter((c) => c.is_primary),
    contactType
  )

  const [comboOpen, setComboOpen] = useState(false)

  return (
    <div className="space-y-4">
      {mode === 'select' && (
        <div className="space-y-2">
          <Label>Select Existing Contact (optional)</Label>
          <Popover open={comboOpen} onOpenChange={setComboOpen}>
            <PopoverTrigger
              className="w-full flex items-center justify-between font-normal text-slate-900 bg-white hover:bg-slate-50 rounded-md border border-slate-200 px-3 py-2 cursor-pointer"
              aria-expanded={comboOpen}
            >
              <span className="text-slate-900">
                {selectedContactId
                  ? (() => {
                      const c = mockContacts.find((x) => x.id === selectedContactId)
                      return c ? `${c.first_name} ${c.last_name}` : 'Select contact...'
                    })()
                  : <span className="text-slate-400">Select contact...</span>}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-white border border-slate-200 shadow-md" style={{ width: 'var(--radix-popover-trigger-width)' }} align="start">
              <Command>
                <CommandInput
                  placeholder="Search by name..."
                  className="text-slate-900 placeholder:text-slate-400"
                />
                <CommandList>
                  <CommandEmpty className="py-3 px-4 text-sm text-slate-500">No contacts found.</CommandEmpty>
                  <CommandGroup>
                    {existingContacts.map((c) => (
                      <CommandItem
                        key={c.id}
                        value={`${c.first_name} ${c.last_name}`}
                        onSelect={() => {
                          handleSelectExisting(c.id)
                          setComboOpen(false)
                        }}
                        className="cursor-pointer px-4 py-2 text-slate-900 hover:bg-slate-100 aria-selected:bg-slate-100"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 text-blue-600 flex-shrink-0',
                            selectedContactId === c.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span className="text-sm text-slate-900">
                          {c.first_name} {c.last_name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-slate-400">
            Or fill in the details below to create a new contact
          </p>
        </div>
      )}

      {people.map((person, index) => (
        <div
          key={person.id}
          className="relative border border-slate-200 rounded-xl p-4 space-y-3 bg-white"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-700">
              {index === 0 ? 'Person 1' : `Person ${index + 1}`}
            </span>
            <div className="flex items-center gap-2">
              {person.is_primary ? (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                  Primary
                </span>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPrimary(index)}
                >
                  Set Primary
                </Button>
              )}
              {people.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePerson(index)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Remove person"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">First Name *</Label>
              <Input
                value={person.first_name}
                onChange={(e) => updatePerson(index, 'first_name', e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Last Name *</Label>
              <Input
                value={person.last_name}
                onChange={(e) => updatePerson(index, 'last_name', e.target.value)}
                placeholder="Smith"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Company Name</Label>
              <Input
                value={person.company_name}
                onChange={(e) => updatePerson(index, 'company_name', e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Mobile Phone</Label>
              <Input
                value={person.mobile_phone}
                onChange={(e) => updatePerson(index, 'mobile_phone', e.target.value)}
                placeholder="0412 345 678"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={person.email}
                onChange={(e) => updatePerson(index, 'email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Address</Label>
              <Input
                value={person.address}
                onChange={(e) => updatePerson(index, 'address', e.target.value)}
                placeholder="123 Main Street, Sydney NSW 2000"
              />
            </div>
          </div>
        </div>
      ))}

      {people.length < maxPeople && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPerson}
          className="w-full border-dashed"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      )}
    </div>
  )
}
