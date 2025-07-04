// app/api/signup/route.ts (App Router)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/schema'; 
import bcrypt from 'bcryptjs';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
 
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({
        where: { email },
    });

    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ message: 'Registration successful!' }, { status: 200 });
  } catch (err) {
    console.error('registering error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
