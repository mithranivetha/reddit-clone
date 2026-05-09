import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Clean the name - lowercase, no spaces
    const cleanName = name.toLowerCase().replace(/\s+/g, "-");

    // Check if community already exists
    const existing = await prisma.community.findUnique({
      where: { slug: cleanName },
    });

    if (existing) {
      return NextResponse.json({ error: "Community already exists" }, { status: 400 });
    }

    // Make sure user exists in our database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found. Please complete signup." }, { status: 404 });
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