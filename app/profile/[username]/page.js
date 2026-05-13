export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditBioForm from "@/components/EditBioForm";

export default async function ProfilePage({ params }) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          community: true,
          _count: { select: { votes: true, comments: true } },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{backgroundColor: "#E0E1DD"}}>
      <div className="max-w-4xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8" style={{border: "1px solid #E0E1DD"}}>
          
          {/* Banner */}
          <div className="h-24 w-full" style={{backgroundColor: "#0B3954"}}></div>

          {/* Avatar and Info */}
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-10 mb-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl border-4 border-white"
                style={{backgroundColor: "#087E8B"}}
              >
                {user.username[0].toUpperCase()}
              </div>
              <EditBioForm
                clerkId={user.clerkId}
                currentBio={user.bio || ""}
                username={user.username}
              />
            </div>

            <h1
              className="text-3xl font-bold mb-1"
              style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
            >
              {user.username}
            </h1>
            <p className="text-sm mb-4" style={{color: "#7A6263"}}>
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.bio ? (
              <p className="leading-relaxed" style={{color: "#7A6263"}}>{user.bio}</p>
            ) : (
              <p className="italic" style={{color: "#7A6263"}}>No bio yet.</p>
            )}

            {/* Stats */}
            <div className="flex gap-6 mt-6 pt-6" style={{borderTop: "1px solid #E0E1DD"}}>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{color: "#0B3954"}}>{user.posts.length}</p>
                <p className="text-sm" style={{color: "#7A6263"}}>Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{color: "#0B3954"}}>
                  {user.posts.reduce((acc, post) => acc + post._count.votes, 0)}
                </p>
                <p className="text-sm" style={{color: "#7A6263"}}>Total Votes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{color: "#0B3954"}}>
                  {user.posts.reduce((acc, post) => acc + post._count.comments, 0)}
                </p>
                <p className="text-sm" style={{color: "#7A6263"}}>Total Comments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <h2
          className="text-2xl font-bold mb-6"
          style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
        >
          Posts by {user.username}
        </h2>

        {user.posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center" style={{border: "1px solid #E0E1DD"}}>
            <i className="fa-regular fa-newspaper text-5xl mb-4 block" style={{color: "#E0E1DD"}}></i>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>No posts yet</h3>
            <p style={{color: "#7A6263"}}>This user hasn't posted anything yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {user.posts.map((post) => (
              <Link key={post.id} href={`/n/${post.community.slug}/${post.id}`}>
                <div className="bg-white rounded-2xl p-6 border hover:shadow-md hover:-translate-y-1 transition-all" style={{borderColor: "#E0E1DD"}}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="font-bold px-3 py-1 rounded-full text-xs"
                      style={{backgroundColor: "#E0E1DD", color: "#087E8B"}}
                    >
                      n/{post.community.name}
                    </span>
                    <span className="text-xs" style={{color: "#7A6263"}}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{color: "#0B3954"}}>{post.title}</h3>
                  <p className="text-sm line-clamp-2 mb-3" style={{color: "#7A6263"}}>{post.content}</p>
                  <div className="flex gap-4 text-xs pt-3" style={{color: "#7A6263", borderTop: "1px solid #E0E1DD"}}>
                    <span><i className="fa-solid fa-arrow-up mr-1"></i>{post._count.votes} votes</span>
                    <span><i className="fa-regular fa-comment mr-1"></i>{post._count.comments} comments</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}