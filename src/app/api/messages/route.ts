import { NextRequest } from "next/server";
import { prisma } from "../../../../lib/schema";

export async function POST(request:NextRequest) {
    const body = await request.json();
    const { roomId, senderId, text } = body;
    
    if (!roomId || !senderId || !text) {
        return new Response(JSON.stringify({ error: 'Room ID, User ID, and text are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        });
    }
    
    try {
        const newMessage = await prisma.message.create({
        data: {
            roomId,
            senderId,
            text,
        },
        });
    
        return new Response(JSON.stringify({ newMessage }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating message:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
        return new Response(JSON.stringify({ error: 'Room ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const messages = await prisma.message.findMany({
            where: { roomId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        profilePic: true,
                    },
                },
            },
        });

        return new Response(JSON.stringify(messages), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}