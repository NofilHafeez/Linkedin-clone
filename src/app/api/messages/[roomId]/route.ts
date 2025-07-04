import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/schema";

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
  const { roomId } = params;
  
  if (!roomId) {
    return new Response(JSON.stringify({ error: 'Room ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' }, // Ascending order (oldest first)
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
