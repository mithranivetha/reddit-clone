import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const clerkId = searchParams.get("clerkId");

    if (!postId || !clerkId) {
      return NextResponse.json({ type: null });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ type: null });
    }

    const vote = await prisma.vote.findFirst({
      where: {
        postId,
        userId: user.id,
      },
    });

    return NextResponse.json({ type: vote?.type || null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ type: null });
  }
}