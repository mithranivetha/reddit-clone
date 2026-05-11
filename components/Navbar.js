"use client";

import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function ProfileLink() {
  const { user, isSignedIn } = useUser();
  const [profileUsername, setProfileUsername] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!isSignedIn || !user) return;
      try {
        const res = await fetch(`/api/profile/me?clerkId=${user.id}`);
        const data = await res.json();
        if (data.username) {
          setProfileUsername(data.username);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchProfile();
  }, [isSignedIn, user]);

  const href = profileUsername ? `/profile/${profileUsername}` : "/profile-setup";

  return (
    <Link href={href} className="font-medium hover:opacity-80" style={{color: "#E0E1DD"}}>
      Profile
    </Link>
  );
}

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-sm" style={{backgroundColor: "#0B3954"}}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: "#087E8B"}}>
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-xl font-bold" style={{color: "#E0E1DD", fontFamily: "var(--font-playfair)"}}>
            Nexus
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{backgroundColor: "rgba(255,255,255,0.1)"}}>
            <i className="fa-solid fa-magnifying-glass text-sm" style={{color: "#E0E1DD"}}></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Nexus..."
              className="flex-1 bg-transparent focus:outline-none text-sm"
              style={{color: "#E0E1DD"}}
            />
            <button type="submit" className="hidden">Search</button>
          </div>
        </form>

        {/* Middle Links */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          <Link href="/" className="font-medium transition-colors hover:opacity-80" style={{color: "#E0E1DD"}}>
            Home
          </Link>
          <Link href="/communities" className="font-medium transition-colors hover:opacity-80" style={{color: "#E0E1DD"}}>
            Communities
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {!isSignedIn ? (
            <>
              <Link href="/sign-in" className="px-4 py-2 rounded-lg font-medium transition-colors border" style={{color: "#E0E1DD", borderColor: "#E0E1DD"}}>
                Sign In
              </Link>
              <Link href="/sign-up" className="px-4 py-2 rounded-lg font-medium transition-opacity text-white" style={{backgroundColor: "#087E8B"}}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link href="/communities" className="px-4 py-2 rounded-lg font-medium transition-opacity text-white" style={{backgroundColor: "#087E8B"}}>
                + Post
              </Link>
              <ProfileLink />
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>

      </div>
    </nav>
  );
}