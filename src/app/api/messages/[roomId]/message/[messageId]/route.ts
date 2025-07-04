import {prisma} from "../../../../../../../lib/schema";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { messageId: string } }) {
  const { messageId } = params;

  if (!messageId) {
    return new Response(JSON.stringify({ error: 'message ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await prisma.message.delete({
    where: { id: messageId },
});


    return new Response(JSON.stringify({ message: 'Messages deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting messages:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { messageId: string } }) {
  const { messageId } = params;

  if (!messageId) {
    return new Response(JSON.stringify({ error: 'message ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { text: content },
    });

    return new Response(JSON.stringify(updatedMessage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}