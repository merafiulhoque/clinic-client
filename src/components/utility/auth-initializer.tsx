"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/shared/stores/auth-store";
import { getMeAction } from "@/actions/auth/me";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    async function fetchUser() {
      // Only fetch if we don't already have the user in Zustand
      if (!user) {
        const me = await getMeAction();
        if (me) {
          setUser(me);
        }
      }
    }
    fetchUser();
  }, [user, setUser]);

  return <>{children}</>;
}