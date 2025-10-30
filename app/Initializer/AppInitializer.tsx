"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { postUser } from "../lib/api"; // adjust path if needed

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Only run on first signup (e.g., created in last minute)
      if (user.createdAt) {
        const createdAt = new Date(user.createdAt);
        const now = new Date();
        if (
          now.getTime() - createdAt.getTime() < 60 * 1000 &&
          user.firstName &&
          user.lastName &&
          user.id
        ) {
          postUser(user.firstName, user.lastName, user.id);
        }
      }
    }
  }, [user, isLoaded]);

  return <>{children}</>;
}
