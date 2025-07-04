import { NextResponse } from 'next/server';
import {prisma} from '../../../..//lib/schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      select: { id: true, name: true, profilePic: true }
    });

    const posts = await prisma.post.findMany({
      where: {
        text: { contains: query, mode: 'insensitive' }
      },
      include: {
        user: { select: { id: true, name: true, profilePic: true } }
      }
    });

    return NextResponse.json({ users, posts }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
