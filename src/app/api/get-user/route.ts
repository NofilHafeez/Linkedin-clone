import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { prisma } from "../../../../lib/schema";
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  const token =  request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        bio: true,
        title: true,
        location: true,
        bannerPic: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
    
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
