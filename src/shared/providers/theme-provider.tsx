"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/shared/stores/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme, mounted]);

    // Prevent rendering children until mounted to avoid server/client mismatch
    if (!mounted) {
        return <div className="invisible">{children}</div>;
    }

    return <>{children}</>;
}