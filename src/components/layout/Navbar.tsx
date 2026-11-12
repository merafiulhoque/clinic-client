"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    ChevronDown,
    Sun,
    Moon,
    X,
} from "lucide-react";

import { useClinicStore, UserClinicInfo } from "@/shared/stores/clinic-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";

export function Navbar() {
    const router = useRouter();
    const { activeClinic, availableClinics, setActiveClinic } = useClinicStore();
    const { user } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const isDark = theme === "dark";

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mobile-only state
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const profileModalRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (
                profileModalRef.current &&
                !profileModalRef.current.contains(event.target as Node)
            ) {
                setIsProfileModalOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClinicSwitch = (clinic: UserClinicInfo) => {
        setActiveClinic(clinic);
        setIsDropdownOpen(false);

        if (clinic.role === "OWNER") {
            router.push(APP_URLS.OWNER_DASHBOARD);
        } else {
            router.push(APP_URLS.CLINIC_MEMBER_DASHBOARD);
        }
    };

    const userInitial = !mounted ? "..." : user?.email ? user.email.charAt(0) : "U";
    const userEmail = !mounted ? "Loading..." : user?.email || "Guest";

    return (
        <header
            className={`h-16 border-b flex items-center justify-between px-3 sm:px-4 sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 ${
                isDark
                    ? "bg-zinc-950/80 border-emerald-500/10 text-white"
                    : "bg-white/80 border-amber-200/60 text-black"
            }`}
        >
            {/* ===== Left: Logo + Clinic Dropdown ===== */}
            <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                {/* Logo */}
                <img
                    src="/favicon.ico"
                    alt="Clinic Logo"
                    className={`w-8 h-8 rounded-md object-contain shrink-0 ring-1 transition-all duration-200 hover:scale-105 ${
                        isDark ? "ring-emerald-500/30" : "ring-amber-300/60"
                    }`}
                />

                {/* Clinic Dropdown */}
                <div className="relative min-w-0" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        active:scale-[0.98]
                        ${
                            isDark
                                ? "border-zinc-700 bg-zinc-900/50 text-white hover:border-emerald-400 hover:bg-zinc-800 focus-visible:ring-emerald-400 focus-visible:ring-offset-zinc-950"
                                : "border-zinc-300 bg-white text-black hover:border-indigo-400 hover:bg-amber-50 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                        }`}
                    >
                        <span className="truncate max-w-[110px] sm:max-w-[200px]">
                            {activeClinic?.clinicName || "Select Clinic"}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                                isDropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {isDropdownOpen && availableClinics.length > 0 && (
                        <div
                            className={`absolute top-full left-0 mt-2 w-64 rounded-xl border shadow-lg z-50 overflow-hidden animate-fade-slide-up ${
                                isDark
                                    ? "bg-zinc-900 border-emerald-500/20 shadow-emerald-500/5"
                                    : "bg-white border-amber-200 shadow-indigo-500/10"
                            }`}
                        >
                            {availableClinics.map((item) => (
                                <button
                                    key={item.clinicId}
                                    onClick={() => handleClinicSwitch(item)}
                                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 border-b last:border-b-0 transition-colors
                                    ${
                                        isDark
                                            ? "border-zinc-800 hover:bg-emerald-500/10 text-zinc-100"
                                            : "border-amber-100 hover:bg-amber-50 text-zinc-800"
                                    }`}
                                >
                                    <span className="truncate">{item.clinicName}</span>
                                    <span
                                        className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ring-1 shrink-0 ${
                                            item.role === "OWNER"
                                                ? isDark
                                                    ? "text-emerald-300 ring-emerald-500/40 bg-emerald-500/10"
                                                    : "text-indigo-600 ring-indigo-400/40 bg-indigo-50"
                                                : isDark
                                                ? "text-amber-300 ring-amber-500/40 bg-amber-500/10"
                                                : "text-amber-600 ring-amber-400/40 bg-amber-50"
                                        }`}
                                    >
                                        {item.role}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ===== Center: Search (desktop + expanding mobile) ===== */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
                <div
                    className={`relative flex items-center w-full px-3 py-2 rounded-lg border transition-all duration-200 ${
                        isDark
                            ? "border-zinc-700 bg-zinc-900/50 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/30"
                            : "border-zinc-300 bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/30"
                    }`}
                >
                    <Search
                        className={`w-4 h-4 mr-2 shrink-0 ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                        }`}
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className={`w-full text-sm outline-none bg-transparent ${
                            isDark
                                ? "text-white placeholder:text-zinc-500"
                                : "text-black placeholder:text-zinc-500"
                        }`}
                    />
                </div>
            </div>

            {/* ===== Mobile search (icon → expand) ===== */}
            <div className="flex md:hidden items-center">
                {isMobileSearchOpen ? (
                    <div
                        className={`flex items-center flex-1 mx-2 px-2 py-1.5 rounded-lg border transition-all duration-200 ${
                            isDark
                                ? "border-zinc-700 bg-zinc-900/50"
                                : "border-zinc-300 bg-white"
                        }`}
                    >
                        <Search
                            className={`w-4 h-4 mr-2 shrink-0 ${
                                isDark ? "text-zinc-400" : "text-zinc-500"
                            }`}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            autoFocus
                            className={`w-full text-sm outline-none bg-transparent ${
                                isDark
                                    ? "text-white placeholder:text-zinc-500"
                                    : "text-black placeholder:text-zinc-500"
                            }`}
                        />
                        <button
                            onClick={() => setIsMobileSearchOpen(false)}
                            className={`p-1 rounded-md transition-colors ${
                                isDark
                                    ? "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                    : "text-zinc-500 hover:text-indigo-600 hover:bg-indigo-500/10"
                            }`}
                            aria-label="Close search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsMobileSearchOpen(true)}
                        className={`p-2 rounded-lg transition-colors ${
                            isDark
                                ? "text-zinc-300 hover:text-emerald-300 hover:bg-emerald-500/10"
                                : "text-zinc-600 hover:text-indigo-600 hover:bg-indigo-500/10"
                        }`}
                        aria-label="Open search"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* ===== Right: Theme toggle + Profile ===== */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className={`p-2 rounded-lg border transition-all duration-200 active:scale-95
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    ${
                        isDark
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 focus-visible:ring-emerald-400 focus-visible:ring-offset-zinc-950"
                            : "border-amber-300/60 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:border-amber-400 focus-visible:ring-amber-400 focus-visible:ring-offset-white"
                    }`}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Profile — desktop (non-clickable) */}
                <div
                    className={`hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-colors ${
                        isDark
                            ? "border-zinc-700 bg-zinc-900/50"
                            : "border-zinc-300 bg-white"
                    }`}
                >
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold uppercase text-sm shrink-0 ${
                            isDark
                                ? "bg-gradient-to-br from-emerald-500 to-amber-400 text-black"
                                : "bg-gradient-to-br from-indigo-500 to-amber-400 text-white"
                        }`}
                    >
                        {userInitial}
                    </div>
                    <span
                        className={`text-sm font-medium max-w-[140px] truncate ${
                            isDark ? "text-zinc-200" : "text-zinc-700"
                        }`}
                    >
                        {userEmail}
                    </span>
                </div>

                {/* Profile — mobile (avatar only, clickable) */}
                <div className="relative sm:hidden" ref={profileModalRef}>
                    <button
                        onClick={() => setIsProfileModalOpen((v) => !v)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold uppercase text-sm transition-all duration-200 active:scale-95
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        ${
                            isDark
                                ? "bg-gradient-to-br from-emerald-500 to-amber-400 text-black focus-visible:ring-emerald-400 focus-visible:ring-offset-zinc-950"
                                : "bg-gradient-to-br from-indigo-500 to-amber-400 text-white focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                        }`}
                        aria-label="Show account info"
                    >
                        {userInitial}
                    </button>

                    {isProfileModalOpen && (
                        <div
                            className={`absolute top-full right-0 mt-2 w-64 rounded-xl border shadow-lg z-50 p-4 animate-fade-slide-up ${
                                isDark
                                    ? "bg-zinc-900 border-emerald-500/20 shadow-emerald-500/10"
                                    : "bg-white border-amber-200 shadow-indigo-500/10"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <span
                                    className={`text-xs font-semibold uppercase tracking-wide ${
                                        isDark ? "text-emerald-300" : "text-indigo-600"
                                    }`}
                                >
                                    Account
                                </span>
                                <button
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className={`p-1 rounded-md transition-colors ${
                                        isDark
                                            ? "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                            : "text-zinc-500 hover:text-indigo-600 hover:bg-indigo-500/10"
                                    }`}
                                    aria-label="Close"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <p
                                className={`text-sm break-all ${
                                    isDark ? "text-zinc-200" : "text-zinc-800"
                                }`}
                            >
                                {userEmail}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}