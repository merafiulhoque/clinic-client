"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
    ArrowLeft,
    Stethoscope,
    Loader2,
    ChevronDown,
    AlertCircle,
} from "lucide-react";

import { useDoctorStore } from "@/shared/stores/doctor-store";
import { useClinicStore } from "@/shared/stores/clinic-store";
import {
    assignDoctorToClinicSchema,
    AssignDoctorToClinicData,
} from "@/shared/types/schemas";
import { assignDoctorAction } from "@/actions/doctors/assignDoctorAction";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { DoctorListItem } from "@/shared/types";
import { useThemeStore } from "@/shared/stores/theme-store";

export default function AssignDoctorPage() {
    const queryClient = useQueryClient();
    const { doctors } = useDoctorStore();
    const { availableClinics, activeClinic } = useClinicStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [selectedDoctor, setSelectedDoctor] = useState<DoctorListItem | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AssignDoctorToClinicData>({
        resolver: zodResolver(assignDoctorToClinicSchema),
        defaultValues: {
            doctorId: 0,
            clinicId: 0,
            fees: 0,
        },
    });

    const assignMutation = useMutation({
        mutationFn: async (data: AssignDoctorToClinicData) => {
            const result = await assignDoctorAction(data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result;
        },
        onSuccess: (data) => {
            showToast({ text: data.message, bgColor: "bg-green-600" });
            queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
            reset();
            setSelectedDoctor(null);
        },
        onError: (error: Error) => {
            showToast({
                text: error.message || "Failed to assign doctor",
                bgColor: "bg-red-600",
            });
        },
    });

    const onSubmit = (data: AssignDoctorToClinicData) => {
        assignMutation.mutate(data);
    };

    const handleSelectDoctor = (doctor: DoctorListItem) => {
        setSelectedDoctor(doctor);
        reset({
            doctorId: doctor.doctorId,
            clinicId: activeClinic?.clinicId || 0,
        });
    };

    const isPending = assignMutation.isPending;

    // Shared input styling (theme-aware, floating-label ready)
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
        <div className="space-y-6">

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
                        Assign{" "}
                        <span
                            className={`bg-clip-text text-transparent ${
                                isDark
                                    ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                    : "bg-gradient-to-r from-indigo-500 to-amber-500"
                            }`}
                        >
                            Doctor
                        </span>
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        Link registered doctors to your clinics and set their consultation fees.
                    </p>
                </div>
            </div>

            {/* ===== Form Mode ===== */}
            {selectedDoctor ? (
                <div
                    className={`max-w-xl rounded-2xl border shadow-xl p-5 sm:p-6 animate-fade-slide-up ${
                        isDark
                            ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                            : "bg-white border-amber-200 shadow-indigo-500/5"
                    }`}
                >
                    {/* Selected Doctor Header */}
                    <div
                        className={`flex items-start justify-between gap-3 border-b pb-4 mb-6 ${
                            isDark ? "border-emerald-500/10" : "border-amber-200/60"
                        }`}
                    >
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold truncate">
                                Assigning Dr. {selectedDoctor.fullName}
                            </h3>
                            <p
                                className={`text-xs font-mono mt-1 ${
                                    isDark ? "text-zinc-500" : "text-zinc-500"
                                }`}
                            >
                                ID: {selectedDoctor.doctorId}
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedDoctor(null)}
                            disabled={isPending}
                            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border
                            transition-all duration-200 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            disabled:opacity-50 disabled:pointer-events-none
                            ${
                                isDark
                                    ? "border-zinc-700 text-zinc-400 hover:border-red-500/50 hover:text-red-300 hover:bg-red-500/10 focus-visible:ring-red-400 focus-visible:ring-offset-zinc-900"
                                    : "border-zinc-300 text-zinc-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50 focus-visible:ring-red-500 focus-visible:ring-offset-white"
                            }`}
                        >
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Hidden doctorId */}
                        <input type="hidden" {...register("doctorId", { valueAsNumber: true })} />

                        {/* Clinic Select */}
                        <div>
                            <div className="relative">
                                <select
                                    {...register("clinicId", { valueAsNumber: true })}
                                    id="clinicId"
                                    disabled={isPending}
                                    className={`peer flex h-12 w-full appearance-none rounded-lg border-2 bg-transparent px-3 pr-10 pt-5 pb-1 text-sm transition-all duration-200
                                    focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
                                    ${
                                        isDark
                                            ? `border-zinc-700 text-white
                                               hover:border-zinc-500
                                               focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                                               ${errors.clinicId ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                            : `border-zinc-300 text-black
                                               hover:border-amber-400
                                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                                               ${errors.clinicId ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                    }`}
                                >
                                    <option value="0" className={isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}>
                                        -- Choose a Clinic --
                                    </option>
                                    {availableClinics.map((clinic) => (
                                        <option
                                            key={clinic.clinicId}
                                            value={clinic.clinicId}
                                            className={isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}
                                        >
                                            {clinic.clinicName} ({clinic.clinicLocation})
                                        </option>
                                    ))}
                                </select>

                                {/* Floating label for select — always "up" since select has value */}
                                <label
                                    htmlFor="clinicId"
                                    className={`absolute left-3 top-1.5 text-[11px] font-medium pointer-events-none transition-colors ${
                                        isDark
                                            ? `text-zinc-500 peer-focus:text-emerald-400 ${errors.clinicId ? "text-red-400" : ""}`
                                            : `text-zinc-500 peer-focus:text-indigo-600 ${errors.clinicId ? "text-red-500" : ""}`
                                    }`}
                                >
                                    Select Clinic
                                </label>

                                {/* Custom chevron */}
                                <ChevronDown
                                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                                        isDark ? "text-zinc-400" : "text-zinc-500"
                                    }`}
                                />
                            </div>
                            {errors.clinicId && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.clinicId.message}
                                </p>
                            )}
                        </div>

                        {/* Fees */}
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
                                    {...register("fees", { valueAsNumber: true })}
                                    id="fees"
                                    type="number"
                                    min="0"
                                    placeholder=" "
                                    disabled={isPending}
                                    className={`${inputClass(!!errors.fees)} pl-8`}
                                />
                                <label
                                    htmlFor="fees"
                                    className={`${labelClass(!!errors.fees)} pl-5`}
                                >
                                    Consultation Fees (₹)
                                </label>
                            </div>
                            {errors.fees && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.fees.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <div
                            className={`pt-4 flex justify-end border-t ${
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
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                Confirm Assignment
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* ===== List Mode ===== */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.length === 0 ? (
                        <div
                            className={`col-span-full p-8 text-center rounded-2xl border animate-fade-slide-up ${
                                isDark
                                    ? "bg-zinc-900/40 border-emerald-500/20"
                                    : "bg-amber-50/60 border-amber-200"
                            }`}
                        >
                            <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                                No doctors available. Please add a doctor first.
                            </p>
                        </div>
                    ) : (
                        doctors.map((doctor, index) => (
                            <div
                                key={doctor.doctorId}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between
                                transition-all duration-200 ease-out
                                hover:-translate-y-1 hover:shadow-lg
                                animate-fade-slide-up
                                ${
                                    isDark
                                        ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-400/50 hover:shadow-emerald-500/10"
                                        : "bg-white border-amber-200 shadow-indigo-500/5 hover:border-indigo-400/50 hover:shadow-indigo-500/10"
                                }`}
                            >
                                <div className="flex items-start gap-3 mb-6">
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
                                        <h3 className="font-semibold text-lg leading-tight truncate">
                                            Dr. {doctor.fullName}
                                        </h3>
                                        <span
                                            className={`inline-block mt-1 font-mono text-[10px] px-1.5 py-0.5 rounded ring-1 ${
                                                isDark
                                                    ? "bg-zinc-800/80 text-zinc-400 ring-zinc-700"
                                                    : "bg-amber-50 text-zinc-600 ring-amber-200"
                                            }`}
                                        >
                                            ID: {doctor.doctorId}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSelectDoctor(doctor)}
                                    className={`w-full inline-flex items-center justify-center h-9 px-4 rounded-lg border text-sm font-medium
                                    transition-all duration-200 active:scale-[0.98]
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                                    ${
                                        isDark
                                            ? "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                            : "border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                                    }`}
                                >
                                    Assign to Clinic
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}