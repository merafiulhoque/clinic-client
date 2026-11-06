"use client";

import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { MODULES } from "@/shared/config/modules/ownerMainModule";



export default function OwnerDashboardPage() {
    const { activeClinic } = useClinicStore();

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Owner Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Overview and management modules for <span className="font-semibold text-foreground">{activeClinic?.clinicName || "your clinic"}</span>.
                </p>
            </div>

            {/* Quick Stats Overview (Placeholders for future) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total Doctors", value: "0" },
                    { label: "Active Staff", value: "0" },
                    { label: "Today's Appointments", value: "0" },
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        </div>
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Management Modules */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Management Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULES.map((module) => {
                        const Icon = module.icon;

                        return (
                            <Link
                                key={module.title}
                                href={module.href}
                                className="group relative bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col"
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${module.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${module.color}`} />
                                </div>

                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {module.title}
                                </h3>

                                <p className="text-sm text-muted-foreground flex-1">
                                    {module.description}
                                </p>

                                <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                    Open Module <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}