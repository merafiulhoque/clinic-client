"use client";

import Link from "next/link";
import { ArrowRight, Activity, Stethoscope, UserSquare2, Users } from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { FALLBACK_ACCENT, MODULE_ACCENTS, MODULES } from "@/shared/config/modules/ownerMainModule";
import { useThemeStore } from "@/shared/stores/theme-store";



export default function OwnerDashboardPage() {
    const { activeClinic } = useClinicStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const stats = [
        { label: "Total Doctors", value: "0", Icon: Stethoscope },
        { label: "Active Staff", value: "0", Icon: Users },
        { label: "Today's Appointments", value: "0", Icon: Activity },
    ];

    return (
        <div className="space-y-8">

            {/* ===== Page Header ===== */}
            <div className="flex flex-col gap-2 animate-fade-slide-up">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Owner{" "}
                    <span
                        className={`bg-clip-text text-transparent ${
                            isDark
                                ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                : "bg-gradient-to-r from-indigo-500 to-amber-500"
                        }`}
                    >
                        Dashboard
                    </span>
                </h1>
                <p className={`text-sm sm:text-base ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    Overview and management modules for{" "}
                    <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-sm font-semibold ring-1 ${
                            isDark
                                ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                                : "bg-indigo-50 text-indigo-600 ring-indigo-200"
                        }`}
                    >
                        {activeClinic?.clinicName || "your clinic"}
                    </span>
                    .
                </p>
            </div>

            {/* ===== Quick Stats ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stats.map((stat, i) => {
                    const { Icon } = stat;
                    return (
                        <div
                            key={i}
                            style={{ animationDelay: `${i * 60}ms` }}
                            className={`p-6 rounded-xl border shadow-sm flex items-center justify-between
                            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-fade-slide-up
                            ${
                                isDark
                                    ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-400/50"
                                    : "bg-white border-amber-200 shadow-indigo-500/5 hover:border-indigo-300"
                            }`}
                        >
                            <div>
                                <p
                                    className={`text-sm font-medium ${
                                        isDark ? "text-zinc-400" : "text-zinc-600"
                                    }`}
                                >
                                    {stat.label}
                                </p>
                                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                            </div>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                    isDark
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-indigo-500/10 text-indigo-500"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ===== Management Modules ===== */}
            <div className="animate-fade-slide-up" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-xl font-semibold mb-4">Management Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULES.map((module, index) => {
                        const Icon = module.icon;
                        const accent = MODULE_ACCENTS[module.title] || FALLBACK_ACCENT;

                        return (
                            <Link
                                key={module.title}
                                href={module.href}
                                style={{ animationDelay: `${index * 60}ms` }}
                                className={`group relative p-6 rounded-xl border shadow-sm flex flex-col
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
                                <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                                        isDark ? accent.bgDark : accent.bgLight
                                    }`}
                                >
                                    <Icon
                                        className={`w-6 h-6 ${
                                            isDark ? accent.iconDark : accent.iconLight
                                        }`}
                                    />
                                </div>

                                <h3 className="text-lg font-semibold mb-2">
                                    {module.title}
                                </h3>

                                <p
                                    className={`text-sm flex-1 ${
                                        isDark ? "text-zinc-400" : "text-zinc-600"
                                    }`}
                                >
                                    {module.description}
                                </p>

                                <div
                                    className={`mt-6 flex items-center text-sm font-medium
                                    opacity-100 md:opacity-80 md:group-hover:opacity-100
                                    transition-all duration-200
                                    ${isDark ? "text-emerald-400" : "text-indigo-600"}`}
                                >
                                    Open Module
                                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}