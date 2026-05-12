import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { clerkId, email } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ error: "No clerkId" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Create user WITHOUT username so they get redirected to profile setup
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          username: `user_${clerkId.slice(-8)}`, // temporary unique username
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ error: "No clerkId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    return NextResponse.json(user || {});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}