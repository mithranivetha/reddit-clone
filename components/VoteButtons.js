"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function VoteButtons({ postId }) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [voteData, setVoteData] = useState({ upvotes: 0, downvotes: 0, userVote: null });
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!postId) return;
    fetchVoteData();
  }, [postId, user]);

  useEffect(() => {
    if (isSignedIn !== undefined) {
        setReady(true);
    }
  }, [isSignedIn]);

  async function fetchVoteData() {
  try {
    const clerkId = user?.id || null;
    const url = clerkId
      ? `/api/votes/post?postId=${postId}&clerkId=${clerkId}`
      : `/api/votes/post?postId=${postId}`;
    const res = await fetch(url);
    const data = await res.json();
    setVoteData(data);
  } catch (error) {
    console.error(error);
  }
}

  async function handleVote(type) {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);

    // Optimistic update
    setVoteData((prev) => {
      const newData = { ...prev };
      if (prev.userVote === type) {
        // Toggle off
        newData.userVote = null;
        if (type === "UP") newData.upvotes = prev.upvotes - 1;
        if (type === "DOWN") newData.downvotes = prev.downvotes - 1;
      } else {
        if (prev.userVote === "UP") newData.upvotes = prev.upvotes - 1;
        if (prev.userVote === "DOWN") newData.downvotes = prev.downvotes - 1;
        newData.userVote = type;
        if (type === "UP") newData.upvotes = prev.upvotes + 1;
        if (type === "DOWN") newData.downvotes = prev.downvotes + 1;
      }
      return newData;
    });

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
      // Fetch fresh data after voting
      await fetchVoteData();
    } catch (error) {
      console.error(error);
      await fetchVoteData();
    } finally {
      setLoading(false);
    }
  }

  const score = voteData.upvotes - voteData.downvotes;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote("UP")}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
        style={{
          backgroundColor: voteData.userVote === "UP" ? "#087E8B" : "#E0E1DD",
          color: voteData.userVote === "UP" ? "white" : "#0B3954",
        }}
      >
        <i className="fa-solid fa-arrow-up"></i> {voteData.upvotes}
      </button>

      <span className="font-bold text-lg px-2" style={{color: "#0B3954"}}>
        {score}
      </span>

      <button
        onClick={() => handleVote("DOWN")}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
        style={{
          backgroundColor: voteData.userVote === "DOWN" ? "#7A6263" : "#E0E1DD",
          color: voteData.userVote === "DOWN" ? "white" : "#0B3954",
        }}
      >
        <i className="fa-solid fa-arrow-down"></i> {voteData.downvotes}
      </button>
    </div>
  );
}