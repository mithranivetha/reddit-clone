"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSync() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    async function syncUser() {
      if (!isSignedIn || !user) return;
      try {
        await fetch("/api/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress.emailAddress,
            username: user.username || user.primaryEmailAddress.emailAddress.split("@")[0],
          }),
        });
      } catch (error) {
        console.error(error);
      }
    }
    syncUser();
  }, [isSignedIn, user]);

  return null;
}