export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const clerkId = searchParams.get("clerkId");

    if (!postId || !clerkId) {
      return NextResponse.json({ isBookmarked: false });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ isBookmarked: false });
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: { postId, userId: user.id },
    });

    return NextResponse.json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ isBookmarked: false });
  }
}

export async function POST(req) {
  try {
    const { postId, clerkId, email, username } = await req.json();

    if (!clerkId || !postId) {
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

    // Check if already bookmarked
    const existing = await prisma.bookmark.findFirst({
      where: { postId, userId: user.id },
    });

    if (existing) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ isBookmarked: false });
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: { postId, userId: user.id },
      });
      return NextResponse.json({ isBookmarked: true });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}