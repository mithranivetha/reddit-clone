"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function CreateCommunityForm() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
        <span className="text-4xl mb-3 block">🔒</span>
        <h3 className="font-bold text-gray-800 mb-2">Sign in to create a community</h3>
        <p className="text-gray-600 text-sm">Join Nexus to start your own community.</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push(`/r/${data.slug}`);
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create a Community</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Community Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. webdev"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800"
            required
          />
          <p className="text-xs text-gray-500 mt-1">No spaces. Lowercase only.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this community about?"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 resize-none"
            rows={3}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50" style={{backgroundColor: "#087E8B"}}
        >
          {loading ? "Creating..." : "Create Community"}
        </button>
      </form>
    </div>
  );
}