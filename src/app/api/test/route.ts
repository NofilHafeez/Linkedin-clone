import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { prisma } from "../../../../lib/schema";
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {


  try {
    const users = await prisma.user.findMany();

  

    if (!users) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ users });
    
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
