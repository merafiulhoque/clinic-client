"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Building2, MapPin, Plus, ArrowRight, ArrowLeft, LogOut } from "lucide-react";

import { useClinicStore, UserClinicInfo } from "@/shared/stores/clinic-store";
import FullScreenLoader from "@/components/ui/Loader";
import { APP_URLS } from "@/shared/config/constants/urls";
import { showToast } from "@/shared/stores/toast-store";
import getUserClinicsAction from "@/actions/clinics/getUserClinicAction";
import { useThemeStore } from "@/shared/stores/theme-store";
import { useSignOut } from "@/shared/hooks/useSignOut";

export default function ClinicSelectionPage() {
    const router = useRouter();
    const { setAvailableClinics, setActiveClinic } = useClinicStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";
    const handleSignOut = useSignOut();

    const { data: clinics, isLoading, error } = useQuery({
        queryKey: ["clinic", "info"],
        queryFn: getUserClinicsAction,
        retry: false,
    });

    useEffect(() => {
        if (clinics) {
            setAvailableClinics(clinics);
        }
        if (error) {
            showToast({ text: error.message, bgColor: "bg-red-600" });
            router.push(APP_URLS.SIGN_IN);
        }
    }, [clinics, error, setAvailableClinics, router]);

    const handleClinicSelect = (item: UserClinicInfo) => {
        setActiveClinic(item);
        if (item.role === "OWNER") {
            router.push(APP_URLS.OWNER_DASHBOARD);
        } else {
            router.push(APP_URLS.CLINIC_MEMBER_DASHBOARD);
        }
    };

    if (isLoading) return <FullScreenLoader />;

    if (!clinics) return null;

    const hasClinics = clinics.length > 0;

    return (
        <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-4xl space-y-8">

                {/* ===== Top-right utility (Sign Out) ===== */}
                <div className="flex justify-end animate-fade-slide-up">
                    <button
                        onClick={handleSignOut}
                        className={`group inline-flex items-center justify-center gap-2 h-10 w-10 rounded-lg border
                        transition-all duration-200 active:scale-95
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        ${
                            isDark
                                ? "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-red-500/50 hover:text-red-300 hover:bg-red-500/10 focus-visible:ring-red-400 focus-visible:ring-offset-black"
                                : "border-zinc-300 bg-white text-zinc-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50 focus-visible:ring-red-500 focus-visible:ring-offset-[#fdfcfb]"
                        }`}
                        aria-label="Sign Out"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>

                {/* ===== Heading ===== */}
                <div className="animate-fade-slide-up">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="text-center sm:text-left space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Welcome Back
                            </h1>
                            <p
                                className={`text-sm sm:text-base ${
                                    isDark ? "text-zinc-400" : "text-zinc-600"
                                }`}
                            >
                                Select a clinic to continue to your dashboard
                            </p>
                        </div>

                        {hasClinics && (
                            <Link
                                href={APP_URLS.CLINIC_ONBOARDING}
                                className={`inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold
                                transition-all duration-200 ease-out
                                hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                                ${
                                    isDark
                                        ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-black"
                                        : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                                }`}
                            >
                                <Plus className="w-4 h-4" />
                                Create New Clinic
                            </Link>
                        )}
                    </div>
                </div>

                {clinics.length === 0 ? (
                    <>
                        {/* ===== Empty State ===== */}
                        <div
                            className={`mx-auto max-w-lg rounded-2xl p-8 sm:p-12 text-center space-y-6 border shadow-lg animate-fade-slide-up ${
                                isDark
                                    ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                                    : "bg-white border-amber-200 shadow-indigo-500/5"
                            }`}
                        >
                            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                        isDark
                                            ? "bg-emerald-500/10 ring-2 ring-emerald-500/30"
                                            : "bg-indigo-500/10 ring-2 ring-indigo-500/30"
                                    }`}
                                >
                                    <Building2
                                        className={`w-8 h-8 ${
                                            isDark ? "text-emerald-400" : "text-indigo-500"
                                        }`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">You are not onboarded yet</h2>
                                <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                    As a clinic owner, you need to register your first clinic to
                                    access the management tools.
                                </p>
                            </div>

                            <Link
                                href={APP_URLS.CLINIC_ONBOARDING}
                                className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-semibold text-sm
                                transition-all duration-200 ease-out
                                hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                                ${
                                    isDark
                                        ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-900"
                                        : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                                }`}
                            >
                                <Plus className="w-4 h-4" />
                                Onboard Your Clinic
                            </Link>
                        </div>

                        {/* ===== Footer: Back to Home · Sign Out ===== */}
                        <div
                            className="flex items-center justify-center gap-4 animate-fade-slide-up"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <Link
                                href={APP_URLS.HOME}
                                className={`group inline-flex items-center gap-1.5 text-sm transition-colors underline-offset-4 hover:underline ${
                                    isDark
                                        ? "text-zinc-400 hover:text-emerald-300"
                                        : "text-zinc-600 hover:text-indigo-600"
                                }`}
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                Back to Home
                            </Link>

                            <span className={isDark ? "text-zinc-700" : "text-zinc-300"}>·</span>

                            <button
                                onClick={handleSignOut}
                                className={`inline-flex items-center gap-1.5 text-sm transition-colors underline-offset-4 hover:underline ${
                                    isDark
                                        ? "text-zinc-400 hover:text-red-300"
                                        : "text-zinc-600 hover:text-red-600"
                                }`}
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    </>
                ) : (
                    /* ===== Clinics Grid ===== */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clinics.map((item, index) => (
                            <button
                                key={item.clinicId}
                                onClick={() => handleClinicSelect(item)}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className={`group relative flex flex-col items-start p-6 rounded-xl border text-left
                                shadow-sm transition-all duration-200 ease-out
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
                                <div className="absolute top-4 right-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                                            item.role === "OWNER"
                                                ? isDark
                                                    ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/40"
                                                    : "bg-indigo-50 text-indigo-600 ring-indigo-200"
                                                : isDark
                                                ? "bg-amber-500/10 text-amber-300 ring-amber-500/40"
                                                : "bg-amber-50 text-amber-700 ring-amber-300"
                                        }`}
                                    >
                                        {item.role}
                                    </span>
                                </div>

                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                                        isDark
                                            ? "bg-emerald-500/10 group-hover:bg-emerald-500/20"
                                            : "bg-amber-50 group-hover:bg-indigo-50"
                                    }`}
                                >
                                    <Building2
                                        className={`w-5 h-5 transition-colors ${
                                            isDark
                                                ? "text-emerald-400 group-hover:text-emerald-300"
                                                : "text-zinc-500 group-hover:text-indigo-600"
                                        }`}
                                    />
                                </div>

                                <h3 className="font-semibold text-lg truncate w-full pr-16">
                                    {item.clinicName}
                                </h3>

                                <div
                                    className={`flex items-center text-sm mt-2 w-full ${
                                        isDark ? "text-zinc-400" : "text-zinc-600"
                                    }`}
                                >
                                    <MapPin className="w-4 h-4 mr-1.5 opacity-70 shrink-0" />
                                    <span className="truncate">{item.clinicLocation}</span>
                                </div>

                                <div
                                    className={`mt-6 flex items-center text-sm font-medium
                                    opacity-100 md:opacity-0 md:group-hover:opacity-100
                                    translate-x-0 md:-translate-x-2 md:group-hover:translate-x-0
                                    transition-all duration-200
                                    ${isDark ? "text-emerald-400" : "text-indigo-600"}`}
                                >
                                    Enter Dashboard
                                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}