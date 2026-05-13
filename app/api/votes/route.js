export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { postId, type, clerkId, email, username } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!postId || !type) {
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

    // Check if user already voted on this post
    const existingVote = await prisma.vote.findFirst({
      where: {
        postId,
        userId: user.id,
      },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        // Same vote — remove it (toggle off)
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
      } else {
        // Different vote — switch it
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type },
        });
      }
    } else {
      // No existing vote — create new
      await prisma.vote.create({
        data: {
          type,
          postId,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}