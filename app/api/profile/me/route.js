import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ username: null });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    return NextResponse.json({ username: user?.username || null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ username: null });
  }
}