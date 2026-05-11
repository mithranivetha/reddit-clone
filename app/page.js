import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home({ searchParams }) {
  const { tab } = await searchParams;
  const activeTab = tab || "recent";

  let posts = [];

  if (activeTab === "trending") {
    posts = await prisma.post.findMany({
      orderBy: { votes: { _count: "desc" } },
      take: 5,
      include: {
        author: true,
        community: true,
        _count: { select: { votes: true, comments: true } },
      },
    });
  } else {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
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
      <div className="text-white py-24 px-4" style={{backgroundColor: "#0B3954"}}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6" style={{fontFamily: "var(--font-playfair)"}}>
            Welcome to Nexus
          </h1>
          <p className="text-xl mb-8 opacity-90">
            A modern community platform to share ideas, ask questions, and connect with people who share your interests.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/communities"
              className="px-8 py-3 rounded-xl font-bold transition-all"
              style={{backgroundColor: "#087E8B", color: "white"}}
            >
              Browse Communities
            </Link>
            <Link
              href="/sign-up"
              className="px-8 py-3 rounded-xl font-bold transition-all border-2"
              style={{borderColor: "#E0E1DD", color: "#E0E1DD"}}
            >
              Join Nexus
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}>
          Why Nexus?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{backgroundColor: "white"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: "#0B3954"}}>
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>Discuss</h3>
            <p style={{color: "#7A6263"}}>Join conversations on topics you care about with people who share your passion.</p>
          </div>
          <div className="rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{backgroundColor: "white"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: "#087E8B"}}>
              <span className="text-2xl">🏷️</span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>Discover</h3>
            <p style={{color: "#7A6263"}}>Find posts by tags, search topics, and explore communities that match your interests.</p>
          </div>
          <div className="rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow" style={{backgroundColor: "white"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: "#0B3954"}}>
              <span className="text-2xl">⬆️</span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>Vote</h3>
            <p style={{color: "#7A6263"}}>Upvote great content and help the best ideas rise to the top of every community.</p>
          </div>
        </div>
      </div>

      {/* Posts Feed Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}>
            Latest from Nexus
          </h2>
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
          <div className="bg-white rounded-2xl p-12 text-center" style={{border: "1px solid #E0E1DD"}}>
            <span className="text-5xl mb-4 block">📝</span>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>No posts yet</h3>
            <p style={{color: "#7A6263"}}>Be the first to create a community and post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/n/${post.community.slug}/${post.id}`}>
                <div className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all h-full" style={{borderColor: "#E0E1DD"}}>
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <span
                      className="font-bold px-2 py-1 rounded-lg text-xs"
                      style={{backgroundColor: "#E0E1DD", color: "#087E8B"}}
                    >
                      n/{post.community.name}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2" style={{color: "#0B3954"}}>
                    {post.title}
                  </h3>
                  <p className="text-sm line-clamp-2 mb-3" style={{color: "#7A6263"}}>
                    {post.content}
                  </p>
                  <div className="flex gap-4 text-xs mt-auto" style={{color: "#7A6263"}}>
                    <span>{post._count.votes} votes</span>
                    <span>{post._count.comments} comments</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* See all posts link */}
        <div className="text-center mt-8">
          <Link
            href="/communities"
            className="px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity text-white"
            style={{backgroundColor: "#087E8B"}}
          >
            Explore All Communities →
          </Link>
        </div>
      </div>

    </div>
  );
}