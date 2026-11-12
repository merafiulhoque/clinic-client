"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Stethoscope,
    ChevronDown,
    AlertCircle,
    Loader2,
    Building2,
} from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import {
    DoctorOfClinic,
    getAllAssignedDoctorsAction,
} from "@/actions/doctor-clinic/getAll";
import { createScheduleData, createScheduleSchema, Weekday } from "@/shared/types/schemas";
import { createNewScheduleAction } from "@/actions/schedules/createNew";
import { timeToMinutes } from "@/shared/utils/formatTime";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";
import FullScreenLoader from "@/components/ui/Loader";

export default function CreateSchedulePage() {
    const { activeClinic, availableClinics } = useClinicStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [filterMode, setFilterMode] = useState<"CURRENT" | "ALL">("CURRENT");
    const [selectedDoctor, setSelectedDoctor] = useState<
        (DoctorOfClinic & { clinicName: string }) | null
    >(null);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm();

    const { data: allClinicsWithDoctors, isLoading } = useQuery({
        queryKey: ["all-assigned-doctors"],
        queryFn: getAllAssignedDoctorsAction,
    });

    const scheduleMutation = useMutation({
        mutationFn: async (payload: createScheduleData) => {
            const result = await createNewScheduleAction(payload);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: () => {
            showToast({
                text: "Schedule created successfully",
                textColor: "white",
                bgColor: "bg-green-600",
            });
            reset();
        },
        onError: (error: Error) => {
            showToast({
                text: error.message,
                textColor: "white",
                bgColor: "bg-red-600",
            });
        },
    });

    const onSubmit = (formData: any) => {
        if (!selectedDoctor) return;

        const startTimeInMinutes = timeToMinutes(formData.startTimeStr);
        const endTimeInMinutes = timeToMinutes(formData.endTimeStr);

        const payload = {
            doctorClinicId: selectedDoctor.doctorClinicId,
            dayOfWeek: formData.dayOfWeek,
            startTime: startTimeInMinutes,
            endTime: endTimeInMinutes,
        };

        // 1. Client-side Zod Validation
        const parsed = createScheduleSchema.safeParse(payload);

        if (!parsed.success) {
            // 2. Map Zod errors below specific form fields
            parsed.error.issues.forEach((issue) => {
                const path = issue.path[0];
                if (path === "startTime") {
                    setError("startTimeStr", { type: "manual", message: issue.message });
                } else if (path === "endTime") {
                    setError("endTimeStr", { type: "manual", message: issue.message });
                } else {
                    setError(path as string, { type: "manual", message: issue.message });
                }
            });
            return;
        }

        // 3. Mutate if validation passes
        scheduleMutation.mutate(parsed.data);
    };

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

    const getClinicName = (clinicId: number) => {
        const clinic = availableClinics.find((c) => c.clinicId === clinicId);
        return clinic ? clinic.clinicName : `Clinic ID: ${clinicId}`;
    };

    const filteredData =
        filterMode === "CURRENT"
            ? allClinicsWithDoctors?.filter((c) => c.clinicId === activeClinic.clinicId) || []
            : allClinicsWithDoctors || [];

    const isPending = scheduleMutation.isPending;

    // Shared input styling
    const inputClass = (hasError?: boolean) =>
        `peer flex h-12 w-full rounded-lg border-2 bg-transparent px-3 pt-5 pb-1 text-sm transition-all duration-200
        focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
        ${
            isDark
                ? `border-zinc-700 text-white placeholder:text-transparent
                   hover:border-zinc-500
                   focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                   [color-scheme:dark]
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
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">

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

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Create Doctor{" "}
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
                </div>
            </div>

            {/* ===== Loading ===== */}
            {isLoading ? (
                <FullScreenLoader message="Loading doctors..." />
            ) : !selectedDoctor ? (
                /* ===== Stage 1: Doctor Selection ===== */
                <div className="flex flex-col gap-6">
                    {/* Filter pills */}
                    <div
                        className={`flex gap-2 p-1.5 rounded-xl border w-fit ${
                            isDark
                                ? "bg-zinc-900/50 border-emerald-500/20"
                                : "bg-white border-amber-200"
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => setFilterMode("CURRENT")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                filterMode === "CURRENT"
                                    ? isDark
                                        ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40 shadow-sm"
                                        : "bg-indigo-600 text-white shadow-sm"
                                    : isDark
                                    ? "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                    : "text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50"
                            }`}
                        >
                            Only for {activeClinic.clinicName}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterMode("ALL")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                filterMode === "ALL"
                                    ? isDark
                                        ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40 shadow-sm"
                                        : "bg-indigo-600 text-white shadow-sm"
                                    : isDark
                                    ? "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                    : "text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50"
                            }`}
                        >
                            All Clinics
                        </button>
                    </div>

                    {/* Doctor list */}
                    {filteredData.length === 0 ? (
                        <div
                            className={`p-8 text-center rounded-2xl border animate-fade-slide-up ${
                                isDark
                                    ? "bg-zinc-900/40 border-emerald-500/20 text-zinc-400"
                                    : "bg-amber-50/60 border-amber-200 text-zinc-600"
                            }`}
                        >
                            <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-medium">
                                No doctors found for the selected view.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {filteredData.map((clinicData, cIdx) => {
                                const clinicName = getClinicName(clinicData.clinicId);
                                return (
                                    <div
                                        key={clinicData.clinicId}
                                        style={{ animationDelay: `${cIdx * 60}ms` }}
                                        className={`rounded-2xl border p-5 animate-fade-slide-up ${
                                            isDark
                                                ? "bg-zinc-900/60 border-emerald-500/20"
                                                : "bg-white border-amber-200"
                                        }`}
                                    >
                                        {/* Clinic header */}
                                        <div
                                            className={`flex items-center gap-2 border-b pb-3 mb-4 ${
                                                isDark ? "border-emerald-500/10" : "border-amber-200/60"
                                            }`}
                                        >
                                            <div
                                                className={`p-1.5 rounded-lg ${
                                                    isDark
                                                        ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                                        : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
                                                }`}
                                            >
                                                <Building2 className="w-4 h-4" />
                                            </div>
                                            <h3 className="font-semibold text-sm sm:text-base truncate">
                                                {clinicName}
                                            </h3>
                                        </div>

                                        {clinicData.doctorsOfThisClinic.length === 0 ? (
                                            <p
                                                className={`text-sm ${
                                                    isDark ? "text-zinc-500" : "text-zinc-500"
                                                }`}
                                            >
                                                No doctors assigned.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {clinicData.doctorsOfThisClinic.map((doc) => (
                                                    <button
                                                        key={doc.doctorClinicId}
                                                        onClick={() =>
                                                            setSelectedDoctor({ ...doc, clinicName })
                                                        }
                                                        className={`group flex items-center gap-3 p-3 rounded-lg border text-left
                                                        transition-all duration-200 ease-out
                                                        hover:-translate-y-0.5 hover:shadow-md
                                                        active:translate-y-0 active:scale-[0.99]
                                                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                                                        ${
                                                            isDark
                                                                ? "border-emerald-500/20 bg-zinc-800/40 hover:border-emerald-400/60 hover:bg-emerald-500/5 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                                                : "border-amber-200 bg-amber-50/40 hover:border-indigo-300 hover:bg-indigo-50/60 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                                isDark
                                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                                    : "bg-indigo-100 text-indigo-500"
                                                            }`}
                                                        >
                                                            <Stethoscope className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-medium text-sm truncate">
                                                            Dr. {doc.doctorName}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                /* ===== Stage 2: Schedule Form ===== */
                <div className="flex flex-col gap-5">
                    {/* Selected doctor header */}
                    <div
                        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-2xl border animate-fade-slide-up ${
                            isDark
                                ? "bg-zinc-900/60 border-emerald-500/20"
                                : "bg-white border-amber-200"
                        }`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                    isDark
                                        ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                        : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
                                }`}
                            >
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold truncate">
                                    Scheduling for: Dr. {selectedDoctor.doctorName}
                                </p>
                                <p
                                    className={`text-xs truncate ${
                                        isDark ? "text-zinc-400" : "text-zinc-600"
                                    }`}
                                >
                                    Clinic: {selectedDoctor.clinicName}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedDoctor(null)}
                            className={`shrink-0 px-4 py-2 rounded-lg border text-sm font-medium
                            transition-all duration-200 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                isDark
                                    ? "border-zinc-700 text-zinc-300 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                    : "border-zinc-300 text-zinc-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                            }`}
                        >
                            Change Doctor
                        </button>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className={`flex flex-col gap-6 p-5 sm:p-6 rounded-2xl border animate-fade-slide-up ${
                            isDark
                                ? "bg-zinc-900/60 border-emerald-500/20"
                                : "bg-white border-amber-200"
                        }`}
                        style={{ animationDelay: "0.05s" }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            {/* Day of Week — select */}
                            <div>
                                <div className="relative">
                                    <select
                                        {...register("dayOfWeek")}
                                        required
                                        className={`peer flex h-12 w-full appearance-none rounded-lg border-2 bg-transparent px-3 pr-10 pt-5 pb-1 text-sm transition-all duration-200
                                        focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
                                        ${
                                            isDark
                                                ? `border-zinc-700 text-white
                                                   hover:border-zinc-500
                                                   focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                                                   ${errors.dayOfWeek ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                                : `border-zinc-300 text-black
                                                   hover:border-amber-400
                                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                                                   ${errors.dayOfWeek ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                        }`}
                                    >
                                        <option
                                            value=""
                                            className={isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}
                                        >
                                            -- Select Day --
                                        </option>
                                        {Weekday.map((day) => (
                                            <option
                                                key={day}
                                                value={day}
                                                className={isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}
                                            >
                                                {day}
                                            </option>
                                        ))}
                                    </select>

                                    <label
                                        htmlFor="dayOfWeek"
                                        className={`absolute left-3 top-1.5 text-[11px] font-medium pointer-events-none transition-colors ${
                                            isDark
                                                ? `text-zinc-500 peer-focus:text-emerald-400 ${errors.dayOfWeek ? "text-red-400" : ""}`
                                                : `text-zinc-500 peer-focus:text-indigo-600 ${errors.dayOfWeek ? "text-red-500" : ""}`
                                        }`}
                                    >
                                        <Calendar className="inline w-3 h-3 mr-1 -mt-0.5" />
                                        Day of Week
                                    </label>

                                    <ChevronDown
                                        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                                            isDark ? "text-zinc-400" : "text-zinc-500"
                                        }`}
                                    />
                                </div>
                                {errors.dayOfWeek && (
                                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                        {String(errors.dayOfWeek.message)}
                                    </p>
                                )}
                            </div>

                            {/* Start Time */}
                            <div>
                                <div className="relative">
                                    <input
                                        type="time"
                                        {...register("startTimeStr")}
                                        required
                                        placeholder=" "
                                        className={inputClass(!!errors.startTimeStr)}
                                    />
                                    <label
                                        htmlFor="startTimeStr"
                                        className={labelClass(!!errors.startTimeStr)}
                                    >
                                        <Clock className="inline w-3 h-3 mr-1 -mt-0.5" />
                                        Start Time
                                    </label>
                                </div>
                                {errors.startTimeStr && (
                                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                        {String(errors.startTimeStr.message)}
                                    </p>
                                )}
                            </div>

                            {/* End Time */}
                            <div>
                                <div className="relative">
                                    <input
                                        type="time"
                                        {...register("endTimeStr")}
                                        required
                                        placeholder=" "
                                        className={inputClass(!!errors.endTimeStr)}
                                    />
                                    <label
                                        htmlFor="endTimeStr"
                                        className={labelClass(!!errors.endTimeStr)}
                                    >
                                        <Clock className="inline w-3 h-3 mr-1 -mt-0.5" />
                                        End Time
                                    </label>
                                </div>
                                {errors.endTimeStr && (
                                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                        {String(errors.endTimeStr.message)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <div
                            className={`flex justify-end pt-4 border-t ${
                                isDark ? "border-emerald-500/10" : "border-amber-200/60"
                            }`}
                        >
                            <button
                                type="submit"
                                disabled={isPending}
                                className={`inline-flex items-center justify-center gap-2 h-11 px-7 rounded-lg text-sm font-semibold
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
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : null}
                                {isPending ? "Saving..." : "Save Schedule"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}