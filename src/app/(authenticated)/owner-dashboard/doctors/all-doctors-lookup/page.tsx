"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
    ArrowLeft,
    Stethoscope,
    Search,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { lookupDoctorsAction } from "@/actions/doctors/lookupAction";
import {
    assignDoctorToClinicSchema,
    AssignDoctorToClinicData,
} from "@/shared/types/schemas";
import { assignDoctorAction } from "@/actions/doctors/assignDoctorAction";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";
import FullScreenLoader from "@/components/ui/Loader";
import { DoctorLookupResult } from "@/shared/types";

// ===== ISOLATED CARD COMPONENT =====
function DoctorLookupCard({
    doctor,
    clinicId,
}: {
    doctor: DoctorLookupResult;
    clinicId: number;
}) {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [assignMessage, setAssignMessage] = useState<string | null>(null);
    const [assignError, setAssignError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AssignDoctorToClinicData>({
        resolver: zodResolver(assignDoctorToClinicSchema),
        defaultValues: {
            doctorId: doctor.doctorId,
            clinicId: clinicId,
            fees: 0,
        },
    });

    const onSubmit = async (data: AssignDoctorToClinicData) => {
        setAssignMessage(null);
        setAssignError(null);
        try {
            const response = await assignDoctorAction(data);
            setAssignMessage(response.message);
        } catch (err: any) {
            setAssignError(err.message || "Failed to assign doctor");
        }
    };

    const isAssigned = !!assignMessage;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`flex flex-col gap-4 p-5 rounded-xl border shadow-sm
            transition-all duration-200 hover:shadow-md
            ${
                isDark
                    ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                    : "bg-white border-amber-200 shadow-indigo-500/5"
            }`}
        >
            {/* Doctor header */}
            <div
                className={`flex items-start gap-3 border-b pb-4 ${
                    isDark ? "border-emerald-500/10" : "border-amber-200/60"
                }`}
            >
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isDark
                            ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                            : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
                    }`}
                >
                    <Stethoscope className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg leading-tight truncate">
                        Dr. {doctor.doctorName}
                    </h3>
                    <p
                        className={`text-xs mt-0.5 truncate ${
                            isDark ? "text-zinc-400" : "text-zinc-600"
                        }`}
                    >
                        {doctor.doctorQualification}
                    </p>
                    <span
                        className={`inline-block mt-1.5 font-mono text-[10px] px-1.5 py-0.5 rounded ring-1 ${
                            isDark
                                ? "bg-zinc-800/80 text-zinc-400 ring-zinc-700"
                                : "bg-amber-50 text-zinc-600 ring-amber-200"
                        }`}
                    >
                        ID: {doctor.doctorId}
                    </span>
                </div>
            </div>

            {/* Fees input */}
            <div>
                <div className="relative">
                    <span
                        className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                        }`}
                    >
                        ₹
                    </span>
                    <input
                        type="number"
                        {...register("fees", { valueAsNumber: true })}
                        id={`fees-${doctor.doctorId}`}
                        placeholder=" "
                        disabled={isSubmitting || isAssigned}
                        className={`peer flex h-12 w-full rounded-lg border-2 bg-transparent pl-8 pr-3 pt-5 pb-1 text-sm transition-all duration-200
                        focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
                        ${
                            isDark
                                ? `border-zinc-700 text-white placeholder:text-transparent
                                   hover:border-zinc-500
                                   focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                                   ${errors.fees ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                : `border-zinc-300 text-black placeholder:text-transparent
                                   hover:border-amber-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                                   ${errors.fees ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                        }`}
                    />
                    <label
                        htmlFor={`fees-${doctor.doctorId}`}
                        className={`absolute left-3 top-1.5 pl-5 text-[11px] font-medium transition-all duration-200 pointer-events-none
                        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                        peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
                        ${
                            isDark
                                ? `text-zinc-500 peer-focus:text-emerald-400 peer-placeholder-shown:text-zinc-400
                                   ${errors.fees ? "peer-focus:text-red-400" : ""}`
                                : `text-zinc-500 peer-focus:text-indigo-600 peer-placeholder-shown:text-zinc-500
                                   ${errors.fees ? "peer-focus:text-red-500" : ""}`
                        }`}
                    >
                        Consultation Fees
                    </label>
                </div>
                {errors.fees && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.fees.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting || isAssigned}
                className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold
                transition-all duration-200 ease-out
                hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50 disabled:translate-y-0
                ${
                    isAssigned
                        ? isDark
                            ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300"
                        : isDark
                        ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-900"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                }`}
            >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Assigning..." : isAssigned ? "Assigned" : "Add to Clinic"}
            </button>

            {/* Inline messages */}
            {assignMessage && (
                <div
                    className={`flex items-start gap-2 p-2.5 rounded-lg text-xs font-medium animate-fade-slide-up ${
                        isDark
                            ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{assignMessage}</span>
                </div>
            )}
            {assignError && (
                <div
                    className={`flex items-start gap-2 p-2.5 rounded-lg text-xs font-medium animate-fade-slide-up ${
                        isDark
                            ? "bg-red-500/10 text-red-300 ring-1 ring-red-500/30"
                            : "bg-red-50 text-red-700 ring-1 ring-red-200"
                    }`}
                >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{assignError}</span>
                </div>
            )}
        </form>
    );
}

// ===== MAIN PAGE COMPONENT =====
export default function LookupDoctorsPage() {
    const { activeClinic } = useClinicStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [page, setPage] = useState(1);
    const limit = 20;

    const {
        data: doctors,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["all-doctors-lookup", page, limit],
        queryFn: () => lookupDoctorsAction(page, limit),
    });

    if (!activeClinic) {
        return (
            <div
                className={`p-6 rounded-xl border max-w-md mx-auto mt-10 text-center animate-fade-slide-up ${
                    isDark
                        ? "bg-red-500/10 border-red-500/30 text-red-300"
                        : "bg-red-50 border-red-200 text-red-700"
                }`}
            >
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-medium">
                    Please select a clinic first from the dashboard.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">

            {/* ===== Header ===== */}
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

                <div className="flex items-center gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${
                            isDark
                                ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-400"
                                : "bg-indigo-50 ring-indigo-200 text-indigo-600"
                        }`}
                    >
                        <Search className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Lookup Existing{" "}
                            <span
                                className={`bg-clip-text text-transparent ${
                                    isDark
                                        ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                        : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                }`}
                            >
                                Doctors
                            </span>
                        </h1>
                        <p className={`text-sm mt-1 truncate ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            Search and assign registered doctors to:{" "}
                            <span className="font-semibold">{activeClinic.clinicName}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== Content ===== */}
            {isLoading ? (
                <FullScreenLoader message="Loading doctors database..." />
            ) : isError ? (
                <div
                    className={`p-6 rounded-2xl border text-center animate-fade-slide-up ${
                        isDark
                            ? "bg-red-500/10 border-red-500/30 text-red-300"
                            : "bg-red-50 border-red-200 text-red-700"
                    }`}
                >
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                    <h3 className="font-semibold">Failed to load doctors</h3>
                    <p className="text-sm mt-1 opacity-90">
                        {error instanceof Error ? error.message : "Failed to load"}
                    </p>
                </div>
            ) : !doctors || doctors.length === 0 ? (
                <div
                    className={`max-w-lg mx-auto mt-4 p-8 rounded-2xl border text-center shadow-lg animate-fade-slide-up ${
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
                        <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                    <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        No doctors found in the database.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.map((doctor, index) => (
                        <div
                            key={doctor.doctorId}
                            style={{ animationDelay: `${index * 40}ms` }}
                            className="animate-fade-slide-up"
                        >
                            <DoctorLookupCard
                                doctor={doctor}
                                clinicId={activeClinic.clinicId}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* ===== Pagination ===== */}
            <div
                className={`flex items-center justify-between border-t pt-4 animate-fade-slide-up ${
                    isDark ? "border-emerald-500/10" : "border-amber-200/60"
                }`}
            >
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border text-sm font-medium
                    transition-all duration-200 active:scale-[0.98]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    disabled:pointer-events-none disabled:opacity-40
                    ${
                        isDark
                            ? "border-zinc-700 text-zinc-300 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                            : "border-zinc-300 text-zinc-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                    }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <span
                    className={`text-sm font-semibold px-4 py-2 rounded-lg ring-1 ${
                        isDark
                            ? "bg-zinc-900/60 text-emerald-300 ring-emerald-500/20"
                            : "bg-amber-50 text-indigo-600 ring-amber-200"
                    }`}
                >
                    Page {page}
                </span>

                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!doctors || doctors.length < limit}
                    className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border text-sm font-medium
                    transition-all duration-200 active:scale-[0.98]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    disabled:pointer-events-none disabled:opacity-40
                    ${
                        isDark
                            ? "border-zinc-700 text-zinc-300 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                            : "border-zinc-300 text-zinc-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                    }`}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}