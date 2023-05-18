import { NextResponse } from 'next/server';
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs"; 

export async function middleware(req) {

  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && !req.url.includes('/login')) { 
    return NextResponse.redirect(new URL('/login', req.url));
  } else if(session && req.url.includes('/login')) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};