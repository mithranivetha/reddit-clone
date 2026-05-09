"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function CreatePostForm({ communityId, slug }) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center" style={{borderColor: "#E0E1DD"}}>
        <span className="text-4xl mb-3 block">🔒</span>
        <h3 className="font-bold mb-2" style={{color: "#0B3954"}}>
          Sign in to create a post
        </h3>
        <p style={{color: "#7A6263"}}>You need to be signed in to post.</p>
      </div>
    );
  }

  function handleAddTag(e) {
    e.preventDefault();
    const cleaned = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
      setTags([...tags, cleaned]);
      setTagInput("");
    }
  }

  function handleRemoveTag(tag) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          tags,
          communityId,
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          username: user.username || user.primaryEmailAddress.emailAddress.split("@")[0],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push(`/r/${slug}/${data.id}`);
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm" style={{border: "1px solid #E0E1DD"}}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{color: "#0B3954"}}>
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 rounded-xl border focus:outline-none text-gray-800"
            style={{borderColor: "#E0E1DD"}}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{color: "#0B3954"}}>
            Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, ideas, or questions..."
            className="w-full px-4 py-3 rounded-xl border focus:outline-none text-gray-800 resize-none"
            style={{borderColor: "#E0E1DD"}}
            rows={6}
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{color: "#0B3954"}}>
            Tags (optional, max 5)
          </label>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm text-white flex items-center gap-1"
                  style={{backgroundColor: "#087E8B"}}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:opacity-70"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag e.g. javascript"
              className="flex-1 px-4 py-2 rounded-xl border focus:outline-none text-gray-800"
              style={{borderColor: "#E0E1DD"}}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
              style={{backgroundColor: "#0B3954"}}
            >
              Add
            </button>
          </div>
          <p className="text-xs mt-1" style={{color: "#7A6263"}}>
            Press Add after each tag
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{backgroundColor: "#087E8B"}}
        >
          {loading ? "Posting..." : "Create Post"}
        </button>

      </form>
    </div>
  );
}