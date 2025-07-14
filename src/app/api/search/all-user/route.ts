import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/schema";

export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            select: { 
                id: true, 
                name: true, 
                title: true, 
                profilePic: true 
            }
        });

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: 'Internal server error' }, 
            { status: 500 }
        );
    }
}