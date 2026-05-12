import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ username: null, needsSetup: true });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    // If no user or username starts with user_ it means they haven't set up profile
    if (!user || user.username.startsWith("user_")) {
      return NextResponse.json({ username: null, needsSetup: true });
    }

    return NextResponse.json({ username: user.username, needsSetup: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ username: null, needsSetup: true });
  }
}