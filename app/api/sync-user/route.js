import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const clerkUser = await currentUser();

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Create user in database
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          username: clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split("@")[0],
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}