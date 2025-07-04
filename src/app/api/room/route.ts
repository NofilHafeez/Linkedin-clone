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
