"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { userSignupSchema, UserSignupData } from "@/shared/types/schemas";
import { signupAction } from "@/actions/auth/signup";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import {useMutation} from "@tanstack/react-query";

export default function SignupPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserSignupData>({
        resolver: zodResolver(userSignupSchema),
    });

    // Setup TanStack Query mutation
    const signupMutation = useMutation({
        mutationFn: async (data: UserSignupData) => {
            const result = await signupAction(data);
            if (!result.success) {
                // Throwing sends it to the onError block automatically
                throw new Error(result.message);
            }
            return result;
        },
        onSuccess: (data) => {
            // Green toast for success
            showToast({
                text: data.message || "Account created successfully. Please sign in.",
                bgColor: "bg-green-600"
            });
            router.push(APP_URLS.SIGN_IN);
        },
        onError: (error: Error) => {
            // Red toast for error
            showToast({
                text: error.message || "Failed to create account.",
                bgColor: "bg-red-600"
            });
        },
    });

    const onSubmit = (data: UserSignupData) => {
        signupMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border shadow-sm">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
                    <p className="text-muted-foreground text-sm">
                        Enter your email below to create your clinic owner account
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">
                                Email
                            </label>
                            <input
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                disabled={signupMutation.isPending}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">
                                Password
                            </label>
                            <input
                                {...register("password")}
                                id="password"
                                type="password"
                                disabled={signupMutation.isPending}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={signupMutation.isPending}
                        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        {signupMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Sign Up
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link href={APP_URLS.SIGN_IN} className="font-medium text-primary hover:underline">
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    );
}