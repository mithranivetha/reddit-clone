"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ProfileSetupForm() {
  const { user } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          username,
          bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push(`/profile/${username}`);
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

        {/* Username */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{color: "#0B3954"}}>
            Username *
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
            placeholder="e.g. johndoe"
            className="w-full px-4 py-3 rounded-xl border focus:outline-none text-gray-800"
            style={{borderColor: "#E0E1DD"}}
            required
          />
          <p className="text-xs mt-1" style={{color: "#7A6263"}}>
            Lowercase only, no spaces. This will be your public identity on Nexus.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{color: "#0B3954"}}>
            Bio (optional)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community a bit about yourself..."
            className="w-full px-4 py-3 rounded-xl border focus:outline-none text-gray-800 resize-none"
            style={{borderColor: "#E0E1DD"}}
            rows={4}
          />
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
          {loading ? "Setting up..." : "Complete Setup"}
        </button>

      </form>
    </div>
  );
}