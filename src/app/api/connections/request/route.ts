import { NextResponse } from "next/server";
import {prisma} from "../../../../../lib/schema";

export async function POST(request: Request) {
    try {
        const { requesterId, receiverId } = await request.json();

        if (!receiverId || !requesterId) {
            return NextResponse.json({ error: "requester and receiver ids is required" }, { status: 400 });
        }

        await prisma.connection.create({
        data: {
            requesterId,
            receiverId,
        },
    });

        return NextResponse.json("Connection request is sended!", { status: 200 });
    } catch (error) {
        console.error("Error fetching connections:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}