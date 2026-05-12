"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function DeleteCommentButton({ commentId, authorClerkId }) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSignedIn || user?.id !== authorClerkId) return null;

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch("/api/delete/comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, clerkId: user.id }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <div>
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-xs hover:opacity-70 transition-opacity"
          style={{color: "#7A6263"}}
        >
          <i className="fa-regular fa-trash-can"></i> Delete
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{color: "#7A6263"}}>Sure?</span>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs px-2 py-1 rounded-lg text-white disabled:opacity-50"
            style={{backgroundColor: "#7A6263"}}
          >
            {loading ? "..." : "Yes"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-xs px-2 py-1 rounded-lg"
            style={{backgroundColor: "#E0E1DD", color: "#0B3954"}}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}