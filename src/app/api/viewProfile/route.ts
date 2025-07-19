import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/schema";

export async function POST(req: NextRequest) {
  try {
    const { searchUserId, viewedProfile } = await req.json();

    if (typeof viewedProfile !== "number") {
      return NextResponse.json({ error: "Invalid viewedProfile" }, { status: 400 });
    }
 
    if (!searchUserId) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: searchUserId as string,
        },
        select: {
            viewedProfile: true
        }
      })

    await prisma.user.update({
      where: {
        id: searchUserId as string,
      },
      data: {
        viewedProfile: user?.viewedProfile + viewedProfile,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating viewed profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
