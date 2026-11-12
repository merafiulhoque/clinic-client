"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Loader2,
    ArrowLeft,
    Building2,
    AlertCircle,
} from "lucide-react";

import { clinicCreateSchema, ClinicCreateData } from "@/shared/types/schemas";
import { createClinicAction } from "@/actions/clinics/createClinic";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";

export default function CreateClinicPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClinicCreateData>({
        resolver: zodResolver(clinicCreateSchema),
    });

    const createMutation = useMutation({
        mutationFn: async (data: ClinicCreateData) => {
            const result = await createClinicAction(data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result;
        },
        onSuccess: (data) => {
            showToast({ text: data.message, bgColor: "bg-green-600" });
            queryClient.invalidateQueries({ queryKey: ["clinic", "info"] });
            router.push(APP_URLS.CLINIC_SELECTION);
        },
        onError: (error: Error) => {
            showToast({
                text: error.message || "Failed to create clinic",
                bgColor: "bg-red-600",
            });
        },
    });

    const onSubmit = (data: ClinicCreateData) => {
        createMutation.mutate(data);
    };

    const isPending = createMutation.isPending;

    // Shared input/label helpers
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
        <div className="max-w-md mx-auto w-full space-y-6">

            {/* ===== Back link ===== */}
            <div className="animate-fade-slide-up">
                <Link
                    href={APP_URLS.CLINIC_SELECTION}
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
                    Back to Clinic Selection
                </Link>
            </div>

            {/* ===== Card ===== */}
            <div
                className={`rounded-2xl border shadow-xl backdrop-blur-sm p-6 sm:p-8 animate-fade-slide-up ${
                    isDark
                        ? "bg-zinc-900/80 border-emerald-500/20 shadow-emerald-500/5"
                        : "bg-white border-amber-200 shadow-indigo-500/5"
                }`}
                style={{ animationDelay: "0.05s" }}
            >
                {/* Header */}
                <div className="text-center space-y-3 mb-8">
                    <div className="flex justify-center">
                        <div
                            className={`p-3 rounded-full ${
                                isDark
                                    ? "bg-emerald-500/10 ring-2 ring-emerald-500/30"
                                    : "bg-indigo-500/10 ring-2 ring-indigo-500/30"
                            }`}
                        >
                            <Building2
                                className={`h-6 w-6 ${
                                    isDark ? "text-emerald-400" : "text-indigo-500"
                                }`}
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Register{" "}
                        <span
                            className={`bg-clip-text text-transparent ${
                                isDark
                                    ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                    : "bg-gradient-to-r from-indigo-500 to-amber-500"
                            }`}
                        >
                            Clinic
                        </span>
                    </h1>
                    <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        Enter your clinic details to set up your workspace
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Clinic Name */}
                    <div>
                        <div className="relative">
                            <input
                                {...register("name")}
                                id="name"
                                type="text"
                                placeholder=" "
                                disabled={isPending}
                                className={inputClass(!!errors.name)}
                            />
                            <label htmlFor="name" className={labelClass(!!errors.name)}>
                                Clinic Name <span className={isDark ? "text-amber-300" : "text-amber-500"}>*</span>
                            </label>
                        </div>
                        {errors.name ? (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {errors.name.message}
                            </p>
                        ) : (
                            <p className={`mt-1.5 text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                e.g., Arogya Health Center
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <div className="relative">
                            <input
                                {...register("location")}
                                id="location"
                                type="text"
                                placeholder=" "
                                disabled={isPending}
                                className={inputClass(!!errors.location)}
                            />
                            <label htmlFor="location" className={labelClass(!!errors.location)}>
                                Location <span className={isDark ? "text-amber-300" : "text-amber-500"}>*</span>
                            </label>
                        </div>
                        {errors.location ? (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {errors.location.message}
                            </p>
                        ) : (
                            <p className={`mt-1.5 text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                e.g., Kolkata, West Bengal
                            </p>
                        )}
                    </div>

                    {/* Owner Name */}
                    <div>
                        <div className="relative">
                            <input
                                {...register("ownerName")}
                                id="ownerName"
                                type="text"
                                placeholder=" "
                                disabled={isPending}
                                className={inputClass(!!errors.ownerName)}
                            />
                            <label htmlFor="ownerName" className={labelClass(!!errors.ownerName)}>
                                Owner's Name <span className={isDark ? "text-amber-300" : "text-amber-500"}>*</span>
                            </label>
                        </div>
                        {errors.ownerName ? (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                {errors.ownerName.message}
                            </p>
                        ) : (
                            <p className={`mt-1.5 text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                e.g., John Doe
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`group inline-flex w-full items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold
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
                        Create Clinic
                    </button>
                </form>
            </div>
        </div>
    );
}