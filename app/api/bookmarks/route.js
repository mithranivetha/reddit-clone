export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const clerkId = searchParams.get("clerkId");
    const all = searchParams.get("all");

    if (!clerkId) {
      return NextResponse.json(all ? [] : { isBookmarked: false });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json(all ? [] : { isBookmarked: false });
    }

    // Return all bookmarks
    if (all === "true") {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          post: {
            include: {
              author: true,
              community: true,
              _count: { select: { votes: true, comments: true } },
            },
          },
        },
      });
      return NextResponse.json(bookmarks);
    }

    // Check single bookmark
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

    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId, email, username },
      });
    }

    const existing = await prisma.bookmark.findFirst({
      where: { postId, userId: user.id },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ isBookmarked: false });
    } else {
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