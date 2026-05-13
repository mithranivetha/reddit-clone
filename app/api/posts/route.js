export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, content, tags, communityId, clerkId, email, username } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!title || !content || !communityId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
        // Check if email already exists
        const existingByEmail = await prisma.user.findUnique({
            where: { email },
        });
  
        if (existingByEmail) {
            // Update clerkId if email exists
            user = await prisma.user.update({
                where: { email },
                data: { clerkId },
            });
        } else {
            user = await prisma.user.create({
                data: { clerkId, email, username },
            });
        }
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        tags: tags || [],
        communityId,
        authorId: user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}