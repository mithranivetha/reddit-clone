export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { clerkId, email, username, bio } = await req.json();

    if (!clerkId || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if username is taken
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing && existing.clerkId !== clerkId) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { clerkId },
        data: { username, bio },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: { clerkId, email, username, bio },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { clerkId, bio } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { clerkId },
      data: { bio },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}