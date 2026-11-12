"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Hospital,
    LogOut,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    X,
    ArrowLeftRight,
} from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useDoctorStore } from "@/shared/stores/doctor-store";
import { SIDEBAR_CONFIG } from "@/shared/config/constants/navigations";
import { signoutAction } from "@/actions/auth/signout";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { activeClinic, clearClinics } = useClinicStore();
    const { clearUser } = useAuthStore();
    const { clearDoctors } = useDoctorStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

    // Close mobile sheet on route change
    useEffect(() => {
        setIsMoreSheetOpen(false);
    }, [pathname]);

    if (!activeClinic) return null;

    const navItems = SIDEBAR_CONFIG[activeClinic.role as keyof typeof SIDEBAR_CONFIG] || [];

    const handleSignOut = async () => {
        await signoutAction();
        clearClinics();
        clearUser();
        clearDoctors();
        router.push(APP_URLS.SIGN_IN);
    };

    const isItemActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    // Bottom nav: first 4 items; More sheet: everything + footer actions
    const bottomNavItems = navItems.slice(0, 4);

    return (
        <>
            {/* ============================================================
                DESKTOP SIDEBAR
            ============================================================ */}
            <aside
                className={`hidden md:flex flex-col h-screen sticky top-0 border-r transition-all duration-300 ease-out shrink-0 ${
                    isCollapsed ? "w-16" : "w-64"
                } ${
                    isDark
                        ? "bg-zinc-950 border-emerald-500/10 text-white"
                        : "bg-white border-amber-200/60 text-black"
                }`}
            >
                {/* ===== Header ===== */}
                <div
                    className={`h-16 flex items-center border-b shrink-0 ${
                        isCollapsed ? "justify-center px-2" : "justify-between px-4"
                    } ${isDark ? "border-emerald-500/10" : "border-amber-200/60"}`}
                >
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <div
                            className={`p-2 rounded-lg shrink-0 ${
                                isDark
                                    ? "bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-300"
                                    : "bg-indigo-50 ring-1 ring-indigo-200 text-indigo-600"
                            }`}
                        >
                            <Hospital className="w-5 h-5" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col truncate min-w-0">
                                <span className="font-semibold text-sm truncate">
                                    {activeClinic.clinicName}
                                </span>
                                <span
                                    className={`text-xs capitalize truncate ${
                                        isDark ? "text-zinc-400" : "text-zinc-500"
                                    }`}
                                >
                                    {activeClinic.role.toLowerCase()} Panel
                                </span>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className={`p-1.5 rounded-md transition-colors shrink-0 ${
                                isDark
                                    ? "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                    : "text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50"
                            }`}
                            aria-label="Collapse sidebar"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Expand button (shown only when collapsed) */}
                {isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className={`mx-auto mt-2 p-1.5 rounded-md transition-colors ${
                            isDark
                                ? "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                : "text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50"
                        }`}
                        aria-label="Expand sidebar"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}

                {/* ===== Nav ===== */}
                <nav
                    className={`flex-1 overflow-y-auto flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none ${
                        isCollapsed ? "p-2 items-center" : "p-3"
                    }`}
                >
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isItemActive(item.href);

                        return (
                            <div key={item.title} className="relative group w-full">
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200
                                    ${isCollapsed ? "justify-center px-2 py-2.5 w-full" : "px-3 py-2.5"}
                                    ${
                                        active
                                            ? isDark
                                                ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-300 ring-1 ring-emerald-500/30"
                                                : "bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 text-indigo-600 ring-1 ring-indigo-200"
                                            : isDark
                                            ? "text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-200"
                                            : "text-zinc-700 hover:bg-amber-50 hover:text-indigo-600"
                                    }`}
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    {!isCollapsed && (
                                        <span className="truncate">{item.title}</span>
                                    )}
                                </Link>

                                {/* CSS tooltip — only when collapsed */}
                                {isCollapsed && (
                                    <div
                                        className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 ${
                                            isDark
                                                ? "bg-emerald-500 text-black"
                                                : "bg-indigo-600 text-white"
                                        }`}
                                    >
                                        {item.title}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* ===== Footer ===== */}
                <div
                    className={`border-t flex flex-col gap-2 shrink-0 ${
                        isCollapsed ? "p-2 items-center" : "p-3"
                    } ${isDark ? "border-emerald-500/10" : "border-amber-200/60"}`}
                >
                    {isCollapsed ? (
                        <>
                            <Link
                                href={APP_URLS.CLINIC_SELECTION}
                                className={`relative group p-2 rounded-lg transition-colors ${
                                    isDark
                                        ? "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                        : "text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50"
                                }`}
                                aria-label="Switch Clinic"
                            >
                                <ArrowLeftRight className="w-5 h-5" />
                                <div
                                    className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 ${
                                        isDark
                                            ? "bg-emerald-500 text-black"
                                            : "bg-indigo-600 text-white"
                                    }`}
                                >
                                    Switch Clinic
                                </div>
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className={`relative group p-2 rounded-lg transition-colors ${
                                    isDark
                                        ? "text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                                        : "text-zinc-500 hover:text-red-600 hover:bg-red-50"
                                }`}
                                aria-label="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                                <div
                                    className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 ${
                                        isDark
                                            ? "bg-red-500 text-white"
                                            : "bg-red-600 text-white"
                                    }`}
                                >
                                    Sign Out
                                </div>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href={APP_URLS.CLINIC_SELECTION}
                                className={`flex items-center justify-center gap-2 w-full py-2 text-sm font-medium rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                                    isDark
                                        ? "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400"
                                        : "border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                                }`}
                            >
                                <ArrowLeftRight className="w-4 h-4" />
                                Switch Clinic
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className={`flex items-center justify-center gap-2 w-full py-2 text-sm font-medium rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                                    isDark
                                        ? "border-zinc-700 text-zinc-300 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40"
                                        : "border-zinc-300 text-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                }`}
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            </aside>

            {/* ============================================================
                MOBILE BOTTOM NAV
            ============================================================ */}
            <nav
                className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md transition-colors duration-300 ${
                    isDark
                        ? "bg-zinc-950/95 border-emerald-500/20"
                        : "bg-white/95 border-amber-200/60"
                }`}
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                <div className="flex items-center justify-around h-16">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isItemActive(item.href);

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center gap-1 flex-1 h-full px-1 transition-colors duration-200 ${
                                    active
                                        ? isDark
                                            ? "text-emerald-300"
                                            : "text-indigo-600"
                                        : isDark
                                        ? "text-zinc-400 hover:text-emerald-200"
                                        : "text-zinc-500 hover:text-indigo-500"
                                }`}
                            >
                                {active && (
                                    <span
                                        className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full ${
                                            isDark ? "bg-emerald-400" : "bg-indigo-500"
                                        }`}
                                    />
                                )}
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium truncate max-w-full">
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More */}
                    <button
                        onClick={() => setIsMoreSheetOpen(true)}
                        className={`relative flex flex-col items-center justify-center gap-1 flex-1 h-full px-1 transition-colors duration-200 ${
                            isDark
                                ? "text-zinc-400 hover:text-emerald-200"
                                : "text-zinc-500 hover:text-indigo-500"
                        }`}
                    >
                        <MoreHorizontal className="w-5 h-5" />
                        <span className="text-[10px] font-medium">More</span>
                    </button>
                </div>
            </nav>

            {/* ============================================================
                MOBILE MORE SHEET
            ============================================================ */}
            {isMoreSheetOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out_both]"
                        onClick={() => setIsMoreSheetOpen(false)}
                    />

                    {/* Sheet */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 rounded-t-2xl border-t shadow-2xl animate-[slideUp_0.25s_ease-out_both] ${
                            isDark
                                ? "bg-zinc-950 border-emerald-500/20 text-white"
                                : "bg-white border-amber-200 text-black"
                        }`}
                        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                    >
                        {/* Sheet Header */}
                        <div
                            className={`flex items-center justify-between px-4 py-3 border-b ${
                                isDark ? "border-emerald-500/10" : "border-amber-200/60"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${
                                        isDark
                                            ? "bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-300"
                                            : "bg-indigo-50 ring-1 ring-indigo-200 text-indigo-600"
                                    }`}
                                >
                                    <Hospital className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold truncate max-w-[180px]">
                                        {activeClinic.clinicName}
                                    </p>
                                    <p
                                        className={`text-xs capitalize ${
                                            isDark ? "text-zinc-400" : "text-zinc-500"
                                        }`}
                                    >
                                        {activeClinic.role.toLowerCase()} Panel
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMoreSheetOpen(false)}
                                className={`p-2 rounded-lg transition-colors ${
                                    isDark
                                        ? "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                        : "text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50"
                                }`}
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* All Nav Items */}
                        <div className="max-h-[45vh] overflow-y-auto p-3 flex flex-col gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isItemActive(item.href);

                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        onClick={() => setIsMoreSheetOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                                            active
                                                ? isDark
                                                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                                                    : "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                                                : isDark
                                                ? "text-zinc-300 hover:bg-emerald-500/10"
                                                : "text-zinc-700 hover:bg-amber-50"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        <span className="truncate">{item.title}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Footer actions */}
                        <div
                            className={`p-3 flex flex-col gap-2 border-t ${
                                isDark ? "border-emerald-500/10" : "border-amber-200/60"
                            }`}
                        >
                            <Link
                                href={APP_URLS.CLINIC_SELECTION}
                                onClick={() => setIsMoreSheetOpen(false)}
                                className={`flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                                    isDark
                                        ? "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                                        : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                }`}
                            >
                                <ArrowLeftRight className="w-4 h-4" />
                                Switch Clinic
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className={`flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                                    isDark
                                        ? "border-zinc-700 text-zinc-300 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40"
                                        : "border-zinc-300 text-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                }`}
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}