export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home({ searchParams }) {
  const { tab } = await searchParams;
  const activeTab = tab || "recent";

  let posts = [];

  if (activeTab === "trending") {
    posts = await prisma.post.findMany({
      orderBy: { votes: { _count: "desc" } },
      take: 6,
      include: {
        author: true,
        community: true,
        _count: { select: { votes: true, comments: true } },
      },
    });
  } else {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        author: true,
        community: true,
        _count: { select: { votes: true, comments: true } },
      },
    });
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: "#E0E1DD"}}>

      {/* Hero Section */}
      <div className="text-white py-28 px-4 relative overflow-hidden" style={{backgroundColor: "#0B3954"}}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 leading-tight" style={{fontFamily: "var(--font-playfair)"}}>
            Where Ideas
            <span style={{color: "#087E8B"}}> Connect</span>
          </h1>
          <p className="text-xl mb-10 opacity-80 max-w-2xl mx-auto leading-relaxed">
            A modern community platform to share ideas, ask questions, and connect with people who share your interests.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/communities"
              className="px-8 py-4 rounded-xl font-bold transition-all hover:opacity-90 text-white"
              style={{backgroundColor: "#087E8B"}}
            >
              Browse Communities
            </Link>
            <Link
              href="/sign-up"
              className="px-8 py-4 rounded-xl font-bold transition-all border-2 hover:bg-white hover:text-navy"
              style={{borderColor: "#E0E1DD", color: "#E0E1DD"}}
            >
              Join Nexus
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4" style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}>
          Why Nexus?
        </h2>
        <p className="text-center mb-12" style={{color: "#7A6263"}}>
          Everything you need to build and grow your community
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1" style={{backgroundColor: "white"}}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{backgroundColor: "#0B3954"}}>
              <i className="fa-solid fa-comments text-white text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3" style={{color: "#0B3954"}}>Discuss</h3>
            <p className="leading-relaxed" style={{color: "#7A6263"}}>Join conversations on topics you care about with people who share your passion.</p>
          </div>
          <div className="rounded-2xl p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1" style={{backgroundColor: "white"}}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{backgroundColor: "#087E8B"}}>
              <i className="fa-solid fa-magnifying-glass text-white text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3" style={{color: "#0B3954"}}>Discover</h3>
            <p className="leading-relaxed" style={{color: "#7A6263"}}>Find posts by tags, search topics, and explore communities that match your interests.</p>
          </div>
          <div className="rounded-2xl p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1" style={{backgroundColor: "white"}}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{backgroundColor: "#0B3954"}}>
              <i className="fa-solid fa-arrow-up text-white text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3" style={{color: "#0B3954"}}>Vote</h3>
            <p className="leading-relaxed" style={{color: "#7A6263"}}>Upvote great content and help the best ideas rise to the top of every community.</p>
          </div>
        </div>
      </div>

      {/* Posts Feed Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold" style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}>
              Latest from Nexus
            </h2>
            <p className="mt-1" style={{color: "#7A6263"}}>See what the community is talking about</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl font-medium text-sm transition-all"
              style={{
                backgroundColor: activeTab === "recent" ? "#0B3954" : "white",
                color: activeTab === "recent" ? "white" : "#0B3954",
              }}
            >
              Recent
            </Link>
            <Link
              href="/?tab=trending"
              className="px-4 py-2 rounded-xl font-medium text-sm transition-all"
              style={{
                backgroundColor: activeTab === "trending" ? "#0B3954" : "white",
                color: activeTab === "trending" ? "white" : "#0B3954",
              }}
            >
              Trending
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center">
            <i className="fa-regular fa-newspaper text-5xl mb-4 block" style={{color: "#E0E1DD"}}></i>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>No posts yet</h3>
            <p className="mb-6" style={{color: "#7A6263"}}>Be the first to create a community and post!</p>
            <Link
              href="/communities"
              className="px-6 py-3 text-white rounded-xl font-bold hover:opacity-90"
              style={{backgroundColor: "#087E8B"}}
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/n/${post.community.slug}/${post.id}`}>
                <div className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col" style={{borderColor: "#E0E1DD"}}>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="font-bold px-3 py-1 rounded-full text-xs"
                      style={{backgroundColor: "#E0E1DD", color: "#087E8B"}}
                    >
                      n/{post.community.name}
                    </span>
                    <span className="text-xs" style={{color: "#7A6263"}}>by {post.author.username}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 flex-1" style={{color: "#0B3954"}}>
                    {post.title}
                  </h3>
                  <p className="text-sm line-clamp-2 mb-4" style={{color: "#7A6263"}}>
                    {post.content}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full text-xs text-white"
                          style={{backgroundColor: "#087E8B"}}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4 text-xs pt-3" style={{color: "#7A6263", borderTop: "1px solid #E0E1DD"}}>
                    <span><i className="fa-solid fa-arrow-up mr-1"></i>{post._count.votes} votes</span>
                    <span><i className="fa-regular fa-comment mr-1"></i>{post._count.comments} comments</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/communities"
            className="px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity text-white inline-block"
            style={{backgroundColor: "#087E8B"}}
          >
            Explore All Communities →
          </Link>
        </div>
      </div>

    </div>
  );
}