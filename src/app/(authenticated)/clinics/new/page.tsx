"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Building2 } from "lucide-react";

import { clinicCreateSchema, ClinicCreateData } from "@/shared/types/schemas";
import { createClinicAction } from "@/actions/clinics/createClinic";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";

export default function CreateClinicPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

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

            // Invalidate the clinic info query so it fetches the new list
            queryClient.invalidateQueries({ queryKey: ["clinic", "info"] });

            // Redirect back to the selection screen
            router.push(APP_URLS.CLINIC_SELECTION);
        },
        onError: (error: Error) => {
            showToast({ text: error.message || "Failed to create clinic", bgColor: "bg-red-600" });
        },
    });

    const onSubmit = (data: ClinicCreateData) => {
        createMutation.mutate(data);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="mb-6">
                <Link
                    href={APP_URLS.CLINIC_SELECTION}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Clinic Selection
                </Link>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border shadow-sm space-y-8">

                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Register Clinic</h1>
                    <p className="text-muted-foreground text-sm">
                        Enter your clinic details to set up your workspace
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="name">
                                Clinic Name
                            </label>
                            <input
                                {...register("name")}
                                id="name"
                                type="text"
                                placeholder="e.g., Arogya Health Center"
                                disabled={createMutation.isPending}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="location">
                                Location
                            </label>
                            <input
                                {...register("location")}
                                id="location"
                                type="text"
                                placeholder="e.g., Kolkata, West Bengal"
                                disabled={createMutation.isPending}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500 font-medium">{errors.location.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        {createMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Create Clinic
                    </button>
                </form>

            </div>
        </div>
    );
}