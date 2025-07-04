// app/api/logout/route.ts
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies(); // ✅ use this object

  // Expire the token cookie
    cookieStore.set('token', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: true, // optional but recommended in production
  });

  return new Response(JSON.stringify(null), {
    status: 200,
    headers: { Location: '/login' },
  });
}
