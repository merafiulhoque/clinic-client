"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    ArrowLeft,
    Home,
    KeyRound,
    Mail,
    AlertCircle,
    CheckCircle2,
    Copy,
    Loader2,
} from "lucide-react";

import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { emailSchema } from "@/shared/types/zodHelpers";
import { requestPasswordResetLinkAction } from "@/actions/auth/requestPasswordLink";
import { useThemeStore } from "@/shared/stores/theme-store";

const resetLinkFormSchema = z.object({
    email: emailSchema,
});

type ResetLinkFormValues = z.infer<typeof resetLinkFormSchema>;

export default function PasswordResetLinkPage() {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [responseMessage, setResponseMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetLinkFormValues>({
        resolver: zodResolver(resetLinkFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ResetLinkFormValues) => {
        try {
            const message = await requestPasswordResetLinkAction(data.email);
            setResponseMessage(message);
        } catch (err: any) {
            showToast({
                text: err.message || "Failed to send password reset link",
                bgColor: "bg-red-600",
            });
        }
    };

    const handleCopy = async () => {
        if (!responseMessage) return;
        try {
            await navigator.clipboard.writeText(responseMessage);
            showToast({
                text: "Copied to clipboard",
                bgColor: "bg-emerald-600",
            });
        } catch {
            showToast({
                text: "Failed to copy",
                bgColor: "bg-red-600",
            });
        }
    };

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
                {/* Header Icon */}
                <div className="text-center space-y-3 mb-8">
                    <div className="flex justify-center">
                        <div
                            className={`p-3 rounded-full ${
                                isDark
                                    ? "bg-emerald-500/10 ring-2 ring-emerald-500/30"
                                    : "bg-indigo-500/10 ring-2 ring-indigo-500/30"
                            }`}
                        >
                            <KeyRound
                                className={`h-7 w-7 ${
                                    isDark ? "text-emerald-400" : "text-indigo-500"
                                }`}
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Reset{" "}
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
                        Enter your account email to receive a password reset link.
                    </p>
                </div>

                {/* Success State */}
                {responseMessage ? (
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
                            <div className="min-w-0 flex-1 space-y-2">
                                <p className="text-sm font-semibold">Reset link ready</p>
                                <p className="text-xs break-all leading-relaxed opacity-90">
                                    {responseMessage}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-semibold border
                            transition-all duration-200 ease-out
                            hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                isDark
                                    ? "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 focus-visible:ring-emerald-400 focus-visible:ring-offset-zinc-900"
                                    : "border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 focus-visible:ring-indigo-500 focus-visible:ring-offset-white"
                            }`}
                        >
                            <Copy className="h-4 w-4" />
                            Copy to Clipboard
                        </button>

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
                            Return to Sign In
                        </Link>
                    </div>
                ) : (
                    /* Form State */
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-slide-up">
                        {/* Email — Floating label */}
                        <div>
                            <div className="relative">
                                <Mail
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                                        isDark ? "text-zinc-500" : "text-zinc-400"
                                    }`}
                                />
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder=" "
                                    disabled={isSubmitting}
                                    className={`peer flex h-12 w-full rounded-lg border-2 bg-transparent pl-10 pr-3 pt-5 pb-1 text-sm transition-all duration-200
                                    focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
                                    ${
                                        isDark
                                            ? `border-zinc-700 text-white placeholder:text-transparent
                                               hover:border-zinc-500
                                               focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                                               ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                            : `border-zinc-300 text-black placeholder:text-transparent
                                               hover:border-amber-400
                                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                                               ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                    }`}
                                />
                                <label
                                    htmlFor="email"
                                    className={`absolute left-3 top-1 pl-6 text-[11px] font-medium transition-all duration-200 pointer-events-none
                                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                                    peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
                                    ${
                                        isDark
                                            ? `text-zinc-500 peer-focus:text-emerald-400 peer-placeholder-shown:text-zinc-400
                                               ${errors.email ? "peer-focus:text-red-400" : ""}`
                                            : `text-zinc-500 peer-focus:text-indigo-600 peer-placeholder-shown:text-zinc-500
                                               ${errors.email ? "peer-focus:text-red-500" : ""}`
                                    }`}
                                >
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
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                {/* Back to Sign In (top) — moved inside card bottom */}
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