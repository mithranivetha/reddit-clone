export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json([]);
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json([]);
    }

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
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}