"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function BookmarkButton({ postId }) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkBookmark() {
      if (!isSignedIn || !user) return;
      try {
        const res = await fetch(`/api/bookmarks?postId=${postId}&clerkId=${user.id}`);
        const data = await res.json();
        setIsBookmarked(data.isBookmarked);
      } catch (error) {
        console.error(error);
      }
    }
    checkBookmark();
  }, [isSignedIn, user, postId]);

  async function handleBookmark() {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const newState = !isBookmarked;
    setIsBookmarked(newState);
    setLoading(true);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          username: user.username || user.primaryEmailAddress.emailAddress.split("@")[0],
        }),
      });
      const data = await res.json();
      setIsBookmarked(data.isBookmarked);
    } catch (error) {
      console.error(error);
      setIsBookmarked(!newState);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
      style={{
        backgroundColor: isBookmarked ? "#087E8B" : "#E0E1DD",
        color: isBookmarked ? "white" : "#0B3954",
      }}
    >
      <i className={`fa-${isBookmarked ? "solid" : "regular"} fa-bookmark`}></i>
      {isBookmarked ? "Saved" : "Save"}
    </button>
  );
}