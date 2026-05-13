export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, description, clerkId, email, username } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const cleanName = name.toLowerCase().replace(/\s+/g, "-");

    const existing = await prisma.community.findUnique({
      where: { slug: cleanName },
    });

    if (existing) {
      return NextResponse.json({ error: "Community already exists" }, { status: 400 });
    }

    // Get or create user in database
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

    const community = await prisma.community.create({
      data: {
        name: cleanName,
        slug: cleanName,
        description,
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}