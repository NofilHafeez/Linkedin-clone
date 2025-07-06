import { NextRequest, NextResponse } from "next/server";
import {prisma} from "../../../../../lib/schema";

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
    const { postId } = params;

    if (!postId) {
        return new Response(JSON.stringify({ error: 'Post ID is required' }), { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            select: {
                id: true,
                commenterId: true,
                text: true,
                createdAt: true,
            },
        });

        if (!comments || comments.length === 0) {
            return new Response(JSON.stringify({ message: 'No comments found for this post' }), { status: 404 });
        }

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
    const { postId } = params;

    try {
        const { text, commenterId } = await request.json();

        if (!postId || !text || !commenterId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                postId,
                text,
                commenterId,
            },
            include: {
                commenter: { // Optional: Include commenter info if you want to return it
                    select: {
                        id: true,
                        name: true,
                        profilePic: true,
                    },
                },
            },
        });

        return NextResponse.json({ message: 'Comment created successfully', comment }, { status: 200 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { postId: string } }) {
    const { postId } = params;
    const { commentId } = await request.json();

    if (!postId || !commentId) {
        return new Response(JSON.stringify({ error: 'Post ID and Comment ID are required' }), { status: 400 });
    }

    try {
        const existingComment = await prisma.comment.findFirst({
            where: { id: commentId, postId }
        });

        if (!existingComment) {
            return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404 });
        }

        await prisma.comment.delete({
            where: { id: commentId }
        });

        return new Response(JSON.stringify({ message: 'Comment deleted successfully' }), { status: 200 });

    } catch (error) {
        console.error('Error deleting comment:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

