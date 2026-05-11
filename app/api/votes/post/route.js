import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const clerkId = searchParams.get("clerkId");

    if (!postId) {
      return NextResponse.json({ upvotes: 0, downvotes: 0, userVote: null });
    }

    const votes = await prisma.vote.findMany({
      where: { postId },
    });

    const upvotes = votes.filter((v) => v.type === "UP").length;
    const downvotes = votes.filter((v) => v.type === "DOWN").length;

    let userVote = null;
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkId },
      });
      if (user) {
        const vote = votes.find((v) => v.userId === user.id);
        userVote = vote?.type || null;
      }
    }

    return NextResponse.json({ upvotes, downvotes, userVote });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ upvotes: 0, downvotes: 0, userVote: null });
  }
}