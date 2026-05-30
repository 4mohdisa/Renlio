'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Mail, MessageSquare, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PageHeader } from '@/components/shared/PageHeader'

// ============================================================
// FORM VALIDATION SCHEMAS
// ============================================================

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  page_feature: z.string().min(1, 'Please select a page or feature'),
  severity: z.string().min(1, 'Please select severity'),
  description: z.string().min(20, 'Please provide more detail (at least 20 characters)'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
})

const featureSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Please select a category'),
  priority: z.string().min(1, 'Please select priority'),
  description: z.string().min(20, 'Please provide more detail (at least 20 characters)'),
  frequency: z.string().optional(),
})

type IssueFormValues = z.infer<typeof issueSchema>
type FeatureFormValues = z.infer<typeof featureSchema>

// ============================================================
// REPORT ISSUE FORM
// ============================================================

function ReportIssueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [reference, setReference] = useState('')

  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      page_feature: '',
      severity: '',
      description: '',
      email: '',
    },
  })

  async function onSubmit(values: IssueFormValues) {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    setReference('ISSUE-' + Date.now().toString().slice(-6))
    setIsSuccess(true)
    setIsSubmitting(false)
  }

  function reset() {
    form.reset()
    setIsSuccess(false)
    setReference('')
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Issue reported successfully</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Thank you for helping improve Renlio. We will review your report and follow up if needed.
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg px-4 py-2 inline-block">
            <p className="text-sm text-slate-600">Reference: <span className="font-mono font-medium">{reference}</span></p>
          </div>
          <Button onClick={reset} variant="outline">Report Another Issue</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an Issue</CardTitle>
        <CardDescription>Found a bug or something not working as expected</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue-title">Issue Title *</Label>
            <Input
              id="issue-title"
              {...form.register('title')}
              placeholder="Brief description of the issue"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page-feature">Page or Feature *</Label>
              <Select
                value={form.watch('page_feature')}
                onValueChange={(v) => form.setValue('page_feature', v ?? '')}
              >
                <SelectTrigger id="page-feature">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dashboard">Dashboard</SelectItem>
                  <SelectItem value="Properties">Properties</SelectItem>
                  <SelectItem value="Tenancies">Tenancies</SelectItem>
                  <SelectItem value="Contacts">Contacts</SelectItem>
                  <SelectItem value="Invoices">Invoices</SelectItem>
                  <SelectItem value="Bills">Bills</SelectItem>
                  <SelectItem value="Payments">Payments</SelectItem>
                  <SelectItem value="Suppliers">Suppliers</SelectItem>
                  <SelectItem value="Folios">Folios</SelectItem>
                  <SelectItem value="Settings">Settings</SelectItem>
                  <SelectItem value="Auth">Auth</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.page_feature && (
                <p className="text-sm text-red-500">{form.formState.errors.page_feature.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity *</Label>
              <Select
                value={form.watch('severity')}
                onValueChange={(v) => form.setValue('severity', v ?? '')}
              >
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical (app is broken)</SelectItem>
                  <SelectItem value="High">High (major feature broken)</SelectItem>
                  <SelectItem value="Medium">Medium (feature partially broken)</SelectItem>
                  <SelectItem value="Low">Low (minor issue or cosmetic)</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.severity && (
                <p className="text-sm text-red-500">{form.formState.errors.severity.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="issue-description">Description *</Label>
            <Textarea
              id="issue-description"
              {...form.register('description')}
              placeholder="Please describe what happened, what you expected, and steps to reproduce..."
              rows={5}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="issue-email">Email for updates (optional)</Label>
            <Input
              id="issue-email"
              type="email"
              {...form.register('email')}
              placeholder="your@email.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Report
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// ============================================================
// FEATURE REQUEST FORM
// ============================================================

function FeatureRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [reference, setReference] = useState('')

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      title: '',
      category: '',
      priority: '',
      description: '',
      frequency: '',
    },
  })

  async function onSubmit(values: FeatureFormValues) {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    setReference('FEAT-' + Date.now().toString().slice(-6))
    setIsSuccess(true)
    setIsSubmitting(false)
  }

  function reset() {
    form.reset()
    setIsSuccess(false)
    setReference('')
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Feature request submitted</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We review all feature requests and prioritise based on community need.
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg px-4 py-2 inline-block">
            <p className="text-sm text-slate-600">Reference: <span className="font-mono font-medium">{reference}</span></p>
          </div>
          <Button onClick={reset} variant="outline">Submit Another Request</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a Feature</CardTitle>
        <CardDescription>Have an idea that would improve your workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feature-title">Feature Title *</Label>
            <Input
              id="feature-title"
              {...form.register('title')}
              placeholder="What would you like Renlio to do"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={form.watch('category')}
                onValueChange={(v) => form.setValue('category', v ?? '')}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial Tracking">Financial Tracking</SelectItem>
                  <SelectItem value="Reporting">Reporting</SelectItem>
                  <SelectItem value="Tenant Management">Tenant Management</SelectItem>
                  <SelectItem value="Property Management">Property Management</SelectItem>
                  <SelectItem value="Communications">Communications</SelectItem>
                  <SelectItem value="Integrations">Integrations</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority to you *</Label>
              <Select
                value={form.watch('priority')}
                onValueChange={(v) => form.setValue('priority', v ?? '')}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nice to have">Nice to have</SelectItem>
                  <SelectItem value="Would improve my workflow">Would improve my workflow</SelectItem>
                  <SelectItem value="Critical for my business">Critical for my business</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.priority && (
                <p className="text-sm text-red-500">{form.formState.errors.priority.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feature-description">Description *</Label>
            <Textarea
              id="feature-description"
              {...form.register('description')}
              placeholder="Describe the feature and how it would help you..."
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">How often would you use it (optional)</Label>
            <Select
              value={form.watch('frequency') || ' '}
              onValueChange={(v) => form.setValue('frequency', v === ' ' ? '' : (v ?? ''))}
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">—</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Rarely">Rarely</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// ============================================================
// FAQ COMPONENT
// ============================================================

const FAQ_ITEMS = [
  {
    q: 'When will Phase 2 (backend) be available?',
    a: 'Phase 2 is in active development. Your data will be securely stored in Supabase with full multi-user support.',
  },
  {
    q: 'Can I use Renlio for multiple properties?',
    a: 'Yes. Renlio supports unlimited properties, each with their own rooms, tenancies, and financial folios.',
  },
  {
    q: 'What is a Folio?',
    a: 'A folio is a financial ledger for a specific entity — tenants, owners, and suppliers each have their own folio showing all transactions.',
  },
  {
    q: 'How are arrears calculated?',
    a: 'Rent arrears are calculated daily from the move-in date. The daily rate is derived from the rent amount and frequency. Arrears = total rent due − total rent paid.',
  },
  {
    q: 'Will there be a mobile app?',
    a: 'Yes. A React Native mobile app is planned and will use the same backend API as the web application.',
  },
]

function FAQCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

// ============================================================
// CONTACT CARD
// ============================================================

function ContactCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-slate-400" />
          <a href="mailto:support@renlio.app" className="text-sm text-blue-600 hover:underline">
            support@renlio.app
          </a>
        </div>
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-slate-400" />
          <span className="text-sm text-slate-600">Response time: within 24 hours</span>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-slate-400" />
          <span className="text-sm text-slate-600">Your data is secure and never shared</span>
        </div>
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Live chat and phone support available in Phase 2
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function SupportPage() {
  return (
    <>
      <PageHeader title="Support" description="Get help with Renlio" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Forms */}
        <div className="space-y-6">
          <ReportIssueForm />
          <FeatureRequestForm />
        </div>
        {/* Right column - Resources */}
        <div className="space-y-6">
          <FAQCard />
          <ContactCard />
        </div>
      </div>
    </>
  )
}
