"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, AlertCircle, LogIn, ArrowLeft } from "lucide-react";

import { userSigninSchema, UserSigninData } from "@/shared/types/schemas";
import { signingAction } from "@/actions/auth/signin";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";

export default function SigningPage() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserSigninData>({
        resolver: zodResolver(userSigninSchema),
        defaultValues: {
            email: "me.rafiulhoque@gmail.com",
            password: "abcdef",
        },
    });

    const signinMutation = useMutation({
        mutationFn: async (data: UserSigninData) => {
            const result = await signingAction(data);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result;
        },
        onSuccess: (data) => {
            showToast({
                text: data.message || "Signed in successfully.",
                bgColor: "bg-green-600",
            });
            window.location.href = APP_URLS.CLINIC_SELECTION;
        },
        onError: (error: Error) => {
            showToast({
                text: error.message || "Invalid credentials.",
                bgColor: "bg-red-600",
            });
        },
    });

    const onSubmit = (data: UserSigninData) => {
        signinMutation.mutate(data);
    };

    const isPending = signinMutation.isPending;

    return (
        <div
            className={`relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-500 ${
                isDark ? "bg-black text-white" : "bg-white text-black"
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
                className={`relative z-10 w-full max-w-md p-8 sm:p-10 rounded-2xl shadow-xl backdrop-blur-sm animate-fade-slide-up transition-colors duration-300 ${
                    isDark
                        ? "bg-zinc-900/80 border border-emerald-500/20 shadow-emerald-500/5"
                        : "bg-white border border-amber-200 shadow-indigo-500/5"
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
                            <LogIn
                                className={`h-7 w-7 ${
                                    isDark ? "text-emerald-400" : "text-indigo-500"
                                }`}
                            />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
                    <p
                        className={`text-sm ${
                            isDark ? "text-zinc-400" : "text-zinc-600"
                        }`}
                    >
                        Enter your email and password to access your account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email */}
                    <div className="relative">
                        <input
                            {...register("email")}
                            id="email"
                            type="email"
                            placeholder=" "
                            disabled={isPending}
                            className={`peer flex h-12 w-full rounded-lg border-2 bg-transparent px-3 pt-5 pb-1 text-sm transition-all duration-200
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
                            className={`absolute left-3 top-1.5 text-[11px] font-medium transition-all duration-200 pointer-events-none
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                            peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
                            ${
                                isDark
                                    ? `text-zinc-500 peer-focus:text-emerald-400 peer-placeholder-shown:text-zinc-400
                                       ${errors.email ? "peer-focus:text-red-400" : ""}`
                                    : `text-zinc-500 peer-focus:text-indigo-600 peer-placeholder-shown:text-zinc-500
                                       ${errors.email ? "peer-focus:text-red-500" : ""}`
                            }`}
                        >
                            Email
                        </label>
                    </div>
                    {errors.email && (
                        <p className="flex items-center gap-1.5 text-sm font-medium text-red-500 animate-fade-slide-up">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {errors.email.message}
                        </p>
                    )}

                    {/* Password */}
                    <div className="relative">
                        <input
                            {...register("password")}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder=" "
                            disabled={isPending}
                            className={`peer flex h-12 w-full rounded-lg border-2 bg-transparent px-3 pr-11 pt-5 pb-1 text-sm transition-all duration-200
                            focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
                            ${
                                isDark
                                    ? `border-zinc-700 text-white placeholder:text-transparent
                                       hover:border-zinc-500
                                       focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                                       ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                                    : `border-zinc-300 text-black placeholder:text-transparent
                                       hover:border-amber-400
                                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                                       ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                            }`}
                        />
                        <label
                            htmlFor="password"
                            className={`absolute left-3 top-1.5 text-[11px] font-medium transition-all duration-200 pointer-events-none
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                            peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
                            ${
                                isDark
                                    ? `text-zinc-500 peer-focus:text-emerald-400 peer-placeholder-shown:text-zinc-400
                                       ${errors.password ? "peer-focus:text-red-400" : ""}`
                                    : `text-zinc-500 peer-focus:text-indigo-600 peer-placeholder-shown:text-zinc-500
                                       ${errors.password ? "peer-focus:text-red-500" : ""}`
                            }`}
                        >
                            Password
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            disabled={isPending}
                            tabIndex={-1}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors disabled:opacity-50
                            ${
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
                        <p className="flex items-center gap-1.5 text-sm font-medium text-red-500 animate-fade-slide-up">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {errors.password.message}
                        </p>
                    )}

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
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : null}
                        Sign In
                    </button>
                </form>

                {/* Footer — Sign up link */}
                <div className="text-center text-sm mt-6">
                    <span className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                        Don&apos;t have an account?{" "}
                    </span>
                    <Link
                        href={APP_URLS.SIGN_UP}
                        className={`font-semibold transition-colors underline-offset-4 hover:underline ${
                            isDark
                                ? "text-emerald-400 hover:text-emerald-300"
                                : "text-indigo-600 hover:text-indigo-500"
                        }`}
                    >
                        Create account
                    </Link>
                </div>
            </div>

            {/* ===== Back to Home ===== */}
            <div
                className="relative z-10 mt-6 animate-fade-slide-up"
                style={{ animationDelay: "0.2s" }}
            >
                <Link
                    href="/"
                    className={`group inline-flex items-center gap-2 text-sm transition-colors underline-offset-4 hover:underline ${
                        isDark
                            ? "text-zinc-400 hover:text-emerald-300"
                            : "text-zinc-600 hover:text-indigo-600"
                    }`}
                >
                    <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to home
                </Link>
            </div>
        </div>
    );
}