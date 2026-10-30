"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Building2, MapPin, Plus, ArrowRight } from "lucide-react";


import { useClinicStore, UserClinicInfo } from "@/shared/stores/clinic-store";
import FullScreenLoader from "@/components/ui/Loader";
import { APP_URLS } from "@/shared/config/constants/urls";
import { showToast } from "@/shared/stores/toast-store";
import getUserClinicsAction from "@/actions/clinics/getUserClinicAction";

export default function ClinicSelectionPage() {
    const router = useRouter();
    const { setAvailableClinics, setActiveClinic } = useClinicStore();

    const { data: clinics, isLoading, error } = useQuery({
        queryKey: ["clinic", "info"],
        queryFn: getUserClinicsAction,
        retry: false,
    });

    // Sync with Zustand and handle errors
    useEffect(() => {
        if (clinics) {
            setAvailableClinics(clinics);
        }
        if (error) {
            showToast({ text: error.message, bgColor: "bg-red-600" });
            router.push(APP_URLS.SIGN_IN);
        }
    }, [clinics, error, setAvailableClinics, router]);

    const handleClinicSelect = (item: UserClinicInfo) => {
        setActiveClinic(item);

        // Route based on role
        if (item.role === "OWNER") {
            router.push(APP_URLS.OWNER_DASHBOARD);
        } else {
            router.push(APP_URLS.STAFF_DASHBOARD);
        }
    };

    if (isLoading) return <FullScreenLoader />;

    if (!clinics) return null;

    return (
        <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl space-y-8">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
                    <p className="text-muted-foreground">Select a clinic to continue to your dashboard</p>
                </div>

                {clinics.length === 0 ? (
                    // Empty State - No Clinics Found
                    <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm space-y-6 max-w-lg mx-auto">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">You are not onboarded yet</h2>
                            <p className="text-muted-foreground text-sm">
                                As a clinic owner, you need to register your first clinic to access the management tools.
                            </p>
                        </div>
                        <Link
                            href={APP_URLS.CLINIC_ONBOARDING}
                            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors w-full"
                        >
                            <Plus className="w-4 h-4" />
                            Onboard Your Clinic
                        </Link>
                    </div>
                ) : (
                    // Populated State - List of Clinics
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clinics.map((item) => (
                            <button
                                key={item.clinicId}
                                onClick={() => handleClinicSelect(item)}
                                className="group relative flex flex-col items-start bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all text-left"
                            >
                                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {item.role}
                  </span>
                                </div>

                                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                    <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>

                                <h3 className="font-semibold text-lg truncate w-full pr-16">
                                    {item.clinicName}
                                </h3>

                                <div className="flex items-center text-sm text-muted-foreground mt-2">
                                    <MapPin className="w-4 h-4 mr-1.5 opacity-70" />
                                    <span className="truncate">{item.clinicLocation}</span>
                                </div>

                                <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-200">
                                    Enter Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}