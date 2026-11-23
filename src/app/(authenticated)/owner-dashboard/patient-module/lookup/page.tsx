"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Search,
    Lightbulb,
    AlertCircle,
    User,
    Phone,
    X,
} from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { PatientLookupParams } from "@/shared/types";
import { patientLookupAction } from "@/actions/patient-module/patientLookup";
import { useThemeStore } from "@/shared/stores/theme-store";
import FullScreenLoader from "@/components/ui/Loader";

export default function PatientLookupPage() {
    const { activeClinic } = useClinicStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [patientPhone, setPatientPhone] = useState("");
    const [patientName, setPatientName] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState<PatientLookupParams | null>(null);

    const {
        data: patients,
        isLoading,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ["clinic", "patient-lookup", activeClinic?.clinicId, submittedQuery],
        queryFn: () => patientLookupAction(activeClinic!.clinicId, submittedQuery!),
        enabled: !!activeClinic?.clinicId && submittedQuery !== null,
        staleTime: 30 * 1000,
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        setSubmittedQuery({
            patientPhone: patientPhone.trim() || undefined,
            patientName: patientName.trim() || undefined,
        });
    };

    const handleClear = () => {
        setPatientPhone("");
        setPatientName("");
        setSubmittedQuery(null);
    };

    return (
        <div className="max-w-3xl mx-auto w-full space-y-6">

            {/* ===== Header ===== */}
            <div className="space-y-4 animate-fade-slide-up">
                <Link
                    href={`${APP_URLS.OWNER_PATIENT_MODULE}`}
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
                    Back to Patient Module
                </Link>

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Patient{" "}
                        <span
                            className={`bg-clip-text text-transparent ${
                                isDark
                                    ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                    : "bg-gradient-to-r from-indigo-500 to-amber-500"
                            }`}
                        >
                            Directory
                        </span>
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        Search patient records
                        {activeClinic?.clinicName ? (
                            <>
                                {" for "}
                                <span className="font-semibold">{activeClinic.clinicName}</span>
                            </>
                        ) : null}
                        .
                    </p>
                </div>
            </div>

            {/* ===== Search Form ===== */}
            <form
                onSubmit={handleSearch}
                className={`p-5 sm:p-6 rounded-2xl border shadow-sm space-y-5 animate-fade-slide-up ${
                    isDark
                        ? "bg-zinc-900/60 border-emerald-500/20"
                        : "bg-white border-amber-200"
                }`}
                style={{ animationDelay: "0.05s" }}
            >
                {/* Tip Banner */}
                <div
                    className={`flex items-start gap-2.5 p-3 rounded-lg text-xs ${
                        isDark
                            ? "bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/30"
                            : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
                    }`}
                >
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                        <strong>Tip:</strong> Prefer searching by phone number for
                        faster and more accurate results.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number — visual priority */}
                    <div>
                        <div className="relative">
                            <Phone
                                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                                    isDark ? "text-emerald-400" : "text-indigo-500"
                                }`}
                            />
                            <input
                                id="patientPhone"
                                type="tel"
                                value={patientPhone}
                                onChange={(e) => setPatientPhone(e.target.value)}
                                placeholder=" "
                                className={`peer flex h-12 w-full rounded-lg border-2 bg-transparent pl-10 pr-3 pt-5 pb-1 text-sm transition-all duration-200
                                focus:outline-none
                                ${
                                    isDark
                                        ? `border-emerald-500/30 text-white placeholder:text-transparent
                                           hover:border-emerald-400/60
                                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30`
                                        : `border-indigo-300 text-black placeholder:text-transparent
                                           hover:border-indigo-400
                                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30`
                                }`}
                            />
                            <label
                                htmlFor="patientPhone"
                                className={`absolute left-3 top-1 pl-6 text-[11px] font-medium transition-all duration-200 pointer-events-none
                                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                                peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
                                ${
                                    isDark
                                        ? "text-emerald-400/90 peer-placeholder-shown:text-emerald-400 peer-focus:text-emerald-400"
                                        : "text-indigo-600/90 peer-placeholder-shown:text-indigo-600 peer-focus:text-indigo-600"
                                }`}
                            >
                                Phone Number <span className="opacity-70">(Preferred)</span>
                            </label>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <div className="relative">
                            <User
                                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                                    isDark ? "text-zinc-500" : "text-zinc-400"
                                }`}
                            />
                            <input
                                id="patientName"
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder=" "
                                className={`peer flex h-12 w-full rounded-lg border-2 bg-transparent pl-10 pr-3 pt-5 pb-1 text-sm transition-all duration-200
                                focus:outline-none
                                ${
                                    isDark
                                        ? `border-zinc-700 text-white placeholder:text-transparent
                                           hover:border-zinc-500
                                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30`
                                        : `border-zinc-300 text-black placeholder:text-transparent
                                           hover:border-amber-400
                                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30`
                                }`}
                            />
                            <label
                                htmlFor="patientName"
                                className={`absolute left-3 top-1 pl-6 text-[11px] font-medium transition-all duration-200 pointer-events-none
                                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                                peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
                                ${
                                    isDark
                                        ? "text-zinc-500 peer-focus:text-emerald-400 peer-placeholder-shown:text-zinc-400"
                                        : "text-zinc-500 peer-focus:text-indigo-600 peer-placeholder-shown:text-zinc-500"
                                }`}
                            >
                                Patient Name <span className="opacity-70">(Optional)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={isFetching}
                        className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold
                        transition-all duration-200 ease-out
                        hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                        disabled:pointer-events-none disabled:opacity-50 disabled:translate-y-0
                        ${
                            isDark
                                ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-900"
                                : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                        }`}
                    >
                        <Search className="h-4 w-4" />
                        {isFetching ? "Searching..." : "Search"}
                    </button>

                    {(patientPhone || patientName || submittedQuery) && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className={`inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg text-sm font-medium border
                            transition-all duration-200 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                isDark
                                    ? "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 focus-visible:ring-zinc-400 focus-visible:ring-offset-zinc-900"
                                    : "border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:ring-zinc-500 focus-visible:ring-offset-white"
                            }`}
                        >
                            <X className="h-3.5 w-3.5" />
                            Clear
                        </button>
                    )}
                </div>
            </form>

            {/* ===== Results ===== */}
            <div className="animate-fade-slide-up" style={{ animationDelay: "0.1s" }}>
                {submittedQuery === null ? (
                    /* Initial empty state */
                    <div
                        className={`max-w-lg mx-auto p-8 rounded-2xl border text-center ${
                            isDark
                                ? "bg-zinc-900/60 border-emerald-500/20"
                                : "bg-white border-amber-200"
                        }`}
                    >
                        <Search
                            className={`w-10 h-10 mx-auto mb-3 ${
                                isDark ? "text-zinc-600" : "text-zinc-400"
                            }`}
                        />
                        <h3 className="text-base font-semibold mb-1">Start your search</h3>
                        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            Enter a phone number or name and click Search to look up patients.
                        </p>
                    </div>
                ) : isLoading ? (
                    <FullScreenLoader message="Searching patients..." />
                ) : isError ? (
                    <div
                        className={`p-6 rounded-2xl border text-center ${
                            isDark
                                ? "bg-red-500/10 border-red-500/30 text-red-300"
                                : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    >
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                        <h3 className="font-semibold">Search failed</h3>
                        <p className="text-sm mt-1 opacity-90">
                            {error instanceof Error ? error.message : "Failed to search patients"}
                        </p>
                    </div>
                ) : !patients || patients.length === 0 ? (
                    <div
                        className={`max-w-lg mx-auto p-8 rounded-2xl border text-center ${
                            isDark
                                ? "bg-zinc-900/60 border-emerald-500/20"
                                : "bg-white border-amber-200"
                        }`}
                    >
                        <User
                            className={`w-10 h-10 mx-auto mb-3 ${
                                isDark ? "text-zinc-600" : "text-zinc-400"
                            }`}
                        />
                        <h3 className="text-base font-semibold mb-1">No matching patients</h3>
                        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            We couldn't find any patients matching your search criteria.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div
                            className={`hidden md:block overflow-hidden rounded-xl border ${
                                isDark
                                    ? "border-emerald-500/20"
                                    : "border-amber-200"
                            }`}
                        >
                            <table className="w-full text-left text-sm">
                                <thead
                                    className={`border-b ${
                                        isDark
                                            ? "border-emerald-500/20 bg-zinc-900/80"
                                            : "border-amber-200 bg-amber-50/50"
                                    }`}
                                >
                                    <tr>
                                        <th className="p-4 font-semibold w-16">#</th>
                                        <th className="p-4 font-semibold">Patient Name</th>
                                        <th className="p-4 font-semibold">Phone Number</th>
                                    </tr>
                                </thead>
                                <tbody
                                    className={
                                        isDark
                                            ? "divide-y divide-emerald-500/10"
                                            : "divide-y divide-amber-200/60"
                                    }
                                >
                                    {patients.map((patient, index) => (
                                        <tr
                                            key={`${patient.patientPhone}-${index}`}
                                            className={`transition-colors ${
                                                isDark
                                                    ? "hover:bg-zinc-800/50"
                                                    : "hover:bg-amber-50/30"
                                            }`}
                                        >
                                            <td
                                                className={`p-4 font-mono text-xs ${
                                                    isDark ? "text-zinc-500" : "text-zinc-500"
                                                }`}
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </td>
                                            <td
                                                className={`p-4 font-medium ${
                                                    isDark ? "text-white" : "text-black"
                                                }`}
                                            >
                                                {patient.patientName}
                                            </td>
                                            <td
                                                className={`p-4 font-mono ${
                                                    isDark ? "text-emerald-300" : "text-indigo-600"
                                                }`}
                                            >
                                                {patient.patientPhone}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {patients.map((patient, index) => (
                                <div
                                    key={`${patient.patientPhone}-${index}`}
                                    className={`p-4 rounded-xl border shadow-sm ${
                                        isDark
                                            ? "bg-zinc-900/60 border-emerald-500/20"
                                            : "bg-white border-amber-200"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                isDark
                                                    ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                                    : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
                                            }`}
                                        >
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold truncate">
                                                {patient.patientName}
                                            </h3>
                                            <p
                                                className={`text-sm font-mono mt-0.5 ${
                                                    isDark ? "text-emerald-300" : "text-indigo-600"
                                                }`}
                                            >
                                                {patient.patientPhone}
                                            </p>
                                        </div>
                                        <span
                                            className={`font-mono text-[10px] shrink-0 ${
                                                isDark ? "text-zinc-500" : "text-zinc-400"
                                            }`}
                                        >
                                            #{index + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}