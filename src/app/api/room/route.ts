import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/schema";

export async function POST(req: NextRequest) {
  try {
    const { userIds, isGroup} = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length < 2) {
      return NextResponse.json({ error: "At least 2 userIds are required" }, { status: 400 });
    }

    // Create room
    const room = await prisma.room.create({
      data: {
        isGroup: !!isGroup,
        users: {
          connect: userIds.map((id: string) => ({ id })),
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// Adjust path based on your project

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const rooms = await prisma.room.findMany({
      where: {
        users: {
          some: {
            id: userId,  // Find rooms where this user is part of the users array
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Fetch latest message for preview
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

