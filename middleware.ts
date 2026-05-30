import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that do not require authentication
const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/forgot-password']

// Static file patterns to ignore
const STATIC_PATTERNS = ['/_next', '/favicon', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and API routes
  if (STATIC_PATTERNS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for mock auth cookie — Phase 2 will replace this with Supabase session
  const mockAuthCookie = request.cookies.get('renlio-auth-mock')

  if (!mockAuthCookie) {
    // Not authenticated — redirect to sign in
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
