"use client";

import { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    CalendarCheck,
    Clock,
    AlertCircle,
    Stethoscope,
} from "lucide-react";

import { getDoctorScheduleAction } from "@/actions/public/getSchedule";
import { minutesToTime } from "@/shared/utils/formatTime";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";
import FullScreenLoader from "@/components/ui/Loader";

export default function ViewSchedulePage({ params }: { params: Promise<{ publicId: string }> }) {
    const router = useRouter();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    // Unwrap the folder parameter (Next.js 15 requires this)
    const { publicId } = use(params);

    const [selectedDate, setSelectedDate] = useState(""); // internal YYYY-MM-DD
    const [displayDate, setDisplayDate] = useState("");   // visible DD/MM/YYYY
    const [dateError, setDateError] = useState<string | null>(null);

    const {
        data: schedules,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["doctor-schedule", publicId],
        queryFn: () => getDoctorScheduleAction(publicId),
    });

    // Helper: today's date at 00:00 (local)
    const todayAtMidnight = () => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    };

    // Auto-insert slashes as user types + parse to YYYY-MM-DD
    const handleDateChange = (raw: string) => {
        // Allow only digits and slashes
        const cleaned = raw.replace(/[^\d/]/g, "");

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

        setDisplayDate(formatted);

        // Try to parse complete DD/MM/YYYY
        const match = formatted.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) {
            setSelectedDate("");
            setDateError(null);
            return;
        }

        const [, dd, mm, yyyy] = match;
        const day = Number(dd);
        const month = Number(mm);
        const year = Number(yyyy);

        const parsed = new Date(year, month - 1, day);
        // Validate real calendar date
        if (
            parsed.getFullYear() !== year ||
            parsed.getMonth() !== month - 1 ||
            parsed.getDate() !== day
        ) {
            setSelectedDate("");
            setDateError("Invalid date");
            return;
        }

        // Must be today or later
        if (parsed < todayAtMidnight()) {
            setSelectedDate("");
            setDateError("Date must be today or later");
            return;
        }

        setDateError(null);
        const yyyymmdd = `${yyyy}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        setSelectedDate(yyyymmdd);
    };

    const handleCheckSlots = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;

        router.push(
            `/patients-corner/book/${publicId}/slots?date=${selectedDate}`
        );
    };

    return (
        <div
            className={`relative min-h-screen transition-colors duration-500 ${
                isDark ? "bg-black text-white" : "bg-[#fdfcfb] text-black"
            }`}
        >
            {/* ===== Background Decor ===== */}
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
            <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-10 space-y-6">

                {/* Back + Header */}
                <div className="space-y-4 animate-fade-slide-up">
                    <Link
                        href={APP_URLS.PATIENTS_CORNER}
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
                        Back to Patients Corner
                    </Link>

                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${
                                isDark
                                    ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-400"
                                    : "bg-indigo-50 ring-indigo-200 text-indigo-600"
                            }`}
                        >
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Doctor Weekly{" "}
                                <span
                                    className={`bg-clip-text text-transparent ${
                                        isDark
                                            ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                            : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                    }`}
                                >
                                    Schedule
                                </span>
                            </h1>
                            <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                Select a date to check available time slots.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== Available Days ===== */}
                <div className="animate-fade-slide-up" style={{ animationDelay: "0.05s" }}>
                    <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-indigo-500"}`} />
                        Available Days
                    </h2>

                    {isLoading ? (
                        <FullScreenLoader message="Loading schedule..." />
                    ) : isError ? (
                        <div
                            className={`p-6 rounded-2xl border text-center ${
                                isDark
                                    ? "bg-red-500/10 border-red-500/30 text-red-300"
                                    : "bg-red-50 border-red-200 text-red-700"
                            }`}
                        >
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                            <p className="text-sm font-medium">Error loading schedule.</p>
                        </div>
                    ) : !schedules || schedules.length === 0 ? (
                        <div
                            className={`p-8 rounded-2xl border text-center ${
                                isDark
                                    ? "bg-zinc-900/60 border-emerald-500/20"
                                    : "bg-white border-amber-200"
                            }`}
                        >
                            <Stethoscope className={`w-8 h-8 mx-auto mb-2 ${isDark ? "text-zinc-600" : "text-zinc-400"}`} />
                            <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                No schedule found for this clinic.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {schedules.map((schedule, index) => (
                                <div
                                    key={schedule.scheduleId}
                                    style={{ animationDelay: `${0.1 + index * 0.03}s` }}
                                    className={`flex justify-between items-center p-4 rounded-xl border animate-fade-slide-up
                                    transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                                    ${
                                        isDark
                                            ? "bg-zinc-900/60 border-emerald-500/20 hover:border-emerald-400/50"
                                            : "bg-white border-amber-200 hover:border-indigo-400/50"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                                isDark
                                                    ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                                    : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
                                            }`}
                                        >
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-sm sm:text-base">
                                            {schedule.dayOfWeek}
                                        </span>
                                    </div>
                                    <span
                                        className={`text-sm font-mono px-3 py-1 rounded-md ring-1 ${
                                            isDark
                                                ? "bg-zinc-800/60 text-emerald-300 ring-emerald-500/20"
                                                : "bg-amber-50 text-zinc-700 ring-amber-200"
                                        }`}
                                    >
                                        {minutesToTime(schedule.startTime)} – {minutesToTime(schedule.endTime)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ===== Date Form ===== */}
                <form
                    onSubmit={handleCheckSlots}
                    className={`rounded-2xl border shadow-xl p-5 sm:p-6 animate-fade-slide-up ${
                        isDark
                            ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                            : "bg-white border-amber-200 shadow-indigo-500/5"
                    }`}
                    style={{ animationDelay: "0.15s" }}
                >
                    <div>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={displayDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                id="appointmentDate"
                                placeholder=" "
                                className={`peer flex h-12 w-full rounded-lg border-2 bg-transparent px-3 pt-5 pb-1 text-sm transition-all duration-200
                                focus:outline-none
                                ${
                                    isDark
                                        ? `border-zinc-700 text-white placeholder:text-transparent
                                           hover:border-zinc-500
                                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                                           ${dateError ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                        : `border-zinc-300 text-black placeholder:text-transparent
                                           hover:border-amber-400
                                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                                           ${dateError ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                }`}
                            />
                            <label
                                htmlFor="appointmentDate"
                                className={`absolute left-3 top-1.5 text-[11px] font-medium transition-all duration-200 pointer-events-none
                                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                                peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
                                ${
                                    isDark
                                        ? `text-zinc-500 peer-focus:text-emerald-400 peer-placeholder-shown:text-zinc-400
                                           ${dateError ? "peer-focus:text-red-400" : ""}`
                                        : `text-zinc-500 peer-focus:text-indigo-600 peer-placeholder-shown:text-zinc-500
                                           ${dateError ? "peer-focus:text-red-500" : ""}`
                                }`}
                            >
                                Select Appointment Date
                            </label>
                        </div>
                        {dateError ? (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {dateError}
                            </p>
                        ) : (
                            <p className={`mt-1.5 text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                Format: DD/MM/YYYY (today or later)
                            </p>
                        )}
                    </div>

                    <div
                        className={`flex justify-end pt-5 mt-5 border-t ${
                            isDark ? "border-emerald-500/10" : "border-amber-200/60"
                        }`}
                    >
                        <button
                            type="submit"
                            disabled={!selectedDate || schedules?.length === 0}
                            className={`inline-flex items-center justify-center gap-2 h-11 px-7 rounded-lg text-sm font-semibold
                            transition-all duration-200 ease-out
                            hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            disabled:pointer-events-none disabled:opacity-50 disabled:translate-y-0
                            ${
                                isDark
                                    ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-black"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                            }`}
                        >
                            Check Available Slots
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}