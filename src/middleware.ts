// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is now a passthrough and does not protect any routes.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
