"use client";

import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    UserPlus,
    Users,
    ArrowLeftRight,
    UserCog,
} from "lucide-react";
import { CARD_ACCENTS, CARD_ICONS, CLINIC_MEMBER_MODULE_OPTIONS } from "@/shared/config/modules/owner_modules/clinicMemberModule";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";



export default function StaffModulePage() {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    return (
        <div className="relative isolate space-y-8 sm:space-y-10">

            {/* ===== Header ===== */}
            <div className="flex flex-col gap-6 animate-fade-slide-up">

                <Link
                    href={APP_URLS.OWNER_DASHBOARD}
                    className={`group inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    ${
                        isDark
                            ? "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                            : "border-zinc-300 bg-white text-zinc-600 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                    }`}
                >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col gap-3">
                    {/* Owner · Modules badge */}
                    <div
                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 ${
                            isDark
                                ? "border-emerald-500/20 bg-emerald-500/5"
                                : "border-amber-200 bg-amber-50"
                        }`}
                    >
                        <span className="relative flex h-1.5 w-1.5">
                            <span
                                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                                    isDark ? "bg-emerald-400" : "bg-indigo-500"
                                }`}
                            />
                            <span
                                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                                    isDark ? "bg-emerald-400" : "bg-indigo-500"
                                }`}
                            />
                        </span>
                        <span
                            className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                                isDark ? "text-emerald-300" : "text-indigo-600"
                            }`}
                        >
                            Owner · Modules
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                            Staff{" "}
                            <span
                                className={`bg-clip-text text-transparent ${
                                    isDark
                                        ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                        : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                }`}
                            >
                                Management
                            </span>
                        </h1>
                        <p
                            className={`max-w-xl text-sm sm:text-base ${
                                isDark ? "text-zinc-400" : "text-zinc-600"
                            }`}
                        >
                            Manage your clinic members, roles, and assignments.
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== Section Label ===== */}
            <div
                className={`flex items-end justify-between gap-4 border-b pb-3 animate-fade-slide-up ${
                    isDark ? "border-emerald-500/10" : "border-amber-200/60"
                }`}
                style={{ animationDelay: "0.1s" }}
            >
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold tracking-tight">Quick actions</h2>
                    <span
                        className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${
                            isDark
                                ? "border-zinc-700 bg-zinc-900/50 text-zinc-400"
                                : "border-zinc-300 bg-white text-zinc-600"
                        }`}
                    >
                        {CLINIC_MEMBER_MODULE_OPTIONS.length}
                    </span>
                </div>
                <span
                    className={`hidden sm:block text-[11px] ${
                        isDark ? "text-zinc-500" : "text-zinc-500"
                    }`}
                >
                    Select a task to continue
                </span>
            </div>

            {/* ===== Actionable Task Grid ===== */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {CLINIC_MEMBER_MODULE_OPTIONS.map((option, i) => {
                    const Icon = CARD_ICONS[i % CARD_ICONS.length];
                    const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];

                    return (
                        <Link
                            key={option.href}
                            href={option.href}
                            style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                            className={`group relative flex flex-col overflow-hidden rounded-2xl border p-6 text-left
                            transition-all duration-200 ease-out
                            hover:-translate-y-1 hover:shadow-lg
                            active:translate-y-0 active:scale-[0.99]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            animate-fade-slide-up
                            ${
                                isDark
                                    ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-400/60 hover:shadow-emerald-500/10 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                    : "bg-white border-amber-200 shadow-indigo-500/5 hover:border-indigo-400/60 hover:shadow-indigo-500/10 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                            }`}
                        >
                            {/* Top accent line */}
                            <div
                                className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                                    isDark ? accent.lineDark : accent.lineLight
                                }`}
                            />

                            {/* Ghost index */}
                            <span
                                className={`pointer-events-none absolute right-4 top-2 select-none text-4xl sm:text-5xl font-bold leading-none ${
                                    isDark ? "text-white/[0.06]" : "text-black/[0.05]"
                                }`}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </span>

                            {/* Icon */}
                            <div
                                className={`relative mb-5 flex h-11 w-11 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105 ${
                                    isDark
                                        ? `${accent.bgDark} ${accent.ringDark} ${accent.iconDark}`
                                        : `${accent.bgLight} ${accent.ringLight} ${accent.iconLight}`
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>

                            <h3 className="relative mb-1.5 text-lg font-semibold tracking-tight">
                                {option.title}
                            </h3>

                            <p
                                className={`relative mb-6 flex-1 text-sm leading-relaxed ${
                                    isDark ? "text-zinc-400" : "text-zinc-600"
                                }`}
                            >
                                {option.description}
                            </p>

                            <div
                                className={`relative mt-auto flex items-center justify-between border-t pt-4 ${
                                    isDark ? "border-zinc-800" : "border-amber-200/60"
                                }`}
                            >
                                <span
                                    className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                        isDark ? "text-zinc-500" : "text-zinc-500"
                                    }`}
                                >
                                    Open
                                </span>
                                <span
                                    className={`flex items-center text-sm font-medium ${
                                        isDark ? accent.iconDark : accent.iconLight
                                    }`}
                                >
                                    Proceed
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}