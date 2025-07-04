import {  NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../../../lib/schema';

export async function GET(request: NextRequest, context:{ params: { userId: string } }) {
  const params = context.params;
  const userId = params.userId;
  console.log('Fetching connection requests for user:', userId);

  try {
    const requests = await prisma.connection.findMany({
      where: {
        status: "PENDING",
        receiverId: userId, // Only requests where the logged-in user is the receiver
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            title: true,
            createdAt: true, // Assuming you store title, else remove this
          },
        },
      },
    });
    console.log('Fetched connection requests:', requests);

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error('Error fetching connection requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
