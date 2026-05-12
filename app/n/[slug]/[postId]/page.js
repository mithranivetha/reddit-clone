import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import VoteButtons from "@/components/VoteButtons";
import CommentForm from "@/components/CommentForm";
import BookmarkButton from "@/components/BookmarkButton";
import DeletePostButton from "@/components/DeletePostButton";
import DeleteCommentButton from "@/components/DeleteCommentButton";

export default async function PostPage({ params }) {
  const { slug, postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      community: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
      votes: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{backgroundColor: "#E0E1DD"}}>
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link
          href={`/n/${slug}`}
          className="flex items-center gap-2 mb-6 font-medium hover:opacity-70 transition-opacity"
          style={{color: "#087E8B"}}
        >
          ← Back to n/{slug}
        </Link>

        {/* Post Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6" style={{border: "1px solid #E0E1DD"}}>
          
          {/* Community + Author */}
          <div className="flex items-center gap-2 mb-4 text-sm" style={{color: "#7A6263"}}>
            <Link
              href={`/n/${slug}`}
              className="font-bold hover:opacity-70"
              style={{color: "#087E8B"}}
            >
              n/{post.community.name}
            </Link>
            <span>•</span>
            <span>Posted by {post.author.username}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl font-bold mb-4"
            style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
          >
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm text-white"
                  style={{backgroundColor: "#087E8B"}}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <p className="text-lg leading-relaxed mb-6" style={{color: "#7A6263"}}>
            {post.content}
          </p>

          {/* Vote Buttons + Comment count */}
          <div
            className="flex items-center gap-6 pt-4 flex-wrap"
            style={{borderTop: "1px solid #E0E1DD"}}
          >
            <VoteButtons postId={post.id} />
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-comment" style={{color: "#7A6263"}}></i>
              <span className="font-bold" style={{color: "#0B3954"}}>
                {post.comments.length} comments
              </span>
            </div>
            <BookmarkButton postId={post.id} />
            <DeletePostButton
              postId={post.id}
              authorClerkId={post.author.clerkId}
              communitySlug={slug}
            />
          </div>
        </div>  

        {/* Comments Section */}
        <div
          className="bg-white rounded-2xl p-8 shadow-sm"
          style={{border: "1px solid #E0E1DD"}}
        >
          <h2
            className="text-xl font-bold mb-6"
            style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
          >
            Comments ({post.comments.length})
          </h2>

          <CommentForm postId={post.id} />

          {post.comments.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-3 block">💬</span>
              <p style={{color: "#7A6263"}}>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-xl"
                  style={{backgroundColor: "#E0E1DD"}}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{color: "#0B3954"}}>
                        {comment.author.username}
                      </span>
                      <span className="text-xs" style={{color: "#7A6263"}}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <DeleteCommentButton
                      commentId={comment.id}
                      authorClerkId={comment.author.clerkId}
                    />
                  </div>
                  <p style={{color: "#7A6263"}}>{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}