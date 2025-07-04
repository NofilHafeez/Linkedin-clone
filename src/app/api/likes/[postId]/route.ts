import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/schema';

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const { postId } = params;

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const likes = await prisma.like.findMany({
      where: { postId },
      select: {
        id: true,
        userId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(likes, { status: 200 });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  const { postId } = params;
  const { userId } = await request.json();

  if (!postId || !userId) {
    return NextResponse.json({ error: 'Post ID and User ID are required' }, { status: 400 });
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });

    if (existingLike) {
      return NextResponse.json({ error: 'Already liked' }, { status: 409 });
    }

    const like = await prisma.like.create({
      data: { postId, userId },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    console.error('Error creating like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { postId: string } }) {
  const { postId } = params;
  const { userId } = await request.json();

  if (!postId || !userId) {
    return NextResponse.json({ error: 'Post ID and User ID are required' }, { status: 400 });
  }

  try {
    const deleted = await prisma.like.deleteMany({
      where: { postId, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Like removed' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
