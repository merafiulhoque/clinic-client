"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Phone, User } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { BookingFormData, bookingFormSchema } from "@/shared/types/schemas";
import { useThemeStore } from "@/shared/stores/theme-store";

interface PatientBookingFormProps {
    scheduleId: number;
    appointmentDate: string;
    slotLabel: string;
    onSubmit: (data: BookingFormData) => Promise<void> | void;
    submitLabel?: string;
    defaultPatientName?: string;
    defaultPatientPhone?: string;
}

export function PatientBookingForm({
    scheduleId,
    appointmentDate,
    slotLabel,
    onSubmit,
    submitLabel = "Confirm Appointment",
    defaultPatientName = "",
    defaultPatientPhone = "",
}: PatientBookingFormProps) {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const idempotencyKey = useMemo(() => uuidv4(), []);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            scheduleId,
            appointmentDate,
            idempotencyKey,
            patientName: defaultPatientName,
            patientPhone: defaultPatientPhone,
        },
    });

    // Keep scheduleId and appointmentDate synced if the user switches slots/dates
    useEffect(() => {
        setValue("scheduleId", scheduleId);
    }, [scheduleId, setValue]);

    useEffect(() => {
        setValue("appointmentDate", appointmentDate);
    }, [appointmentDate, setValue]);

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
                    {slotLabel}
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
                    <p className="mt-1.5 text-[11px] text-zinc-500">
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
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Booking..." : submitLabel}
                </button>
            </div>
        </form>
    );
}