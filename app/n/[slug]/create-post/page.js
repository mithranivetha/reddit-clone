export const dynamic = "force-dynamic";

import CreatePostForm from "@/components/CreatePostForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CreatePostPage({ params }) {
  const { slug } = await params;

  const community = await prisma.community.findUnique({
    where: { slug },
  });

  if (!community) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{backgroundColor: "#E0E1DD"}}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}>
          Create a Post
        </h1>
        <p className="mb-8" style={{color: "#7A6263"}}>
          Posting in <span className="font-bold" style={{color: "#087E8B"}}>n/{community.name}</span>
        </p>
        <CreatePostForm communityId={community.id} slug={slug} />
      </div>
    </div>
  );
}