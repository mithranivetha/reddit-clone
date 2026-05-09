import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateCommunityForm from "@/components/CreateCommunityForm";

export default async function CommunitiesPage() {
  const communities = await prisma.community.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="min-h-screen py-8 px-4" style={{backgroundColor: "#E0E1DD"}}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}>Communities</h1>
          <p className="mt-1" style={{color: "#7A6263"}}>Find your people. Join a community today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Communities List */}
          <div className="lg:col-span-2">
            {communities.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border" style={{borderColor: "#E0E1DD"}}>
                <span className="text-5xl mb-4 block">🌱</span>
                <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>No communities yet</h3>
                <p style={{color: "#7A6263"}}>Be the first to create one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communities.map((community) => (
                  <Link key={community.id} href={`/n/${community.slug}`}>
                    <div className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all cursor-pointer" style={{borderColor: "#E0E1DD"}}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: "#0B3954"}}>
                        <span className="text-white font-bold text-lg">
                          {community.name[0].toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg" style={{color: "#0B3954"}}>n/{community.name}</h3>
                      {community.description && (
                        <p className="text-sm mt-1 line-clamp-2" style={{color: "#7A6263"}}>{community.description}</p>
                      )}
                      <p className="text-sm font-medium mt-3" style={{color: "#087E8B"}}>
                        {community._count.posts} posts
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Create Community Form */}
          <div className="lg:col-span-1">
            <CreateCommunityForm />
          </div>

        </div>
      </div>
    </div>
  );
}