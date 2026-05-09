"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSync() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/sync-user").catch(console.error);
    }
  }, [isSignedIn]);

  return null;
}