"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function VoteButtons({ postId, votes, currentUserDbId }) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const upvotes = votes.filter((v) => v.type === "UP").length;
  const downvotes = votes.filter((v) => v.type === "DOWN").length;
  const score = upvotes - downvotes;

  const currentVote = currentUserDbId
    ? votes.find((v) => v.userId === currentUserDbId)
    : null;

  const [loading, setLoading] = useState(false);
  const [optimisticVote, setOptimisticVote] = useState(currentVote?.type || null);

  async function handleVote(type) {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    // Optimistic update — change color immediately
    if (optimisticVote === type) {
      setOptimisticVote(null);
    } else {
      setOptimisticVote(type);
    }

    setLoading(true);

    try {
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          type,
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          username: user.username || user.primaryEmailAddress.emailAddress.split("@")[0],
        }),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      setOptimisticVote(currentVote?.type || null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Upvote */}
      <button
        onClick={() => handleVote("UP")}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
        style={{
          backgroundColor: optimisticVote === "UP" ? "#087E8B" : "#E0E1DD",
          color: optimisticVote === "UP" ? "white" : "#0B3954",
        }}
      >
        <i className="fa-solid fa-arrow-up"></i> {upvotes}
      </button>

      {/* Score */}
      <span className="font-bold text-lg px-2" style={{color: "#0B3954"}}>
        {score}
      </span>

      {/* Downvote */}
      <button
        onClick={() => handleVote("DOWN")}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
        style={{
          backgroundColor: optimisticVote === "DOWN" ? "#7A6263" : "#E0E1DD",
          color: optimisticVote === "DOWN" ? "white" : "#0B3954",
        }}
      >
        <i className="fa-solid fa-arrow-down"></i> {downvotes}
      </button>
    </div>
  );
}