import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/schema";

export async function GET(request: NextRequest) {
   const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  try {
    const recentConnections = await prisma.connection.findMany({
      where: {
        status: "ACCEPTED",
        OR: [
          { receiverId: userId },
          { requesterId: userId },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            title: true,
            createdAt: true, // Include createdAt for sorting
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(recentConnections, { status: 200 });
  } catch (error) {
    console.error('Error fetching recent connections:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
