import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define protected routes
  const isAdminRoute = path.startsWith('/dashboard/admin');
  const isManagerRoute = path.startsWith('/dashboard/manager');
  
  if (isAdminRoute || isManagerRoute) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // Role-based access control
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    if (isAdminRoute && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isManagerRoute && !['ADMIN', 'MANAGER'].includes(token.role as string)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/admin/:path*',
    '/dashboard/manager/:path*',
  ],
};