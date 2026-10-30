"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LogOut } from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useDoctorStore } from "@/shared/stores/doctor-store"; // IMPORT DOCTOR STORE
import { SIDEBAR_CONFIG } from "@/shared/config/constants/navigations";
import { signoutAction } from "@/actions/auth/signout";
import { APP_URLS } from "@/shared/config/constants/urls";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { activeClinic, clearClinics } = useClinicStore();
    const { clearUser } = useAuthStore();
    const { clearDoctors } = useDoctorStore(); // DESTRUCTURE CLEAR METHOD

    if (!activeClinic) return null;

    const navItems = SIDEBAR_CONFIG[activeClinic.role as keyof typeof SIDEBAR_CONFIG] || [];

    const handleSignOut = async () => {
        await signoutAction(); // Clear server cookies
        clearClinics();        // Clear clinic Zustand store
        clearUser();           // Clear auth Zustand store
        clearDoctors();        // Clear doctor Zustand store (ADDED)
        router.push(APP_URLS.SIGN_IN);
    };

    return (
        <aside className="w-64 border-r h-screen flex flex-col sticky top-0 bg-background">

            {/* Sidebar Header */}
            <div className="h-16 flex items-center px-4 border-b">
                <div className="flex items-center gap-3 w-full overflow-hidden">
                    <div className="border p-2 rounded-md shrink-0">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="font-semibold text-sm truncate">
                            {activeClinic.clinicName}
                        </span>
                        <span className="text-xs capitalize">
                            {activeClinic.role.toLowerCase()} Panel
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium border ${
                                isActive ? "border-foreground" : "border-transparent"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Switch Clinic & Sign Out */}
            <div className="p-4 border-t flex flex-col gap-2">
                <Link
                    href={APP_URLS.CLINIC_SELECTION}
                    className="flex items-center justify-center w-full py-2 text-sm border rounded-md"
                >
                    Switch Clinic
                </Link>
                <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-3 py-2 w-full border rounded-md text-sm font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>

        </aside>
    );
}