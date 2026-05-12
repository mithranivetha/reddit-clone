"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ postId, authorClerkId, communitySlug }) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSignedIn || user?.id !== authorClerkId) return null;

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch("/api/delete/post", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, clerkId: user.id }),
      });
      router.push(`/n/${communitySlug}`);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="relative">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{backgroundColor: "#E0E1DD", color: "#7A6263"}}
        >
          <i className="fa-regular fa-trash-can"></i>
          Delete
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{color: "#7A6263"}}>Are you sure?</span>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{backgroundColor: "#7A6263"}}
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-3 py-2 rounded-xl text-sm font-medium"
            style={{backgroundColor: "#E0E1DD", color: "#0B3954"}}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}