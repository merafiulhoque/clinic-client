"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { userSigninSchema, UserSigninData } from "@/shared/types/schemas";
import { signingAction } from "@/actions/auth/signin";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";

export default function SigningPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserSigninData>({
        resolver: zodResolver(userSigninSchema),
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
                bgColor: "bg-green-600"
            });
            // Redirect to the clinic selection or authenticated area[cite: 3]
            router.push(APP_URLS.CLINIC_SELECTION);
        },
        onError: (error: Error) => {
            showToast({
                text: error.message || "Invalid credentials.",
                bgColor: "bg-red-600"
            });
        },
    });

    const onSubmit = (data: UserSigninData) => {
        signinMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border shadow-sm">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign In</h1>
                    <p className="text-muted-foreground text-sm">
                        Enter your email and password to access your account
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
                                disabled={signinMutation.isPending}
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
                                disabled={signinMutation.isPending}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={signinMutation.isPending}
                        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        {signinMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Sign In
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Don&apos;t have an account? </span>
                    <Link href={APP_URLS.SIGN_UP} className="font-medium text-primary hover:underline">
                        Create account
                    </Link>
                </div>

            </div>
        </div>
    );
}