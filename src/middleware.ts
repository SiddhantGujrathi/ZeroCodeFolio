import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifySession(sessionCookie: string) {
    if (!sessionCookie) return null;
    try {
        const { payload } = await jwtVerify(sessionCookie, secretKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        // This can happen if the token is invalid or expired
        return null;
    }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const session = await verifySession(sessionCookie || '');
  const { pathname } = request.nextUrl;
  
  const isProtectedRoute = pathname.startsWith('/dashboard');

  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
