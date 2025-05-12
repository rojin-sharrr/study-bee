import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Log the request for debugging
  console.log(`[Middleware] ${request.method} ${path}`);
  console.log('Cookies:', request.cookies.getAll());
  
  // Get the token from cookies
  const token = request.cookies.get('jwt')?.value;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/signup';
  
  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    console.log('[Middleware] No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If the path is public and there's a token, redirect to home
  if (isPublicPath && token) {
    console.log('[Middleware] Token found on public path, redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
