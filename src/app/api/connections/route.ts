import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
  }

  try {
    // Step 1: Fetch current user's title
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { title: true },
    });

    console.log("Current user:", currentUser);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userTitle = currentUser.title;

    if (!userTitle) {
      return NextResponse.json({ error: "User has no title set" }, { status: 400 });
    }

    // Step 2: Fetch ACCEPTED connections only
    const acceptedConnections = await prisma.connection.findMany({
      where: {
        status: "ACCEPTED",
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

    const connectedUserIds = new Set<string>();
    acceptedConnections.forEach(conn => {
      connectedUserIds.add(conn.requesterId);
      connectedUserIds.add(conn.receiverId);
    });
    connectedUserIds.add(userId); // Exclude self

    // Step 3: Fetch similar users excluding connected ones
    const keywords = userTitle.split(/\s+|\|/).filter(Boolean);

    const similarUsers = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(connectedUserIds) },
        OR: keywords.map(keyword => ({
          title: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        })),
      },
      select: {
        id: true,
        name: true,
        profilePic: true,
        title: true,
      },
    });

    console.log("Similar users found:", similarUsers);

    return NextResponse.json({ similarUsers }, { status: 200 });

  } catch (error) {
    console.error("Error fetching similar users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
