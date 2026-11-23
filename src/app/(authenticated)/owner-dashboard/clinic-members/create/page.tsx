"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import {
    ArrowLeft,
    UserPlus,
    ChevronDown,
    AlertCircle,
    Loader2,
} from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { memberCreateSchema, memberCreateData } from "@/shared/types/schemas";
import { createClinicMemberAction } from "@/actions/clinic-members/createNew";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";

export default function CreateClinicMemberPage() {
    const { activeClinic } = useClinicStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<memberCreateData>({
        resolver: zodResolver(memberCreateSchema),
        defaultValues: {
            clinicId: activeClinic?.clinicId,
        },
    });

    const memberMutation = useMutation({
        mutationFn: async (payload: memberCreateData) => {
            const result = await createClinicMemberAction(payload);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: (data) => {
            showToast({
                text: data.message,
                textColor: "white",
                bgColor: "bg-green-600",
            });
            reset({
                clinicId: activeClinic?.clinicId,
                email: "",
                password: "",
                role: undefined,
            });
            history.back();
        },
        onError: (error: Error) => {
            showToast({
                text: error.message,
                textColor: "white",
                bgColor: "bg-red-600",
            });
        },
    });

    const onSubmit = (data: memberCreateData) => {
        memberMutation.mutate(data);
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

    const isPending = memberMutation.isPending;

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
        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">

            {/* ===== Header ===== */}
            <div className="space-y-4 animate-fade-slide-up">
                <Link
                    href={`${APP_URLS.OWNER_DASHBOARD}/clinic-members`}
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
                    Back to Staff Management
                </Link>

                <div className="flex items-center gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${
                            isDark
                                ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-400"
                                : "bg-indigo-50 ring-indigo-200 text-indigo-600"
                        }`}
                    >
                        <UserPlus className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Create Clinic{" "}
                            <span
                                className={`bg-clip-text text-transparent ${
                                    isDark
                                        ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                        : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                }`}
                            >
                                Member
                            </span>
                        </h1>
                        <p className={`text-sm truncate ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            Adding member to:{" "}
                            <span className="font-semibold">
                                {activeClinic.clinicName}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== Form Card ===== */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`relative overflow-hidden flex flex-col gap-5 p-5 sm:p-6 md:p-8 rounded-2xl border shadow-xl animate-fade-slide-up ${
                    isDark
                        ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                        : "bg-white border-amber-200 shadow-indigo-500/5"
                }`}
                style={{ animationDelay: "0.1s" }}
            >
                {/* Top accent line */}
                <div
                    className={`pointer-events-none absolute inset-x-0 top-0 h-px opacity-70 bg-gradient-to-r ${
                        isDark
                            ? "from-transparent via-emerald-400/60 to-transparent"
                            : "from-transparent via-indigo-400/60 to-transparent"
                    }`}
                />

                {/* Hidden Clinic ID */}
                <input type="hidden" {...register("clinicId", { valueAsNumber: true })} />

                {/* Name */}
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            {...register("name")}
                            id="name"
                            placeholder=" "
                            disabled={isPending}
                            className={inputClass(!!errors.name)}
                        />
                        <label htmlFor="name" className={labelClass(!!errors.name)}>
                            Full Name
                        </label>
                    </div>
                    {errors.name && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <div className="relative">
                        <input
                            type="email"
                            {...register("email")}
                            id="email"
                            placeholder=" "
                            disabled={isPending}
                            className={inputClass(!!errors.email)}
                        />
                        <label htmlFor="email" className={labelClass(!!errors.email)}>
                            Email Address
                        </label>
                    </div>
                    {errors.email && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            {...register("password")}
                            id="password"
                            placeholder=" "
                            disabled={isPending}
                            className={inputClass(!!errors.password)}
                        />
                        <label htmlFor="password" className={labelClass(!!errors.password)}>
                            Temporary Password
                        </label>
                    </div>
                    {errors.password && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Role */}
                <div>
                    <div className="relative">
                        <select
                            {...register("role")}
                            id="role"
                            disabled={isPending}
                            className={`peer flex h-12 w-full appearance-none rounded-lg border-2 bg-transparent px-3 pr-10 pt-5 pb-1 text-sm transition-all duration-200
                            focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
                            ${
                                isDark
                                    ? `border-zinc-700 text-white
                                       hover:border-zinc-500
                                       focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                                       ${errors.role ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                    : `border-zinc-300 text-black
                                       hover:border-amber-400
                                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                                       ${errors.role ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                            }`}
                        >
                            <option
                                value=""
                                className={isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}
                            >
                                -- Select Role --
                            </option>
                            <option
                                value="MANAGER"
                                className={isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}
                            >
                                Manager
                            </option>
                            <option
                                value="RECEPTIONIST"
                                className={isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}
                            >
                                Receptionist
                            </option>
                            <option
                                value="STAFF"
                                className={isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}
                            >
                                Staff
                            </option>
                        </select>

                        <label
                            htmlFor="role"
                            className={`absolute left-3 top-1.5 text-[11px] font-medium pointer-events-none transition-colors ${
                                isDark
                                    ? `text-zinc-500 peer-focus:text-emerald-400 ${errors.role ? "text-red-400" : ""}`
                                    : `text-zinc-500 peer-focus:text-indigo-600 ${errors.role ? "text-red-500" : ""}`
                            }`}
                        >
                            Assign Role
                        </label>

                        <ChevronDown
                            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                                isDark ? "text-zinc-400" : "text-zinc-500"
                            }`}
                        />
                    </div>
                    {errors.role && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {errors.role.message}
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
                        {isPending ? "Creating..." : "Create Member"}
                    </button>
                </div>
            </form>
        </div>
    );
}