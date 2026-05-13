export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CommunityPage({ params, searchParams }) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const community = await prisma.community.findUnique({
    where: { slug },
    include: {
      posts: {
        orderBy: sort === "popular"
          ? { votes: { _count: "desc" } }
          : { createdAt: "desc" },
        include: {
          author: true,
          _count: { select: { votes: true, comments: true } },
        },
      },
    },
  });

  if (!community) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{backgroundColor: "#E0E1DD"}}>
      <div className="max-w-6xl mx-auto">

        {/* Community Header */}
        <div className="rounded-2xl p-8 text-white mb-8" style={{backgroundColor: "#0B3954"}}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{backgroundColor: "rgba(255,255,255,0.2)"}}>
              <span className="text-white font-bold text-2xl">
                {community.name[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{fontFamily: "var(--font-playfair)"}}>
                n/{community.name}
              </h1>
              {community.description && (
                <p className="opacity-90 mt-1">{community.description}</p>
              )}
              <p className="opacity-75 text-sm mt-1">{community.posts.length} posts</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Posts List */}
          <div className="lg:col-span-2">

            {/* Sort Buttons */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Link
                  href={`/n/${slug}`}
                  className="px-4 py-2 rounded-xl font-medium text-sm transition-all"
                  style={{
                    backgroundColor: !sort || sort === "latest" ? "#0B3954" : "#E0E1DD",
                    color: !sort || sort === "latest" ? "white" : "#0B3954",
                  }}
                >
                  Latest
                </Link>
                <Link
                  href={`/n/${slug}?sort=popular`}
                  className="px-4 py-2 rounded-xl font-medium text-sm transition-all"
                  style={{
                    backgroundColor: sort === "popular" ? "#0B3954" : "#E0E1DD",
                    color: sort === "popular" ? "white" : "#0B3954",
                  }}
                >
                  Most Popular
                </Link>
              </div>
              <Link
                href={`/n/${slug}/create-post`}
                className="px-4 py-2 text-white rounded-xl font-medium hover:opacity-90 transition-opacity text-sm"
                style={{backgroundColor: "#087E8B"}}
              >
                + Create Post
              </Link>
            </div>

            {community.posts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border" style={{borderColor: "#E0E1DD"}}>
                <span className="text-5xl mb-4 block">📝</span>
                <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>No posts yet</h3>
                <p style={{color: "#7A6263"}}>Be the first to post in this community!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {community.posts.map((post) => (
                  <Link key={post.id} href={`/n/${slug}/${post.id}`}>
                    <div className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all" style={{borderColor: "#E0E1DD"}}>
                      <h3 className="font-bold text-lg mb-2" style={{color: "#0B3954"}}>{post.title}</h3>
                      <p className="text-sm line-clamp-2" style={{color: "#7A6263"}}>{post.content}</p>
                      <div className="flex items-center gap-4 mt-4 text-sm" style={{color: "#7A6263"}}>
                        <span>👤 {post.author.username}</span>
                        <span>{post._count.votes} votes</span>
                        <span>{post._count.comments} comments</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border" style={{borderColor: "#E0E1DD"}}>
              <h3 className="font-bold mb-3" style={{color: "#0B3954"}}>About n/{community.name}</h3>
              <p className="text-sm" style={{color: "#7A6263"}}>
                {community.description || "A community on Nexus."}
              </p>
              <div className="mt-4 pt-4" style={{borderTop: "1px solid #E0E1DD"}}>
                <p className="text-sm" style={{color: "#7A6263"}}>
                  📅 Created {new Date(community.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/n/${slug}/create-post`}
                className="mt-4 block w-full py-3 text-white rounded-xl font-bold hover:opacity-90 transition-opacity text-center"
                style={{backgroundColor: "#087E8B"}}
              >
                + Create Post
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}