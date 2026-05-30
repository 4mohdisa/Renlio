'use client'

import { use } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { mockContactGroups, mockContacts } from '@/lib/mock-data'

const TYPE_COLORS: Record<string, string> = {
  TENANT: 'bg-blue-100 text-blue-700',
  SUPPLIER: 'bg-purple-100 text-purple-700',
  OWNER: 'bg-amber-100 text-amber-700',
  OTHER: 'bg-slate-100 text-slate-600',
}

const TYPE_LABELS: Record<string, string> = {
  TENANT: 'Tenant',
  SUPPLIER: 'Supplier',
  OWNER: 'Owner',
  OTHER: 'Other',
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const group = mockContactGroups.find((g) => g.id === id)
  const people = mockContacts.filter((c) => c.contact_group_id === id)
  const primary = people.find((p) => p.is_primary)

  if (!group || !primary) {
    return (
      <EmptyState
        title="Contact not found"
        description="This contact does not exist"
        actionLabel="Back to Contacts"
        actionHref="/contacts"
      />
    )
  }

  const type = primary.type

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <Link href="/contacts" className="text-sm text-slate-500 hover:text-slate-700">← Contacts</Link>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {primary.first_name} {primary.last_name}
            </h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[type] ?? TYPE_COLORS.OTHER}`}>
              {TYPE_LABELS[type] ?? 'Other'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">People</h2>

            {people.length === 1 ? (
              // Single person - no tabs
              (() => {
                const person = people[0]
                return (
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
                )
              })()
            ) : (
              // Multiple people - use shadcn Tabs
              <Tabs defaultValue={people.findIndex(p => p.is_primary).toString()} className="w-full">
                <TabsList className="mb-3">
                  {people.map((person, idx) => (
                    <TabsTrigger key={person.id} value={idx.toString()} className="flex items-center gap-1.5">
                      {person.first_name}
                      {person.is_primary && (
                        <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700">
                          Primary
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {people.map((person, idx) => (
                  <TabsContent key={person.id} value={idx.toString()}>
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
                  </TabsContent>
                ))}
              </Tabs>
            )}

          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Actions</h2>
            <Link href={`/contacts/${id}/edit`} className="block">
              <Button variant="outline" className="w-full justify-start">Edit Contact</Button>
            </Link>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
