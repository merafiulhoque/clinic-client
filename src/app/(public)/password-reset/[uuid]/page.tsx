"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    ShieldCheck,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Loader2,
    Home,
    ArrowLeft,
} from "lucide-react";

import { resetPasswordAction } from "@/actions/auth/resetPassword";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { passwordSchema } from "@/shared/types/zodHelpers";
import { useThemeStore } from "@/shared/stores/theme-store";

const resetPasswordFormSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export default function PasswordResetPage({
    params,
}: {
    params: Promise<{ uuid: string }>;
}) {
    const { uuid } = use(params);
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    // Live match indicator
    const watchedPassword = watch("password");
    const watchedConfirm = watch("confirmPassword");
    const bothFilled = !!(watchedPassword && watchedConfirm);
    const passwordsMatch = bothFilled && watchedPassword === watchedConfirm;

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            const message = await resetPasswordAction(uuid, data.password);
            setSuccessMessage(message || "Password updated successfully.");
        } catch (err: any) {
            showToast({
                text: err.message || "Failed to reset password",
                bgColor: "bg-red-600",
            });
        }
    };

    // Shared input helper
    const inputClass = (hasError?: boolean) =>
        `peer flex h-12 w-full rounded-lg border-2 bg-transparent pl-10 pr-11 pt-5 pb-1 text-sm transition-all duration-200
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
        `absolute left-3 top-1 pl-6 text-[11px] font-medium transition-all duration-200 pointer-events-none
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
        peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
        ${
            isDark
                ? `text-zinc-500 peer-focus:text-emerald-400 peer-placeholder-shown:text-zinc-400
                   ${hasError ? "peer-focus:text-red-400" : ""}`
                : `text-zinc-500 peer-focus:text-indigo-600 peer-placeholder-shown:text-zinc-500
                   ${hasError ? "peer-focus:text-red-500" : ""}`
        }`;

    return (
        <div
            className={`relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-500 ${
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

            {/* ===== Card ===== */}
            <div
                className={`relative z-10 w-full max-w-md p-8 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-sm animate-fade-slide-up ${
                    isDark
                        ? "bg-zinc-900/80 border-emerald-500/20 shadow-emerald-500/5"
                        : "bg-white border-amber-200 shadow-indigo-500/5"
                }`}
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
                            <ShieldCheck
                                className={`h-7 w-7 ${
                                    isDark ? "text-emerald-400" : "text-indigo-500"
                                }`}
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Set New{" "}
                        <span
                            className={`bg-clip-text text-transparent ${
                                isDark
                                    ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                    : "bg-gradient-to-r from-indigo-500 to-amber-500"
                            }`}
                        >
                            Password
                        </span>
                    </h1>
                    <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        Enter and confirm your new password below.
                    </p>
                </div>

                {/* Success State */}
                {successMessage ? (
                    <div className="space-y-5 animate-fade-slide-up">
                        <div
                            className={`flex items-start gap-3 p-4 rounded-xl ring-1 ${
                                isDark
                                    ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-100"
                                    : "bg-emerald-50 ring-emerald-200 text-emerald-900"
                            }`}
                        >
                            <CheckCircle2
                                className={`w-5 h-5 shrink-0 mt-0.5 ${
                                    isDark ? "text-emerald-400" : "text-emerald-600"
                                }`}
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                                <p className="text-sm font-semibold">Password Reset Complete</p>
                                <p className="text-xs break-words leading-relaxed opacity-90">
                                    {successMessage}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={APP_URLS.SIGN_IN}
                            className={`w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-semibold
                            transition-all duration-200 ease-out
                            hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                isDark
                                    ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-900"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                            }`}
                        >
                            Go to Sign In
                        </Link>
                    </div>
                ) : (
                    /* Form State */
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-slide-up">
                        {/* New Password */}
                        <div>
                            <div className="relative">
                                <ShieldCheck
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                                        isDark ? "text-zinc-500" : "text-zinc-400"
                                    }`}
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder=" "
                                    disabled={isSubmitting}
                                    className={inputClass(!!errors.password)}
                                />
                                <label htmlFor="password" className={labelClass(!!errors.password)}>
                                    New Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    disabled={isSubmitting}
                                    tabIndex={-1}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors disabled:opacity-50 ${
                                        isDark
                                            ? "text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                                            : "text-zinc-500 hover:text-indigo-600 hover:bg-indigo-500/10"
                                    }`}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <div className="relative">
                                <ShieldCheck
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                                        isDark ? "text-zinc-500" : "text-zinc-400"
                                    }`}
                                />
                                <input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    placeholder=" "
                                    disabled={isSubmitting}
                                    className={inputClass(!!errors.confirmPassword)}
                                />
                                <label
                                    htmlFor="confirmPassword"
                                    className={labelClass(!!errors.confirmPassword)}
                                >
                                    Confirm Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    disabled={isSubmitting}
                                    tabIndex={-1}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors disabled:opacity-50 ${
                                        isDark
                                            ? "text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                                            : "text-zinc-500 hover:text-indigo-600 hover:bg-indigo-500/10"
                                    }`}
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                >
                                    {showConfirm ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {/* Live Match Indicator */}
                            {bothFilled && !errors.confirmPassword && (
                                <p
                                    className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${
                                        passwordsMatch
                                            ? isDark
                                                ? "text-emerald-400"
                                                : "text-emerald-600"
                                            : "text-red-500"
                                    }`}
                                >
                                    {passwordsMatch ? (
                                        <>
                                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                            Passwords match
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-3.5 w-3.5 shrink-0" />
                                            Passwords do not match
                                        </>
                                    )}
                                </p>
                            )}

                            {errors.confirmPassword && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-fade-slide-up">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group inline-flex w-full items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-semibold
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
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}
                            {isSubmitting ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {/* Back to Sign In */}
                <div
                    className={`mt-6 pt-6 border-t flex justify-center ${
                        isDark ? "border-emerald-500/10" : "border-amber-200/60"
                    }`}
                >
                    <Link
                        href={APP_URLS.SIGN_IN}
                        className={`group inline-flex items-center gap-2 text-xs font-medium transition-colors underline-offset-4 hover:underline ${
                            isDark
                                ? "text-zinc-400 hover:text-emerald-300"
                                : "text-zinc-600 hover:text-indigo-600"
                        }`}
                    >
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        Back to Sign In
                    </Link>
                </div>
            </div>

            {/* ===== Back to Home ===== */}
            <div
                className="relative z-10 mt-6 animate-fade-slide-up"
                style={{ animationDelay: "0.2s" }}
            >
                <Link
                    href={APP_URLS.HOME}
                    className={`group inline-flex items-center gap-2 text-sm transition-colors underline-offset-4 hover:underline ${
                        isDark
                            ? "text-zinc-400 hover:text-emerald-300"
                            : "text-zinc-600 hover:text-indigo-600"
                    }`}
                >
                    <Home className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}