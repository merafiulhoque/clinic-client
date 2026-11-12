"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/shared/stores/auth-store";
import { getMeAction } from "@/actions/auth/me";
import FullScreenLoader from "@/components/ui/Loader";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { user, setUser, clearUser } = useAuthStore();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        async function initializeAuth() {
            try {
                const me = await getMeAction();
                if (me) {
                    setUser(me);
                } else {
                    clearUser();
                }
            } catch {
                clearUser();
            } finally {
                setInitialized(true);
            }
        }

        initializeAuth();
    }, [setUser, clearUser]);

    if (!initialized) return <FullScreenLoader message="Loading your workspace..." />;

    return <>{children}</>;
}