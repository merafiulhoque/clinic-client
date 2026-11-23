"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    CalendarDays,
    CalendarCheck,
    AlertCircle,
    Stethoscope,
} from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { minutesToTime } from "@/shared/utils/formatTime";
import { BookingFormData } from "@/shared/types/schemas";
import { TodayScheduleItem, WalkinBookingResult } from "@/shared/types";
import { getTodaySchedulesAction } from "@/actions/patient-module/getTodaySchedule";
import { createWalkinBookingAction } from "@/actions/patient-module/createWalkinBooking";
import { PatientBookingForm } from "@/components/re-usables/PatientBookingForm";
import { useThemeStore } from "@/shared/stores/theme-store";
import FullScreenLoader from "@/components/ui/Loader";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getDoctorFullName = (s: TodayScheduleItem) =>
    [s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ");

export default function WalkInAppointmentPage() {
    const { activeClinic } = useClinicStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";
    const queryClient = useQueryClient();

    const todayDate = getTodayDate();
    const [selectedSchedule, setSelectedSchedule] = useState<TodayScheduleItem | null>(null);
    const [bookingResult, setBookingResult] = useState<WalkinBookingResult | null>(null);

    const {
        data: schedules,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["clinic", "today-schedules", activeClinic?.clinicId],
        queryFn: () => getTodaySchedulesAction(activeClinic!.clinicId),
        enabled: !!activeClinic?.clinicId,
        staleTime: 30 * 1000,
    });

    const walkinMutation = useMutation({
        mutationFn: (data: BookingFormData) => createWalkinBookingAction(data),
        onSuccess: (result) => {
            setBookingResult(result);
            queryClient.invalidateQueries({
                queryKey: ["clinic", "today-schedules", activeClinic?.clinicId],
            });
            queryClient.invalidateQueries({
                queryKey: ["clinic", "appointments", activeClinic?.clinicId],
            });
            queryClient.invalidateQueries({
                queryKey: ["clinic", "stats", activeClinic?.clinicId],
            });
        },
        onError: (err: Error) => {
            showToast({
                text: err.message || "Failed to book walk-in appointment",
                bgColor: "bg-red-600",
            });
        },
    });

    const handleReset = () => {
        setBookingResult(null);
        setSelectedSchedule(null);
    };

    // ===== SUCCESS STATE =====
    if (bookingResult) {
        return (
            <div className="max-w-xl mx-auto w-full">
                <div
                    className={`rounded-2xl border shadow-xl p-6 sm:p-8 space-y-6 animate-fade-slide-up ${
                        isDark
                            ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                            : "bg-white border-amber-200 shadow-indigo-500/5"
                    }`}
                >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center gap-3">
                        <div
                            className={`flex h-16 w-16 items-center justify-center rounded-full ring-2 ${
                                isDark
                                    ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-400"
                                    : "bg-emerald-50 ring-emerald-400/40 text-emerald-600"
                            }`}
                        >
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                            Walk-In Appointment{" "}
                            <span
                                className={`bg-clip-text text-transparent ${
                                    isDark
                                        ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                        : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                }`}
                            >
                                Confirmed
                            </span>
                        </h1>
                    </div>

                    {/* Details */}
                    <div
                        className={`rounded-xl border p-4 sm:p-5 space-y-2 text-sm ${
                            isDark
                                ? "bg-zinc-800/40 border-zinc-700/60"
                                : "bg-amber-50/60 border-amber-200/60"
                        }`}
                    >
                        <DetailRow label="Patient" value={bookingResult.patientName} isDark={isDark} />
                        <DetailRow label="Doctor" value={`Dr. ${bookingResult.doctorName}`} isDark={isDark} />
                        <DetailRow
                            label="Clinic"
                            value={`${bookingResult.clinicName} (${bookingResult.clinicLocation})`}
                            isDark={isDark}
                        />
                        <DetailRow label="Date" value={bookingResult.appointmentDate} isDark={isDark} />
                        <DetailRow label="Time" value={bookingResult.appointmentTime} isDark={isDark} />
                        <DetailRow
                            label="Status"
                            value={bookingResult.AppointmentStatus}
                            isDark={isDark}
                            isStatus
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            className={`flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-semibold
                            transition-all duration-200 ease-out
                            hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                isDark
                                    ? "border-2 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 focus-visible:ring-emerald-400 focus-visible:ring-offset-zinc-900"
                                    : "border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                            }`}
                        >
                            Book Another Walk-In
                        </button>
                        <Link
                            href={`${APP_URLS.OWNER_DASHBOARD}/patient-module/appointments`}
                            className={`flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-semibold
                            transition-all duration-200 ease-out
                            hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                isDark
                                    ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-900"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                            }`}
                        >
                            View Appointments
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ===== MAIN FORM STATE =====
    return (
        <div className="max-w-3xl mx-auto w-full space-y-8">

            {/* ===== Header ===== */}
            <div className="space-y-4 animate-fade-slide-up">
                <Link
                    href={APP_URLS.OWNER_PATIENT_MODULE}
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
                        Walk-In{" "}
                        <span
                            className={`bg-clip-text text-transparent ${
                                isDark
                                    ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                    : "bg-gradient-to-r from-indigo-500 to-amber-500"
                            }`}
                        >
                            Appointment
                        </span>
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        Today&apos;s schedules ({todayDate})
                        {activeClinic?.clinicName ? (
                            <>
                                {" — "}
                                <span className="font-semibold">{activeClinic.clinicName}</span>
                            </>
                        ) : null}
                    </p>
                </div>
            </div>

            {/* ===== Step 1: Select Doctor Schedule ===== */}
            <div className="space-y-3 animate-fade-slide-up" style={{ animationDelay: "0.05s" }}>
                <h2
                    className={`text-[11px] font-semibold uppercase tracking-[0.18em] flex items-center gap-2 ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                >
                    <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                            isDark
                                ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
                                : "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                        }`}
                    >
                        1
                    </span>
                    Select Doctor Schedule
                </h2>

                {isLoading ? (
                    <FullScreenLoader message="Loading today's schedules..." />
                ) : isError ? (
                    <div
                        className={`p-6 rounded-2xl border text-center ${
                            isDark
                                ? "bg-red-500/10 border-red-500/30 text-red-300"
                                : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    >
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                        <h3 className="font-semibold">Failed to load schedules</h3>
                        <p className="text-sm mt-1 opacity-90">
                            {error instanceof Error ? error.message : "Failed to load schedules"}
                        </p>
                    </div>
                ) : !schedules || schedules.length === 0 ? (
                    <div
                        className={`max-w-lg mx-auto p-8 rounded-2xl border text-center ${
                            isDark
                                ? "bg-zinc-900/60 border-emerald-500/20"
                                : "bg-white border-amber-200"
                        }`}
                    >
                        <CalendarDays
                            className={`w-10 h-10 mx-auto mb-3 ${
                                isDark ? "text-zinc-600" : "text-zinc-400"
                            }`}
                        />
                        <h3 className="text-lg font-semibold mb-1">No active schedules today</h3>
                        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            There are no doctor schedules available for today.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {schedules.map((schedule, index) => {
                            const isSelected = selectedSchedule?.id === schedule.id;
                            return (
                                <button
                                    key={schedule.id}
                                    type="button"
                                    onClick={() => setSelectedSchedule(schedule)}
                                    style={{ animationDelay: `${0.1 + index * 0.04}s` }}
                                    className={`group relative flex flex-col items-start gap-3 p-4 rounded-xl border text-left
                                    transition-all duration-200 ease-out
                                    hover:-translate-y-0.5 hover:shadow-md
                                    active:translate-y-0 active:scale-[0.99]
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                                    animate-fade-slide-up
                                    ${
                                        isSelected
                                            ? isDark
                                                ? "bg-emerald-500/10 border-emerald-400/60 ring-2 ring-emerald-500/30 shadow-emerald-500/10 shadow-md focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                                : "bg-indigo-50 border-indigo-400/60 ring-2 ring-indigo-500/30 shadow-indigo-500/10 shadow-md focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                                            : isDark
                                            ? "bg-zinc-900/60 border-emerald-500/20 hover:border-emerald-400/50 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                            : "bg-white border-amber-200 hover:border-indigo-400/50 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                                    }`}
                                >
                                    {/* Selected checkmark */}
                                    {isSelected && (
                                        <span
                                            className={`absolute top-3 right-3 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                                                isDark
                                                    ? "bg-emerald-500 text-black"
                                                    : "bg-indigo-600 text-white"
                                            }`}
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </span>
                                    )}

                                    {/* Doctor header */}
                                    <div className="flex items-start gap-3 w-full pr-8">
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
                                            <p className="text-base font-semibold truncate">
                                                Dr. {getDoctorFullName(schedule)}
                                            </p>
                                            <span
                                                className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ring-1 ${
                                                    isDark
                                                        ? "bg-amber-500/10 text-amber-300 ring-amber-500/30"
                                                        : "bg-amber-50 text-amber-700 ring-amber-200"
                                                }`}
                                            >
                                                {schedule.qualification}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Time info */}
                                    <div
                                        className={`flex items-center gap-1.5 text-xs ${
                                            isDark ? "text-zinc-300" : "text-zinc-700"
                                        }`}
                                    >
                                        <Clock
                                            className={`w-3.5 h-3.5 ${
                                                isDark ? "text-emerald-400" : "text-indigo-500"
                                            }`}
                                        />
                                        <span className="font-mono">
                                            {minutesToTime(schedule.startTime)} –{" "}
                                            {minutesToTime(schedule.endTime)}
                                        </span>
                                    </div>

                                    {/* Booked status */}
                                    <div
                                        className={`text-xs ${
                                            isDark ? "text-zinc-500" : "text-zinc-500"
                                        }`}
                                    >
                                        {schedule.lastAppointmentEnd !== null
                                            ? `Booked till ${minutesToTime(
                                                  schedule.lastAppointmentEnd
                                              )}`
                                            : "No bookings yet"}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ===== Step 2: Patient Booking Form ===== */}
            {selectedSchedule && (
                <div
                    className="space-y-3 animate-fade-slide-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    <h2
                        className={`text-[11px] font-semibold uppercase tracking-[0.18em] flex items-center gap-2 ${
                            isDark ? "text-zinc-400" : "text-zinc-600"
                        }`}
                    >
                        <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                                isDark
                                    ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
                                    : "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                            }`}
                        >
                            2
                        </span>
                        Enter Patient Details
                    </h2>
                    <div
                        className={`rounded-2xl border shadow-sm p-4 sm:p-6 ${
                            isDark
                                ? "bg-zinc-900/60 border-emerald-500/20"
                                : "bg-white border-amber-200"
                        }`}
                    >
                        <PatientBookingForm
                            scheduleId={selectedSchedule.id}
                            appointmentDate={todayDate}
                            slotLabel={`${minutesToTime(
                                selectedSchedule.startTime
                            )} - ${minutesToTime(selectedSchedule.endTime)}`}
                            onSubmit={(data) =>
                                walkinMutation.mutateAsync(data).then(() => {})
                            }
                            submitLabel="Book Walk-In"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// ===== Helper: Detail Row =====
function DetailRow({
    label,
    value,
    isDark,
    isStatus,
}: {
    label: string;
    value: string;
    isDark: boolean;
    isStatus?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-3">
            <span className={`text-xs font-medium ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                {label}
            </span>
            {isStatus ? (
                <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded ring-1 ${
                        isDark
                            ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                            : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    }`}
                >
                    {value}
                </span>
            ) : (
                <span className={`text-sm font-medium text-right ${isDark ? "text-white" : "text-black"}`}>
                    {value}
                </span>
            )}
        </div>
    );
}