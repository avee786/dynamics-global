import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require admin role
const ADMIN_ROUTES = ['/admin'];
// Routes that require client role
const CLIENT_ROUTES = ['/client'];
// Public routes (never redirect)
const PUBLIC_ROUTES = ['/admin/login', '/client/login', '/client/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes and API routes
  if (
    PUBLIC_ROUTES.some(r => pathname.startsWith(r)) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  // Protect /admin/* routes
  if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect /client
  if (CLIENT_ROUTES.some(r => pathname.startsWith(r))) {
    if (!token) {
      return NextResponse.redirect(new URL('/client/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static & _next/image
     * - favicon.ico
     * - images / public files
     */
    '/((?!_next/static|_next/image|favicon.ico|images|uploads|logo.png|.*\\.svg).*)',
  ],
};
