import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../../lib/schema"; 

export async function GET(req: NextRequest) {
    const {searchParams} = req.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({error: "no userId"}, {status: 400})
    }
try {
    const posts = await prisma.post.findMany({
        where: {
            userId: userId as string
        },
        orderBy: {
        createdAt: 'desc',
        },
        include: {
        user: {
            select: {
            id: true,
            name: true,
            profilePic: true,
            title: true,
            },
        },
        comments: {
            include: {
            commenter: {
                select: {
                id: true,
                name: true,
                profilePic: true,
                },
            },
            },
        },
        likes: {
            include: {
            user: {
                select: {
                id: true,
                name: true,
                profilePic: true,
                },
            },
            },
        }, // Optional: include likes if needed
        },
    });

    return NextResponse.json(posts, {status: 200});

} catch (error) {
    console.log(error);
    return NextResponse.json({error: " Internal Error"}, {status: 400})
    }
} 