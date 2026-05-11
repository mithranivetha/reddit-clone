"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function EditBioForm({ clerkId, currentBio, username }) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [bio, setBio] = useState(currentBio);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only show edit form if this is the current user's profile
  const isOwnProfile = isSignedIn && user?.id === clerkId;

  if (!isOwnProfile) return null;

  async function handleSave() {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: user.id, bio }),
      });
      setEditing(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        style={{backgroundColor: "#E0E1DD", color: "#0B3954"}}
      >
        <i className="fa-regular fa-pen-to-square"></i> Edit Bio
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell the community about yourself..."
        className="w-full px-4 py-3 rounded-xl border focus:outline-none text-gray-800 resize-none"
        style={{borderColor: "#E0E1DD"}}
        rows={3}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
          style={{backgroundColor: "#087E8B"}}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{backgroundColor: "#E0E1DD", color: "#0B3954"}}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}