'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Critical Error</h1>
          <p className="text-sm text-slate-500 mb-6">
            A critical error occurred and the application could not recover.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  )
}
