import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q || "";

  let posts = [];
  let communities = [];

  if (query) {
    posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { tags: { has: query.toLowerCase() } },
        ],
      },
      include: {
        author: true,
        community: true,
        _count: { select: { votes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    communities = await prisma.community.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        _count: { select: { posts: true } },
      },
    });
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{backgroundColor: "#E0E1DD"}}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1
          className="text-3xl font-bold mb-6"
          style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
        >
          Search Nexus
        </h1>

        {/* Search Form */}
        <form action="/search" method="GET" className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search posts, communities, tags..."
              className="flex-1 px-4 py-3 rounded-xl border focus:outline-none text-gray-800 bg-white"
              style={{borderColor: "#E0E1DD"}}
            />
            <button
              type="submit"
              className="px-6 py-3 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
              style={{backgroundColor: "#087E8B"}}
            >
              Search
            </button>
          </div>
        </form>

        {query && (
          <p className="mb-6 text-sm" style={{color: "#7A6263"}}>
            Showing results for <span className="font-bold" style={{color: "#0B3954"}}>"{query}"</span>
          </p>
        )}

        {/* Communities Results */}
        {communities.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-xl font-bold mb-4"
              style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
            >
              Communities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communities.map((community) => (
                <Link key={community.id} href={`/n/${community.slug}`}>
                  <div className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all" style={{borderColor: "#E0E1DD"}}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{backgroundColor: "#0B3954"}}
                      >
                        {community.name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold" style={{color: "#0B3954"}}>n/{community.name}</h3>
                        <p className="text-sm" style={{color: "#7A6263"}}>{community._count.posts} posts</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Posts Results */}
        {posts.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold mb-4"
              style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
            >
              Posts
            </h2>
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <Link key={post.id} href={`/n/${post.community.slug}/${post.id}`}>
                  <div className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all" style={{borderColor: "#E0E1DD"}}>
                    <div className="flex items-center gap-2 mb-2 text-sm" style={{color: "#087E8B"}}>
                      <span className="font-bold">n/{post.community.name}</span>
                      <span style={{color: "#7A6263"}}>• by {post.author.username}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{color: "#0B3954"}}>{post.title}</h3>
                    <p className="text-sm line-clamp-2 mb-3" style={{color: "#7A6263"}}>{post.content}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
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
                    <div className="flex gap-4 text-sm" style={{color: "#7A6263"}}>
                      <span>{post._count.votes} votes</span>
                      <span>{post._count.comments} comments</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {query && posts.length === 0 && communities.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>No results found</h3>
            <p style={{color: "#7A6263"}}>Try searching for something else!</p>
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>Search for anything</h3>
            <p style={{color: "#7A6263"}}>Find posts, communities and tags on Nexus</p>
          </div>
        )}

      </div>
    </div>
  );
}