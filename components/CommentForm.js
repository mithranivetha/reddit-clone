"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CommentForm({ postId }) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isSignedIn) {
    return (
      <div
        className="p-4 rounded-xl text-center mb-6"
        style={{backgroundColor: "#E0E1DD"}}
      >
        <p style={{color: "#7A6263"}}>
          <a href="/sign-in" style={{color: "#087E8B", fontWeight: "bold"}}>
            Sign in
          </a>{" "}
          to leave a comment
        </p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content,
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          username: user.username || user.primaryEmailAddress.emailAddress.split("@")[0],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setContent("");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full px-4 py-3 rounded-xl border focus:outline-none text-gray-800 resize-none"
          style={{borderColor: "#E0E1DD"}}
          rows={3}
          required
        />
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="self-end px-6 py-2 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{backgroundColor: "#087E8B"}}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}