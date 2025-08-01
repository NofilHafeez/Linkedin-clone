import { NextResponse } from 'next/server';
import {prisma} from '../../../..//lib/schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  console.log(userId)

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        bio: true,
        title: true,
        location: true,
        bannerPic: true,
        status: true,
        experience:true,
        education:true,
        skills: true,
        viewedProfile: true,
        receivedConnections:true

      },
    });
  

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }
  console.log(user)


    return NextResponse.json({ user }, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
