import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/schema';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    // Find all accepted connections involving the user
    const connections = await prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: userId },
          { receiverId: userId },
        ],
      },
      select: {
        requesterId: true,
        receiverId: true,
      },
    });

    // Extract connected user IDs
    const connectionIds = connections.map(conn =>
      conn.requesterId === userId ? conn.receiverId : conn.requesterId
    );

    if (connectionIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch posts from connected users, include user and comments
    const posts = await prisma.post.findMany({
      where: {
        userId: { in: connectionIds },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            title: true,
          },
        },
        comments: {
          include: {
            commenter: {
              select: {
                id: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true,
              },
            },
          },
        }, // Optional: include likes if needed
      },
    });

    return NextResponse.json(posts);

  } catch (error) {
    console.error("Error fetching connection posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
