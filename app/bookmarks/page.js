"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BookmarksPage() {
  const { isSignedIn, user } = useUser();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function fetchBookmarks() {
      if (!isSignedIn || !user) return;
      try {
        const res = await fetch(`/api/bookmarks/all?clerkId=${user.id}`);
        const data = await res.json();
        setBookmarks(data);
      } catch (error) {
        console.error(error);
      }
    }
    if (isSignedIn && user) {
      fetchBookmarks();
    }
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center" style={{backgroundColor: "#E0E1DD"}}>
        <div className="text-center">
          <span className="text-5xl mb-4 block">🔖</span>
          <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>Sign in to see your bookmarks</h3>
          <Link href="/sign-in" className="mt-4 inline-block px-6 py-3 text-white rounded-xl font-bold hover:opacity-90" style={{backgroundColor: "#087E8B"}}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{backgroundColor: "#E0E1DD"}}>
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-2"
          style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
        >
          Your Bookmarks
        </h1>
        <p className="mb-8" style={{color: "#7A6263"}}>
          Posts you've saved for later
        </p>

        {bookmarks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center" style={{border: "1px solid #E0E1DD"}}>
            <span className="text-5xl mb-4 block">🔖</span>
            <h3 className="text-xl font-bold mb-2" style={{color: "#0B3954"}}>No bookmarks yet</h3>
            <p style={{color: "#7A6263"}}>Save posts to read them later!</p>
            <Link
              href="/communities"
              className="mt-4 inline-block px-6 py-3 text-white rounded-xl font-bold hover:opacity-90"
              style={{backgroundColor: "#087E8B"}}
            >
              Browse Posts
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookmarks.map((bookmark) => (
              <Link
                key={bookmark.id}
                href={`/n/${bookmark.post.community.slug}/${bookmark.post.id}`}
              >
                <div className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all" style={{borderColor: "#E0E1DD"}}>
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <span className="font-bold" style={{color: "#087E8B"}}>
                      n/{bookmark.post.community.name}
                    </span>
                    <span style={{color: "#7A6263"}}>• by {bookmark.post.author.username}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{color: "#0B3954"}}>
                    {bookmark.post.title}
                  </h3>
                  <p className="text-sm line-clamp-2" style={{color: "#7A6263"}}>
                    {bookmark.post.content}
                  </p>
                  <div className="flex gap-4 text-sm mt-3" style={{color: "#7A6263"}}>
                    <span>{bookmark.post._count.votes} votes</span>
                    <span>{bookmark.post._count.comments} comments</span>
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