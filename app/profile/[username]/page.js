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
    <div className="min-h-screen py-8 px-4" style={{backgroundColor: "#E0E1DD"}}>
      <div className="max-w-4xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8" style={{border: "1px solid #E0E1DD"}}>
          <div className="flex items-start gap-6">
            
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shrink-0"
              style={{backgroundColor: "#0B3954"}}
            >
              {user.username[0].toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1
                className="text-3xl font-bold mb-1"
                style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
              >
                {user.username}
              </h1>
              <p className="text-sm mb-3" style={{color: "#7A6263"}}>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
              {user.bio && (
                <p style={{color: "#7A6263"}}>{user.bio}</p>
              )}
            </div>

          </div>

          {/* Edit Bio Form */}
          <div className="mt-6 pt-6" style={{borderTop: "1px solid #E0E1DD"}}>
            <EditBioForm
              clerkId={user.clerkId}
              currentBio={user.bio || ""}
              username={user.username}
            />
          </div>
        </div>

        {/* Posts */}
        <h2
          className="text-2xl font-bold mb-4"
          style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
        >
          Posts by {user.username}
        </h2>

        {user.posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center" style={{border: "1px solid #E0E1DD"}}>
            <span className="text-5xl mb-4 block">📝</span>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>No posts yet</h3>
            <p style={{color: "#7A6263"}}>This user hasn't posted anything yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {user.posts.map((post) => (
              <Link key={post.id} href={`/n/${post.community.slug}/${post.id}`}>
                <div className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all" style={{borderColor: "#E0E1DD"}}>
                  <div className="flex items-center gap-2 mb-2 text-sm" style={{color: "#087E8B"}}>
                    <span className="font-bold">n/{post.community.name}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{color: "#0B3954"}}>{post.title}</h3>
                  <p className="text-sm line-clamp-2 mb-3" style={{color: "#7A6263"}}>{post.content}</p>
                  <div className="flex gap-4 text-sm" style={{color: "#7A6263"}}>
                    <span>{post._count.votes} votes</span>
                    <span>{post._count.comments} comments</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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