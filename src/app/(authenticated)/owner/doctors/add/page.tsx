"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";

import { createDoctorSchema, CreateDoctorData } from "@/shared/types/schemas";
import { createDoctorAction } from "@/actions/doctors/createNewDoctor";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";
import { SECTION_ACCENTS } from "@/shared/config/modules/owner_modules/doctor_modules";
import SectionHeader from "@/components/ui/SectionHeader";





export default function AddDoctorPage() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateDoctorData>({
        resolver: zodResolver(createDoctorSchema),
    });

    const createMutation = useMutation({
        mutationFn: async (data: CreateDoctorData) => {
            const result = await createDoctorAction(data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result;
        },
        onSuccess: (data) => {
            showToast({ text: data.message, bgColor: "bg-green-600" });
            reset();
            router.push(`${APP_URLS.OWNER_DASHBOARD}/doctors`);
        },
        onError: (error: Error) => {
            showToast({
                text: error.message || "Failed to add doctor",
                bgColor: "bg-red-600",
            });
        },
    });

    const onSubmit = (data: CreateDoctorData) => {
        createMutation.mutate(data);
    };

    const isPending = createMutation.isPending;

    // Input styling helper (theme-aware)
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
        <div className="relative isolate mx-auto max-w-3xl space-y-8">

            {/* ===== Back link ===== */}
            <Link
                href={`${APP_URLS.OWNER_DASHBOARD}/doctors`}
                className={`group inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium
                transition-all duration-200 animate-fade-slide-up
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

            {/* ===== Header ===== */}
            <div
                className="flex items-center gap-4 animate-fade-slide-up"
                style={{ animationDelay: "0.05s" }}
            >
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${
                        isDark
                            ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-400"
                            : "bg-indigo-50 ring-indigo-200 text-indigo-600"
                    }`}
                >
                    <UserPlus className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Add New{" "}
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
                    <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        Register a new medical professional in the system.
                    </p>
                </div>
            </div>

            {/* ===== Form Card ===== */}
            <div
                className={`relative overflow-hidden rounded-2xl border shadow-xl p-5 sm:p-6 md:p-8 animate-fade-slide-up ${
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">

                        {/* ===== 01 Account Details ===== */}
                        <SectionHeader accent={SECTION_ACCENTS[0]} title="Account Details" isDark={isDark} />

                        {/* Email */}
                        <div>
                            <div className="relative">
                                <input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    placeholder=" "
                                    disabled={isPending}
                                    className={inputClass(!!errors.email)}
                                />
                                <label htmlFor="email" className={labelClass(!!errors.email)}>
                                    Email <span className={isDark ? "text-amber-300" : "text-amber-500"}>*</span>
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
                                    {...register("password")}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder=" "
                                    disabled={isPending}
                                    className={`${inputClass(!!errors.password)} pr-11`}
                                />
                                <label htmlFor="password" className={labelClass(!!errors.password)}>
                                    Password <span className={isDark ? "text-amber-300" : "text-amber-500"}>*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    disabled={isPending}
                                    tabIndex={-1}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors disabled:opacity-50 ${
                                        isDark
                                            ? "text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                                            : "text-zinc-500 hover:text-indigo-600 hover:bg-indigo-500/10"
                                    }`}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* ===== 02 Personal Details ===== */}
                        <SectionHeader accent={SECTION_ACCENTS[1]} title="Personal Details" isDark={isDark} />

                        {/* First Name */}
                        <div>
                            <div className="relative">
                                <input
                                    {...register("firstName")}
                                    id="firstName"
                                    placeholder=" "
                                    disabled={isPending}
                                    className={inputClass(!!errors.firstName)}
                                />
                                <label htmlFor="firstName" className={labelClass(!!errors.firstName)}>
                                    First Name <span className={isDark ? "text-amber-300" : "text-amber-500"}>*</span>
                                </label>
                            </div>
                            {errors.firstName && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        {/* Middle Name */}
                        <div className="relative">
                            <input
                                {...register("middleName")}
                                id="middleName"
                                placeholder=" "
                                disabled={isPending}
                                className={inputClass(false)}
                            />
                            <label htmlFor="middleName" className={labelClass(false)}>
                                Middle Name
                            </label>
                        </div>

                        {/* Last Name — spans full row on md so grid stays balanced */}
                        <div className="relative md:col-span-2">
                            <input
                                {...register("lastName")}
                                id="lastName"
                                placeholder=" "
                                disabled={isPending}
                                className={inputClass(false)}
                            />
                            <label htmlFor="lastName" className={labelClass(false)}>
                                Last Name
                            </label>
                        </div>

                        {/* ===== 03 Professional Details ===== */}
                        <SectionHeader accent={SECTION_ACCENTS[2]} title="Professional Details" isDark={isDark} />

                        {/* Registration No */}
                        <div>
                            <div className="relative">
                                <input
                                    {...register("registrationNo")}
                                    id="registrationNo"
                                    placeholder=" "
                                    disabled={isPending}
                                    className={inputClass(!!errors.registrationNo)}
                                />
                                <label htmlFor="registrationNo" className={labelClass(!!errors.registrationNo)}>
                                    Registration No.{" "}
                                    <span className={isDark ? "text-amber-300" : "text-amber-500"}>*</span>
                                </label>
                            </div>
                            {errors.registrationNo && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.registrationNo.message}
                                </p>
                            )}
                        </div>

                        {/* Specialization */}
                        <div className="relative">
                            <input
                                {...register("specialization")}
                                id="specialization"
                                placeholder=" "
                                disabled={isPending}
                                className={inputClass(false)}
                            />
                            <label htmlFor="specialization" className={labelClass(false)}>
                                Specialization
                            </label>
                        </div>

                        {/* Qualification */}
                        <div className="relative">
                            <input
                                {...register("qualification")}
                                id="qualification"
                                placeholder=" "
                                disabled={isPending}
                                className={inputClass(false)}
                            />
                            <label htmlFor="qualification" className={labelClass(false)}>
                                Qualification
                            </label>
                        </div>

                        {/* Additional Qualification */}
                        <div className="relative">
                            <input
                                {...register("additionalQualification")}
                                id="additionalQualification"
                                placeholder=" "
                                disabled={isPending}
                                className={inputClass(false)}
                            />
                            <label htmlFor="additionalQualification" className={labelClass(false)}>
                                Additional Qualification
                            </label>
                        </div>

                        {/* Experience */}
                        <div className="relative md:col-span-2">
                            <input
                                {...register("experience")}
                                id="experience"
                                placeholder=" "
                                disabled={isPending}
                                className={inputClass(false)}
                            />
                            <label htmlFor="experience" className={labelClass(false)}>
                                Experience
                            </label>
                        </div>
                    </div>

                    {/* ===== Footer ===== */}
                    <div
                        className={`mt-2 flex flex-col-reverse items-stretch justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center ${
                            isDark ? "border-emerald-500/10" : "border-amber-200/60"
                        }`}
                    >
                        <p className={`text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                            Fields marked{" "}
                            <span className={isDark ? "text-amber-300" : "text-amber-500"}>*</span>{" "}
                            are required.
                        </p>

                        <button
                            type="submit"
                            disabled={isPending}
                            className={`group inline-flex h-11 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold
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
                            Register Doctor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}