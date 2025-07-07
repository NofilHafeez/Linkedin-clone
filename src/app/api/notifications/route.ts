import { prisma } from '../../../../lib/schema';
import { NextResponse, NextRequest } from 'next/server';

// Get notifications for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { receiverId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      },
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Mark notification as read
export async function PUT(request: Request) {
  const { userId } = await request.json();
 
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await prisma.notification.updateMany({
      where: { receiverId: userId },
      data: { isRead: true }
    });

    return NextResponse.json({ message: 'Notification marked as read' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
 
// Create notification
export async function POST(request: NextRequest) {
  const { senderId, receiverId, message } = await request.json();

  if (!senderId || !message || !receiverId) {
    return NextResponse.json({ error: "sender and receiver ID and text are required" }, { status: 400 });
  }

  try {
    const notification = await prisma.notification.create({
      data: { senderId, receiverId, message },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

