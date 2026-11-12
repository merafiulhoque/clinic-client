"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    AlertCircle,
    User,
    Mail,
    Phone,
    Loader2,
} from "lucide-react";

import { getSlotsAction, bookSlotAction } from "@/actions/public/booking";
import {
    BookingFormData,
    bookingFormSchema,
    PublicSlot,
} from "@/shared/types/schemas";
import { minutesToTime } from "@/shared/utils/formatTime";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";
import FullScreenLoader from "@/components/ui/Loader";

export default function ViewSlotsPage({
    params,
    searchParams,
}: {
    params: Promise<{ publicId: string }>;
    searchParams: Promise<{ date: string }>;
}) {
    const router = useRouter();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const { publicId } = use(params);
    const { date } = use(searchParams);

    const [selectedSlot, setSelectedSlot] = useState<PublicSlot | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const {
        data: slots,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["doctor-slots", publicId, date],
        queryFn: () => getSlotsAction(publicId, date),
        enabled: !!date,
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            appointmentDate: date,
            idempotencyKey: crypto.randomUUID(),
        },
    });

    const handleSlotSelect = (slot: PublicSlot) => {
        setSelectedSlot(slot);
        setValue("scheduleId", slot.scheduleId);
    };

    const onSubmit = async (data: BookingFormData) => {
        try {
            await bookSlotAction(data);
            setBookingSuccess(true);
        } catch (err: any) {
            showToast({
                text: err.message || "Failed to book appointment",
                bgColor: "bg-red-600",
            });
        }
    };

    // ===== Success State =====
    if (bookingSuccess) {
        return (
            <div
                className={`relative min-h-screen transition-colors duration-500 ${
                    isDark ? "bg-black text-white" : "bg-[#fdfcfb] text-black"
                }`}
            >
                {/* Decor */}
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
                </div>

                <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
                    <div
                        className={`rounded-2xl border shadow-xl p-8 sm:p-10 text-center animate-fade-slide-up ${
                            isDark
                                ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                                : "bg-white border-amber-200 shadow-indigo-500/5"
                        }`}
                    >
                        <div
                            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                                isDark
                                    ? "bg-emerald-500/10 ring-2 ring-emerald-500/40 text-emerald-400"
                                    : "bg-indigo-50 ring-2 ring-indigo-500/30 text-indigo-500"
                            }`}
                        >
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                            Appointment{" "}
                            <span
                                className={`bg-clip-text text-transparent ${
                                    isDark
                                        ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                        : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                }`}
                            >
                                Confirmed!
                            </span>
                        </h1>
                        <p className={`text-sm sm:text-base ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            Your booking for{" "}
                            <span className="font-semibold text-amber-500">
                                {date}
                            </span>{" "}
                            at{" "}
                            <span className="font-semibold text-amber-500">
                                {minutesToTime(selectedSlot?.availableTime || 0)}
                            </span>{" "}
                            has been successfully confirmed.
                        </p>

                        <button
                            onClick={() => router.push(APP_URLS.PATIENTS_CORNER)}
                            className={`mt-8 inline-flex items-center justify-center gap-2 h-11 px-7 rounded-lg text-sm font-semibold
                            transition-all duration-200 ease-out
                            hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                isDark
                                    ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-black"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                            }`}
                        >
                            Return to Search
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Shared styling helpers
    const inputClass = (hasError?: boolean) =>
        `peer flex h-12 w-full rounded-lg border-2 bg-transparent px-3 pt-5 pb-1 text-sm transition-all duration-200
        focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
        ${
            isDark
                ? `border-zinc-700 text-white placeholder:text-transparent
                   hover:border-zinc-500
                   focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                   ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                : `border-zinc-300 text-black placeholder:text-transparent
                   hover:border-amber-400
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                   ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
        }`;

    const labelClass = (hasError?: boolean) =>
        `absolute left-3 top-1.5 text-[11px] font-medium transition-all duration-200 pointer-events-none
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
        peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
        ${
            isDark
                ? `text-zinc-500 peer-focus:text-emerald-400 peer-placeholder-shown:text-zinc-400
                   ${hasError ? "peer-focus:text-red-400" : ""}`
                : `text-zinc-500 peer-focus:text-indigo-600 peer-placeholder-shown:text-zinc-500
                   ${hasError ? "peer-focus:text-red-500" : ""}`
        }`;

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
                                Available Time{" "}
                                <span
                                    className={`bg-clip-text text-transparent ${
                                        isDark
                                            ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                            : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                    }`}
                                >
                                    Slots
                                </span>
                            </h1>
                            <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                Showing available times for:{" "}
                                <span className="font-semibold text-amber-500">{date}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== Slots ===== */}
                <div className="flex flex-col gap-4 animate-fade-slide-up" style={{ animationDelay: "0.05s" }}>
                    {isLoading ? (
                        <FullScreenLoader message="Checking available times..." />
                    ) : isError ? (
                        <div
                            className={`p-6 rounded-2xl border text-center ${
                                isDark
                                    ? "bg-red-500/10 border-red-500/30 text-red-300"
                                    : "bg-red-50 border-red-200 text-red-700"
                            }`}
                        >
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                            <h3 className="font-semibold">Failed to load slots</h3>
                            <p className="text-sm mt-1 opacity-90">
                                {error instanceof Error ? error.message : "Failed to load"}
                            </p>
                        </div>
                    ) : !slots || slots.length === 0 ? (
                        <div
                            className={`p-8 rounded-2xl border text-center ${
                                isDark
                                    ? "bg-zinc-900/60 border-emerald-500/20"
                                    : "bg-white border-amber-200"
                            }`}
                        >
                            <Clock
                                className={`w-8 h-8 mx-auto mb-2 ${
                                    isDark ? "text-zinc-600" : "text-zinc-400"
                                }`}
                            />
                            <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                No available slots found for this date.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h2
                                className={`text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                                    isDark ? "text-zinc-400" : "text-zinc-600"
                                }`}
                            >
                                <Clock
                                    className={`w-4 h-4 ${
                                        isDark ? "text-emerald-400" : "text-indigo-500"
                                    }`}
                                />
                                Select a Time Slot
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {slots.map((slot, index) => {
                                    const isSelected =
                                        selectedSlot?.scheduleId === slot.scheduleId;
                                    return (
                                        <button
                                            key={slot.scheduleId}
                                            onClick={() => handleSlotSelect(slot)}
                                            style={{ animationDelay: `${index * 30}ms` }}
                                            className={`group relative p-4 rounded-xl border-2 font-semibold text-sm
                                            transition-all duration-200 ease-out
                                            hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                                            animate-fade-slide-up
                                            ${
                                                isSelected
                                                    ? isDark
                                                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-black border-emerald-400 shadow-lg shadow-emerald-500/30 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                                        : "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                                                    : isDark
                                                    ? "bg-zinc-900/60 text-zinc-200 border-emerald-500/20 hover:border-emerald-400/60 hover:bg-emerald-500/5 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                                    : "bg-white text-zinc-700 border-amber-200 hover:border-indigo-400 hover:bg-indigo-50 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                                            }`}
                                        >
                                            {minutesToTime(slot.availableTime)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== Booking Form ===== */}
                {selectedSlot && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className={`rounded-2xl border shadow-xl p-5 sm:p-6 space-y-5 animate-fade-slide-up ${
                            isDark
                                ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                                : "bg-white border-amber-200 shadow-indigo-500/5"
                        }`}
                    >
                        <div
                            className={`flex items-center gap-2 border-b pb-3 ${
                                isDark ? "border-emerald-500/10" : "border-amber-200/60"
                            }`}
                        >
                            <User
                                className={`w-4 h-4 ${
                                    isDark ? "text-emerald-400" : "text-indigo-500"
                                }`}
                            />
                            <h2 className="font-semibold text-base">Patient Details</h2>
                            <span
                                className={`ml-auto text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ring-1 ${
                                    isDark
                                        ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                                        : "bg-indigo-50 text-indigo-600 ring-indigo-200"
                                }`}
                            >
                                {minutesToTime(selectedSlot.availableTime)}
                            </span>
                        </div>

                        {/* Full Name */}
                        <div>
                            <div className="relative">
                                <User
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                                        isDark ? "text-zinc-500" : "text-zinc-400"
                                    }`}
                                />
                                <input
                                    type="text"
                                    {...register("patientName")}
                                    id="patientName"
                                    placeholder=" "
                                    className={`${inputClass(!!errors.patientName)} pl-9`}
                                />
                                <label
                                    htmlFor="patientName"
                                    className={`${labelClass(!!errors.patientName)} pl-6`}
                                >
                                    Full Name
                                </label>
                            </div>
                            {errors.patientName && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.patientName.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <div className="relative">
                                <Mail
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                                        isDark ? "text-zinc-500" : "text-zinc-400"
                                    }`}
                                />
                                <input
                                    type="email"
                                    {...register("patientEmail")}
                                    id="patientEmail"
                                    placeholder=" "
                                    className={`${inputClass(!!errors.patientEmail)} pl-9`}
                                />
                                <label
                                    htmlFor="patientEmail"
                                    className={`${labelClass(!!errors.patientEmail)} pl-6`}
                                >
                                    Email Address
                                </label>
                            </div>
                            {errors.patientEmail && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.patientEmail.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <div className="relative">
                                <Phone
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                                        isDark ? "text-zinc-500" : "text-zinc-400"
                                    }`}
                                />
                                <input
                                    type="tel"
                                    {...register("patientPhone")}
                                    id="patientPhone"
                                    placeholder=" "
                                    className={`${inputClass(!!errors.patientPhone)} pl-9`}
                                />
                                <label
                                    htmlFor="patientPhone"
                                    className={`${labelClass(!!errors.patientPhone)} pl-6`}
                                >
                                    Phone Number
                                </label>
                            </div>
                            {errors.patientPhone ? (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.patientPhone.message}
                                </p>
                            ) : (
                                <p className={`mt-1.5 text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                    e.g. +91 98765 43210
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <div
                            className={`flex justify-end pt-4 border-t ${
                                isDark ? "border-emerald-500/10" : "border-amber-200/60"
                            }`}
                        >
                            <button
                                type="submit"
                                disabled={isSubmitting}
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
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : null}
                                {isSubmitting ? "Booking..." : "Confirm Appointment"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}