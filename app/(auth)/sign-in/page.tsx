'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { RenlioLogo } from '@/components/shared/RenlioLogo'

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: SignInValues) {
    setAuthError(null)
    // Simulate async — backend wired in Phase 2
    await new Promise((r) => setTimeout(r, 800))
    // Mock: any credentials work in frontend-only mode
    console.log('Sign in:', values.email)
    // Set mock auth cookie for middleware
    document.cookie = 'renlio-auth-mock=true; path=/; max-age=86400'
    router.push('/')
  }

  const { formState: { errors, isSubmitting } } = form

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.08)] px-8 py-10">
        <div className="flex justify-center mb-8">
          <RenlioLogo size="lg" variant="dark" />
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2.5 mb-5">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{authError}</p>
          </div>
        )}

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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...form.register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full h-11 px-3.5 pr-11 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                  errors.password
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1.5 text-sm text-red-500 mt-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
