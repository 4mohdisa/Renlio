'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Loader2, ArrowLeft, Mail } from 'lucide-react'
import { RenlioLogo } from '@/components/shared/RenlioLogo'

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type ForgotValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotValues) {
    await new Promise((r) => setTimeout(r, 800))
    setSubmittedEmail(values.email)
    setSubmitted(true)
  }

  const { formState: { errors, isSubmitting } } = form

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.08)] px-8 py-10">
        <div className="flex justify-center mb-8">
          <RenlioLogo size="lg" variant="dark" />
        </div>

        {!submitted ? (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-slate-900">Reset your password</h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  {...form.register('email')}
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                    errors.email
                      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
                  }`}
                />
                {errors.email && (
                  <p className="flex items-center gap-1.5 text-sm text-red-500 mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <div className="flex justify-center mt-6">
              <Link
                href="/sign-in"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Check your email</h2>
            <p className="text-sm text-slate-500 mb-1">
              We sent a reset link to
            </p>
            <p className="text-sm font-medium text-slate-900 mb-6">{submittedEmail}</p>
            <p className="text-xs text-slate-400 mb-6">
              Didn&apos;t receive it? Check your spam folder or try again.
            </p>
            <button
              onClick={() => { setSubmitted(false); form.reset() }}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Try a different email
            </button>
            <div className="flex justify-center mt-4">
              <Link
                href="/sign-in"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
