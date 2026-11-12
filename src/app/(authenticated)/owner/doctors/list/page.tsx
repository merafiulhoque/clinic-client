"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Stethoscope,
    MapPin,
    AlertCircle,
    Plus,
} from "lucide-react";

import { getDoctorsListAction } from "@/actions/doctors/getDoctorsListAction";
import { useDoctorStore } from "@/shared/stores/doctor-store";
import FullScreenLoader from "@/components/ui/Loader";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";

export default function DoctorsListPage() {
    const { setDoctors } = useDoctorStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const { data: fetchedDoctors, isLoading, error } = useQuery({
        queryKey: ["doctors", "list"],
        queryFn: getDoctorsListAction,
    });

    // Sync fetched data to the Zustand store for use in other pages
    useEffect(() => {
        if (fetchedDoctors) {
            setDoctors(fetchedDoctors);
        }
    }, [fetchedDoctors, setDoctors]);

    if (isLoading) return <FullScreenLoader />;

    if (error) {
        return (
            <div
                className={`max-w-lg mx-auto mt-10 p-6 rounded-xl border text-center animate-fade-slide-up ${
                    isDark
                        ? "bg-red-500/10 border-red-500/30 text-red-300"
                        : "bg-red-50 border-red-200 text-red-700"
                }`}
            >
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <h3 className="font-semibold">Failed to load doctors</h3>
                <p className="text-sm mt-1 opacity-90">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* ===== Header & Navigation ===== */}
            <div className="space-y-4 animate-fade-slide-up">
                <Link
                    href={`${APP_URLS.OWNER_DASHBOARD}/doctors`}
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
                    Back to Doctor Module
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Doctors{" "}
                            <span
                                className={`bg-clip-text text-transparent ${
                                    isDark
                                        ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                        : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                }`}
                            >
                                List
                            </span>
                        </h1>
                        <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            Manage all doctors registered under your account.
                        </p>
                    </div>

                    <Link
                        href={`${APP_URLS.OWNER_DASHBOARD}/doctors/add`}
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
                        Add Doctor
                    </Link>
                </div>
            </div>

            {/* ===== Empty State ===== */}
            {!fetchedDoctors || fetchedDoctors.length === 0 ? (
                <div
                    className={`max-w-lg mx-auto mt-10 p-8 sm:p-12 rounded-2xl border text-center shadow-lg animate-fade-slide-up ${
                        isDark
                            ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                            : "bg-white border-amber-200 shadow-indigo-500/5"
                    }`}
                >
                    <div
                        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            isDark
                                ? "bg-emerald-500/10 ring-2 ring-emerald-500/30 text-emerald-400"
                                : "bg-indigo-500/10 ring-2 ring-indigo-500/30 text-indigo-500"
                        }`}
                    >
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                    <p className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        You haven't registered any doctors yet. Add your first doctor to get started.
                    </p>
                    <Link
                        href={`${APP_URLS.OWNER_DASHBOARD}/doctors/add`}
                        className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-semibold
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
                        Add Doctor
                    </Link>
                </div>
            ) : (
                /* ===== Doctors Grid ===== */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fetchedDoctors.map((doctor, index) => (
                        <div
                            key={doctor.doctorId}
                            style={{ animationDelay: `${index * 50}ms` }}
                            className={`p-5 rounded-xl border shadow-sm flex flex-col
                            transition-all duration-200 ease-out
                            hover:-translate-y-1 hover:shadow-lg
                            animate-fade-slide-up
                            ${
                                isDark
                                    ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-400/50 hover:shadow-emerald-500/10"
                                    : "bg-white border-amber-200 shadow-indigo-500/5 hover:border-indigo-400/50 hover:shadow-indigo-500/10"
                            }`}
                        >
                            {/* Doctor header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                        isDark
                                            ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                            : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
                                    }`}
                                >
                                    <Stethoscope className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-lg leading-tight truncate">
                                        Dr. {doctor.fullName}
                                    </h3>
                                    <span
                                        className={`inline-block mt-1 font-mono text-[10px] px-1.5 py-0.5 rounded ring-1 truncate max-w-full ${
                                            isDark
                                                ? "bg-zinc-800/80 text-zinc-400 ring-zinc-700"
                                                : "bg-amber-50 text-zinc-600 ring-amber-200"
                                        }`}
                                        title={doctor.doctorId.toString()}
                                    >
                                        {doctor.doctorId}
                                    </span>
                                </div>
                            </div>

                            {/* Assigned Clinics */}
                            <div
                                className={`mt-auto border-t pt-4 ${
                                    isDark ? "border-emerald-500/10" : "border-amber-200/60"
                                }`}
                            >
                                <h4
                                    className={`text-[10px] font-semibold uppercase tracking-wider mb-3 ${
                                        isDark ? "text-zinc-400" : "text-zinc-600"
                                    }`}
                                >
                                    Assigned Clinics
                                </h4>

                                {doctor.clinics.length === 0 ? (
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ring-1 ${
                                            isDark
                                                ? "bg-amber-500/10 text-amber-300 ring-amber-500/30"
                                                : "bg-amber-50 text-amber-700 ring-amber-300"
                                        }`}
                                    >
                                        Not Assigned Yet
                                    </span>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {doctor.clinics.map((clinic) => (
                                            <div
                                                key={clinic.clinicId}
                                                className={`flex flex-col p-2.5 rounded-lg border transition-colors ${
                                                    isDark
                                                        ? "bg-zinc-800/40 border-zinc-700/60 hover:border-emerald-500/40 hover:bg-emerald-500/5"
                                                        : "bg-amber-50/60 border-amber-200/60 hover:border-indigo-300 hover:bg-indigo-50/40"
                                                }`}
                                            >
                                                <span className="text-sm font-medium truncate">
                                                    {clinic.clinicName}
                                                </span>
                                                <div
                                                    className={`flex items-center text-xs mt-0.5 ${
                                                        isDark ? "text-zinc-400" : "text-zinc-500"
                                                    }`}
                                                >
                                                    <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                                    <span className="truncate">
                                                        {clinic.clinicLocation}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}