'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState } from '@/components/shared/EmptyState'
import { toastSuccess } from '@/lib/toast'
import { mockProperties } from '@/lib/mock-data'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { roomSchema, type RoomFormValues } from '@/lib/validations'

export default function NewRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const property = mockProperties.find((p) => p.id === id)

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_label: '',
      room_type: 'BEDROOM',
    },
  })

  if (!property) {
    return (
      <EmptyState
        title="Property not found"
        description="This property does not exist"
        actionLabel="Back to Properties"
        actionHref="/properties"
      />
    )
  }

  function handleSave(_values: RoomFormValues) {
    toastSuccess('Room added')
    router.push(`/properties/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/properties/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← {property.name}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          Add Room — {property.name}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Room Details</h2>

          <FormField
            control={form.control}
            name="room_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Label *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Room 1, Studio A, Suite 2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="room_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BEDROOM">Bedroom</SelectItem>
                    <SelectItem value="STUDIO">Studio</SelectItem>
                    <SelectItem value="SUITE">Suite</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Link href={`/properties/${id}`}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Room'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
