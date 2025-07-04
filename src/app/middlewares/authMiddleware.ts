import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '../../../lib/schema'; // adjust path as needed

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Decode & verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string }, // Match this with your Prisma schema
    });

    if (!user) { 
      throw new Error('User not found');
    }

    // Attach user data to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-email', user.email);
    console.log('Authenticated user:', user);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Run middleware only for protected routes
export const config = {
  matcher: [
    '/api/edit-profile', 
    '/api/posts', 
    '/api/users',
    '/api/messages',
    '/api/connections',
    '/api/get-user',
    ],
};
