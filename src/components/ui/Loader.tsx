"use client";

// src/shared/components/ui/full-screen-loader.tsx
import { Loader2 } from "lucide-react";
import { useThemeStore } from "@/shared/stores/theme-store";

interface FullScreenLoaderProps {
    message?: string;
}

export default function FullScreenLoader({ message = "Loading..." }: FullScreenLoaderProps) {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-colors duration-300 animate-fade-in ${
                isDark ? "bg-black/80 text-white" : "bg-[#fdfcfb]/80 text-black"
            }`}
        >
            {/* Glow blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className={`absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-20 ${
                        isDark ? "bg-emerald-500" : "bg-amber-200"
                    }`}
                />
                <div
                    className={`absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-20 ${
                        isDark ? "bg-amber-400" : "bg-indigo-300"
                    }`}
                />
            </div>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center gap-5 animate-fade-slide-up">
                {/* Logo + pulse ring */}
                <div className="relative">
                    <span
                        className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
                            isDark ? "bg-emerald-500" : "bg-indigo-500"
                        }`}
                    />
                    <div
                        className={`relative p-4 rounded-full ${
                            isDark
                                ? "bg-zinc-900 ring-2 ring-emerald-500/30"
                                : "bg-white ring-2 ring-indigo-500/30"
                        }`}
                    >
                        <img
                            src="/favicon.ico"
                            alt="Clinic Logo"
                            className="h-10 w-10 rounded object-contain"
                        />
                    </div>
                </div>

                {/* Spinner + message */}
                <div className="flex items-center gap-2">
                    <Loader2
                        className={`h-5 w-5 animate-spin ${
                            isDark ? "text-emerald-400" : "text-indigo-600"
                        }`}
                    />
                    <span
                        className={`text-sm font-medium ${
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        }`}
                    >
                        {message}
                    </span>
                </div>
            </div>
        </div>
    );
}