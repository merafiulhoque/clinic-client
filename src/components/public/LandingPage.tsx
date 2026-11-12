"use client";

import Link from "next/link";
import { APP_URLS } from "@/shared/config/constants/urls";
import { CalendarCheck, Stethoscope, ArrowRight } from "lucide-react";
import { useThemeStore } from "@/shared/stores/theme-store"; // adjust path if needed

export default function LandingPage() {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    return (
        <div
            className={`relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden transition-colors duration-500 ${
                isDark ? "bg-black text-white" : "bg-white text-black"
            }`}
        >
            {/* ===== Background Decor (pure CSS) ===== */}
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

            {/* ===== Content ===== */}
            <div className="relative z-10 max-w-3xl space-y-8 w-full">

                {/* Header Icon */}
                <div className="flex justify-center animate-fade-slide-up">
                    <div
                        className={`relative p-5 rounded-full transition-all duration-300 ${
                            isDark
                                ? "bg-emerald-500/10 ring-2 ring-emerald-500/30"
                                : "bg-indigo-500/10 ring-2 ring-indigo-500/30"
                        }`}
                    >
                        <Stethoscope
                            className={`h-12 w-12 ${isDark ? "text-emerald-400" : "text-indigo-500"}`}
                        />
                        <span
                            className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                                isDark ? "bg-emerald-500" : "bg-indigo-500"
                            }`}
                        />
                    </div>
                </div>

                {/* Hero Text */}
                <div className="space-y-4 animate-fade-slide-up" style={{ animationDelay: "0.1s" }}>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                        Clinic Management &{" "}
                        <br className="hidden md:block" />
                        Patient{" "}
                        <span
                            className={`bg-clip-text text-transparent ${
                                isDark
                                    ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                    : "bg-gradient-to-r from-indigo-500 to-amber-500"
                            }`}
                        >
                            Appointments
                        </span>
                    </h1>
                    <p
                        className={`text-lg max-w-2xl mx-auto ${
                            isDark ? "text-zinc-300" : "text-zinc-600"
                        }`}
                    >
                        A unified platform to find doctors, book your appointments
                        seamlessly, and manage clinic operations efficiently.
                    </p>
                </div>

                {/* Primary CTAs */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-slide-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    <Link
                        href={APP_URLS.PUBLIC_DIRECTORY}
                        className={`group flex items-center gap-2 px-8 py-3 rounded-lg font-semibold w-full sm:w-auto justify-center
                        shadow-md transition-all duration-200 ease-out
                        hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        ${
                            isDark
                                ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-black"
                                : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                        }`}
                    >
                        <CalendarCheck className="h-5 w-5" />
                        Book an Appointment
                    </Link>

                    <Link
                        href={APP_URLS.SIGN_IN}
                        className={`group flex items-center gap-2 px-8 py-3 rounded-lg font-medium w-full sm:w-auto justify-center
                        border-2 transition-all duration-200 ease-out
                        hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        ${
                            isDark
                                ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-emerald-400 hover:text-emerald-300 hover:bg-zinc-800 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                : "border-zinc-300 bg-white text-zinc-800 hover:border-indigo-500 hover:text-indigo-600 hover:bg-amber-50 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                        }`}
                    >
                        Sign In
                    </Link>
                </div>

                {/* Patients Corner — highlighted */}
                <div
                    className="pt-4 animate-fade-slide-up"
                    style={{ animationDelay: "0.3s" }}
                >
                    <Link
                        href={APP_URLS.PATIENTS_CORNER}
                        className={`group inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold w-full sm:w-auto justify-center
                        shadow-lg transition-all duration-200 ease-out
                        hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-[0.98]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        ${
                            isDark
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-black ring-2 ring-emerald-400/40 hover:from-emerald-400 hover:to-emerald-500 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                : "bg-gradient-to-r from-amber-400 to-yellow-500 text-black ring-2 ring-amber-400/50 hover:from-amber-300 hover:to-yellow-400 focus-visible:ring-amber-500 focus-visible:ring-offset-white"
                        }`}
                    >
                        <Stethoscope className="h-5 w-5" />
                        Patients Corner
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Sign Up link */}
                <div
                    className="pt-8 animate-fade-slide-up"
                    style={{ animationDelay: "0.4s" }}
                >
                    <Link
                        href={APP_URLS.SIGN_UP}
                        className={`group inline-flex items-center gap-2 text-sm transition-colors duration-200 underline-offset-4 hover:underline ${
                            isDark
                                ? "text-zinc-400 hover:text-emerald-300"
                                : "text-zinc-600 hover:text-indigo-600"
                        }`}
                    >
                        New clinic owner? Create an account
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>

            </div>
        </div>
    );
}