"use client";

import Link from "next/link";
import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";

export default function NotFound() {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    return (
        <div
            className={`relative min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-500 ${
                isDark ? "bg-black text-white" : "bg-[#fdfcfb] text-black"
            }`}
        >
            {/* ===== Background Decor ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className={`absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-30 ${
                        isDark ? "bg-emerald-500" : "bg-amber-200"
                    }`}
                />
                <div
                    className={`absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-25 ${
                        isDark ? "bg-amber-400" : "bg-indigo-300"
                    }`}
                />
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* ===== Card ===== */}
            <div
                className={`relative z-10 w-full max-w-md p-8 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-sm text-center animate-fade-slide-up ${
                    isDark
                        ? "bg-zinc-900/80 border-emerald-500/20 shadow-emerald-500/5"
                        : "bg-white border-amber-200 shadow-indigo-500/5"
                }`}
            >
                {/* Big 404 */}
                <div className="relative mb-4">
                    <h1
                        className={`text-7xl sm:text-8xl font-black tracking-tighter leading-none bg-clip-text text-transparent ${
                            isDark
                                ? "bg-gradient-to-br from-emerald-400 via-amber-300 to-emerald-500"
                                : "bg-gradient-to-br from-indigo-500 via-amber-500 to-indigo-600"
                        }`}
                    >
                        404
                    </h1>
                    <div
                        className={`mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full ring-2 ${
                            isDark
                                ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-400"
                                : "bg-indigo-500/10 ring-indigo-500/30 text-indigo-500"
                        }`}
                    >
                        <FileQuestion className="h-6 w-6" />
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-5">
                    Error: Page{" "}
                    <span
                        className={`bg-clip-text text-transparent ${
                            isDark
                                ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                : "bg-gradient-to-r from-indigo-500 to-amber-500"
                        }`}
                    >
                        Not Found
                    </span>
                </h2>

                {/* Subtext */}
                <p
                    className={`mt-3 text-sm leading-relaxed ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                >
                    *** If this is a proposed feature, it will be live soon
                </p>

                {/* Divider */}
                <div
                    className={`my-6 h-px w-16 mx-auto bg-gradient-to-r ${
                        isDark
                            ? "from-transparent via-emerald-400/50 to-transparent"
                            : "from-transparent via-indigo-400/50 to-transparent"
                    }`}
                />

                {/* Back to Home */}
                <button
                    onClick={() => history.back()}
                    className={`group inline-flex items-center justify-center gap-2 w-full sm:w-auto h-11 px-7 rounded-lg text-sm font-semibold
                    transition-all duration-200 ease-out
                    hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    ${
                        isDark
                            ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-900"
                            : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                    }`}
                >
                    <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    Back to Home
                </button>
            </div>
        </div>
    );
}