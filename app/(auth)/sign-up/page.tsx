'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertCircle, Loader2, Check } from 'lucide-react'
import { RenlioLogo } from '@/components/shared/RenlioLogo'

const signUpSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type SignUpValues = z.infer<typeof signUpSchema>

function PasswordRule({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-green-600' : 'text-slate-400'}`}>
      <Check className={`h-3 w-3 flex-shrink-0 ${met ? 'opacity-100' : 'opacity-0'}`} />
      <span>{text}</span>
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  })

  const passwordValue = form.watch('password')
  const rules = {
    length: passwordValue.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  }

  async function onSubmit(values: SignUpValues) {
    setAuthError(null)
    await new Promise((r) => setTimeout(r, 800))
    console.log('Sign up:', values.email)
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
          <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">Start managing your properties</p>
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2.5 mb-5">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{authError}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                {...form.register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create a strong password"
                className={`w-full h-11 px-3.5 pr-11 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                  errors.password
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordValue && (
              <div className="mt-2 space-y-1 px-0.5">
                <PasswordRule met={rules.length} text="At least 8 characters" />
                <PasswordRule met={rules.uppercase} text="One uppercase letter" />
                <PasswordRule met={rules.number} text="One number" />
              </div>
            )}
            {errors.password && !passwordValue && (
              <p className="flex items-center gap-1.5 text-sm text-red-500 mt-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
            <div className="relative">
              <input
                {...form.register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={`w-full h-11 px-3.5 pr-11 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="flex items-center gap-1.5 text-sm text-red-500 mt-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
