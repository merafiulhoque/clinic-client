"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    CalendarDays,
    AlertCircle,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Stethoscope,
} from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { ViewAppointmentParams } from "@/shared/types";
import { viewAppointmentsAction } from "@/actions/patient-module/viewAppointments";
import { useThemeStore } from "@/shared/stores/theme-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import FullScreenLoader from "@/components/ui/Loader";

// Helper for time formatting (kept exactly as original)
function formatMinutesToTime(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hrs >= 12 ? "PM" : "AM";
    const displayHr = hrs % 12 || 12;
    return `${displayHr}:${String(mins).padStart(2, "0")} ${period}`;
}

// Helper to format YYYY-MM-DD -> DD/MM/YYYY for display
function toDisplayDate(isoDate: string) {
    if (!isoDate) return "";
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y}`;
}

export default function ViewAppointmentsPage() {
    const { activeClinic } = useClinicStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [filterType, setFilterType] = useState<"today" | "all" | "range">("today");
    
    // We store the actual ISO date (YYYY-MM-DD) for the backend
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    
    // We store the display date (DD/MM/YYYY) for the user
    const [fromDisplay, setFromDisplay] = useState("");
    const [toDisplay, setToDisplay] = useState("");

    const [rangeError, setRangeError] = useState<string | null>(null);

    const [queryParams, setQueryParams] = useState<ViewAppointmentParams>({
        type: "today",
        page: 1,
        limit: 20,
    });

    const fromInputRef = useRef<HTMLInputElement>(null);
    const toInputRef = useRef<HTMLInputElement>(null);

    const { data: appointments, isLoading, isError, error } = useQuery({
        queryKey: ["clinic", "appointments", activeClinic?.clinicId, queryParams],
        queryFn: () => viewAppointmentsAction(activeClinic!.clinicId, queryParams),
        enabled: !!activeClinic?.clinicId,
        staleTime: 30 * 1000,
    });

    const handleTabChange = (type: "today" | "all" | "range") => {
        setFilterType(type);
        setRangeError(null);
        if (type === "today" || type === "all") {
            setQueryParams({ type, page: 1, limit: 20 });
        }
    };

    // --- DATE LOGIC (Custom Input + Calendar) ---
    const handleDateChange = (
        value: string,
        setIso: (v: string) => void,
        setDisplay: (v: string) => void
    ) => {
        // Allow only digits and slashes
        const cleaned = value.replace(/[^\d/]/g, "");
        
        // Auto-format: insert slashes after 2 and 4 digits
        let formatted = cleaned;
        const digits = cleaned.replace(/\//g, "");
        if (digits.length <= 2) {
            formatted = digits;
        } else if (digits.length <= 4) {
            formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
        } else {
            formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
        }

        setDisplay(formatted);

        // If complete, parse to ISO (YYYY-MM-DD) for the backend
        const match = formatted.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) {
            const [, dd, mm, yyyy] = match;
            // Basic validation
            const day = Number(dd);
            const month = Number(mm);
            const year = Number(yyyy);
            const parsed = new Date(year, month - 1, day);
            
            if (
                parsed.getFullYear() === year &&
                parsed.getMonth() === month - 1 &&
                parsed.getDate() === day
            ) {
                setIso(`${yyyy}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
            } else {
                setIso(""); // Invalid calendar date
            }
        } else {
            setIso("");
        }
    };

    // Handle native calendar picker change
    const handleCalendarChange = (
        value: string, // This is always YYYY-MM-DD from native input
        setIso: (v: string) => void,
        setDisplay: (v: string) => void
    ) => {
        setIso(value);
        setDisplay(toDisplayDate(value));
    };

    const handleApplyRange = () => {
        if (!fromDate || !toDate) {
            setRangeError("Select both start and end dates.");
            return;
        }
        if (fromDate > toDate) {
            setRangeError("Start date must be before or equal to end date.");
            return;
        }
        setRangeError(null);
        setQueryParams({ type: "range", from: fromDate, to: toDate, page: 1, limit: 20 });
    };

    const handlePrevPage = () => {
        setQueryParams((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }));
    };

    const handleNextPage = () => {
        setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }));
    };

    // Helper for Status Colors
    const getStatusStyle = (status: string) => {
        const s = status.toUpperCase();
        if (s.includes("CONFIRM") || s.includes("COMPLETE")) {
            return isDark
                ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                : "bg-emerald-50 text-emerald-700 ring-emerald-200";
        }
        if (s.includes("PENDING")) {
            return isDark
                ? "bg-amber-500/10 text-amber-300 ring-amber-500/30"
                : "bg-amber-50 text-amber-700 ring-amber-200";
        }
        if (s.includes("CANCEL") || s.includes("FAILED")) {
            return isDark
                ? "bg-red-500/10 text-red-300 ring-red-500/30"
                : "bg-red-50 text-red-700 ring-red-200";
        }
        return isDark
            ? "bg-zinc-800 text-zinc-300 ring-zinc-700"
            : "bg-zinc-100 text-zinc-700 ring-zinc-300";
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
            
            {/* ===== Header ===== */}
            <div className="space-y-4 animate-fade-slide-up">
                <Link
                    href={`${APP_URLS.OWNER_DASHBOARD}/patient-module`}
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
                        View{" "}
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
                    <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        Clinic: <span className="font-semibold">{activeClinic?.clinicName || "..."}</span>
                    </p>
                </div>
            </div>

            {/* ===== Filter Bar ===== */}
            <div
                className={`p-4 sm:p-5 rounded-2xl border shadow-sm animate-fade-slide-up flex flex-col gap-5 ${
                    isDark
                        ? "bg-zinc-900/60 border-emerald-500/20"
                        : "bg-white border-amber-200"
                }`}
                style={{ animationDelay: "0.05s" }}
            >
                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                    {(["today", "all", "range"] as const).map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => handleTabChange(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200
                            ${
                                filterType === tab
                                    ? isDark
                                        ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40 shadow-sm"
                                        : "bg-indigo-600 text-white shadow-sm"
                                    : isDark
                                    ? "bg-transparent text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                    : "bg-transparent text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Range Inputs */}
                {filterType === "range" && (
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 pt-4 border-t border-dashed border-inherit">
                        {/* From Date */}
                        <div className="flex-1 max-w-xs w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder=" "
                                    value={fromDisplay}
                                    onChange={(e) => handleDateChange(e.target.value, setFromDate, setFromDisplay)}
                                    className={`peer flex h-11 w-full rounded-lg border-2 bg-transparent px-3 pt-4 pb-1 text-sm transition-all duration-200
                                    focus:outline-none
                                    ${
                                        isDark
                                            ? "border-zinc-700 text-white placeholder:text-transparent focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                                            : "border-zinc-300 text-black placeholder:text-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                                    }`}
                                />
                                <label className={`absolute left-3 top-1 text-[10px] font-medium transition-all duration-200 pointer-events-none
                                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                                    peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-[10px]
                                    ${isDark ? "text-zinc-500 peer-focus:text-emerald-400" : "text-zinc-500 peer-focus:text-indigo-600"}`}
                                >
                                    From (DD/MM/YYYY)
                                </label>
                                {/* Invisible native date input overlay for calendar */}
                                <input
                                    type="date"
                                    ref={fromInputRef}
                                    onChange={(e) => handleCalendarChange(e.target.value, setFromDate, setFromDisplay)}
                                    className="absolute top-0 right-0 w-8 h-full opacity-0 cursor-pointer"
                                    title="Pick a date"
                                />
                                <Calendar className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                            </div>
                        </div>

                        {/* To Date */}
                        <div className="flex-1 max-w-xs w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder=" "
                                    value={toDisplay}
                                    onChange={(e) => handleDateChange(e.target.value, setToDate, setToDisplay)}
                                    className={`peer flex h-11 w-full rounded-lg border-2 bg-transparent px-3 pt-4 pb-1 text-sm transition-all duration-200
                                    focus:outline-none
                                    ${
                                        isDark
                                            ? "border-zinc-700 text-white placeholder:text-transparent focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                                            : "border-zinc-300 text-black placeholder:text-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                                    }`}
                                />
                                <label className={`absolute left-3 top-1 text-[10px] font-medium transition-all duration-200 pointer-events-none
                                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                                    peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-[10px]
                                    ${isDark ? "text-zinc-500 peer-focus:text-emerald-400" : "text-zinc-500 peer-focus:text-indigo-600"}`}
                                >
                                    To (DD/MM/YYYY)
                                </label>
                                <input
                                    type="date"
                                    ref={toInputRef}
                                    onChange={(e) => handleCalendarChange(e.target.value, setToDate, setToDisplay)}
                                    className="absolute top-0 right-0 w-8 h-full opacity-0 cursor-pointer"
                                    title="Pick a date"
                                />
                                <Calendar className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleApplyRange}
                            className={`inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-semibold
                            transition-all duration-200 ease-out
                            hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                            ${
                                isDark
                                    ? "bg-amber-400 text-black hover:bg-amber-300"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500"
                            }`}
                        >
                            Apply
                        </button>
                    </div>
                )}
                {rangeError && (
                    <p className="text-xs font-medium text-red-500 flex items-center gap-1.5 animate-fade-slide-up">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {rangeError}
                    </p>
                )}
            </div>

            {/* ===== Results ===== */}
            <div className="animate-fade-slide-up" style={{ animationDelay: "0.1s" }}>
                {isLoading ? (
                    <FullScreenLoader message="Loading appointments..." />
                ) : isError ? (
                    <div className={`p-6 rounded-2xl border text-center ${isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}>
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                        <h3 className="font-semibold">Failed to load appointments</h3>
                        <p className="text-sm mt-1 opacity-90">
                            {error instanceof Error ? error.message : "Failed to load appointments"}
                        </p>
                    </div>
                ) : !appointments || appointments.length === 0 ? (
                    <div className={`max-w-lg mx-auto mt-4 p-8 rounded-2xl border text-center shadow-lg ${isDark ? "bg-zinc-900/60 border-emerald-500/20" : "bg-white border-amber-200"}`}>
                        <CalendarDays className={`w-10 h-10 mx-auto mb-3 ${isDark ? "text-zinc-600" : "text-zinc-400"}`} />
                        <h3 className="text-lg font-semibold mb-1">No appointments found</h3>
                        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            There are no appointments matching your current filters.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* DESKTOP TABLE */}
                        <div className={`hidden md:block overflow-hidden rounded-xl border ${isDark ? "border-emerald-500/20" : "border-amber-200"}`}>
                            <table className="w-full text-left text-sm">
                                <thead className={`border-b ${isDark ? "border-emerald-500/20 bg-zinc-900/80" : "border-amber-200 bg-amber-50/50"}`}>
                                    <tr>
                                        <th className="p-4 font-semibold">ID</th>
                                        <th className="p-4 font-semibold">Patient</th>
                                        <th className="p-4 font-semibold">Doctor</th>
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold">Time</th>
                                        <th className="p-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className={isDark ? "divide-y divide-emerald-500/10" : "divide-y divide-amber-200/60"}>
                                    {appointments.map((apt) => (
                                        <tr key={apt.appointmentId} className={`transition-colors ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-amber-50/30"}`}>
                                            <td className={`p-4 font-mono text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>#{apt.appointmentId}</td>
                                            <td className={`p-4 font-medium ${isDark ? "text-white" : "text-black"}`}>{apt.patientName}</td>
                                            <td className={`p-4 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>Dr. {apt.doctorName}</td>
                                            <td className={`p-4 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                                                {new Date(apt.appointmentDate).toLocaleDateString("en-IN")}
                                            </td>
                                            <td className={`p-4 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{formatMinutesToTime(apt.appointmentTime)}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ring-1 ${getStatusStyle(apt.appointmentStatus)}`}>
                                                    {apt.appointmentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE CARDS */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {appointments.map((apt) => (
                                <div key={apt.appointmentId} className={`p-4 rounded-xl border shadow-sm flex flex-col gap-3 ${isDark ? "bg-zinc-900/60 border-emerald-500/20" : "bg-white border-amber-200"}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-base">{apt.patientName}</h3>
                                            <p className={`text-xs font-mono ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>ID: #{apt.appointmentId}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ring-1 ${getStatusStyle(apt.appointmentStatus)}`}>
                                            {apt.appointmentStatus}
                                        </span>
                                    </div>
                                    
                                    <div className={`flex flex-col gap-1.5 text-sm border-t pt-3 ${isDark ? "border-emerald-500/10" : "border-amber-200/60"}`}>
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className={`w-4 h-4 shrink-0 ${isDark ? "text-emerald-400" : "text-indigo-500"}`} />
                                            <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>Dr. {apt.doctorName}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                            <CalendarDays className="w-4 h-4 shrink-0" />
                                            <span>{new Date(apt.appointmentDate).toLocaleDateString("en-IN")}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                            <Clock className="w-4 h-4 shrink-0" />
                                            <span>{formatMinutesToTime(apt.appointmentTime)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ===== Pagination ===== */}
            <div className={`flex items-center justify-between border-t pt-4 ${isDark ? "border-emerald-500/10" : "border-amber-200/60"}`}>
                <span className={`text-sm font-semibold px-4 py-1.5 rounded-lg ring-1 ${isDark ? "bg-zinc-900/60 text-emerald-300 ring-emerald-500/20" : "bg-amber-50 text-indigo-600 ring-amber-200"}`}>
                    Page {queryParams.page}
                </span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handlePrevPage}
                        disabled={queryParams.page === 1 || isLoading}
                        className={`inline-flex items-center gap-1 h-9 px-3 rounded-lg border text-sm font-medium transition-all
                        disabled:opacity-40 disabled:pointer-events-none
                        ${isDark ? "border-zinc-700 text-zinc-300 hover:border-emerald-400 hover:bg-emerald-500/10" : "border-zinc-300 text-zinc-700 hover:border-indigo-400 hover:bg-indigo-50"}`}
                    >
                        <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                        type="button"
                        onClick={handleNextPage}
                        disabled={!appointments || appointments.length < queryParams.limit || isLoading}
                        className={`inline-flex items-center gap-1 h-9 px-3 rounded-lg border text-sm font-medium transition-all
                        disabled:opacity-40 disabled:pointer-events-none
                        ${isDark ? "border-zinc-700 text-zinc-300 hover:border-emerald-400 hover:bg-emerald-500/10" : "border-zinc-300 text-zinc-700 hover:border-indigo-400 hover:bg-indigo-50"}`}
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}