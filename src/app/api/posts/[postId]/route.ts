// GET, PUT, DELETE single post by ID
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/schema'; // adjust path as needed


export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await req.json();
    const { text, imageUrl } = body;

    const updated = await prisma.post.update({
      where: { id: params.postId },
      data: { text, imageUrl },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await prisma.post.delete({ where: { id: params.postId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
