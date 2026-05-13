export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { postId, content, clerkId, email, username } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!postId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId, email, username },
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: user.id,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}