import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { type, data } = await req.json();

    if (type === "user.created") {
      await prisma.user.create({
        data: {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          username: data.username || data.email_addresses[0].email_address.split("@")[0],
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}