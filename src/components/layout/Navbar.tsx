"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Activity } from "lucide-react";

import { useClinicStore, UserClinicInfo } from "@/shared/stores/clinic-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { APP_URLS } from "@/shared/config/constants/urls";

export function Navbar() {
    const router = useRouter();
    const { activeClinic, availableClinics, setActiveClinic } = useClinicStore();
    const { user } = useAuthStore();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClinicSwitch = (clinic: UserClinicInfo) => {
        setActiveClinic(clinic);
        setIsDropdownOpen(false);

        if (clinic.role === "OWNER") {
            router.push(APP_URLS.OWNER_DASHBOARD);
        } else {
            router.push(APP_URLS.STAFF_DASHBOARD);
        }
    };

    return (
        <header className="h-16 border-b flex items-center justify-between px-4 sticky top-0 z-40 bg-background">
            {/* 1 & 2: Top Left (Favicon + Clinic Dropdown) */}
            <div className="flex items-center gap-6">
                <div className="w-8 h-8 border rounded flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 border px-3 py-1.5 rounded-md"
                    >
                        <span className="font-medium text-sm">
                            {activeClinic?.clinicName || "Select Clinic"}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {isDropdownOpen && availableClinics.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-64 border bg-background flex flex-col z-50">
                            {availableClinics.map((item) => (
                                <button
                                    key={item.clinicId}
                                    onClick={() => handleClinicSwitch(item)}
                                    className="w-full text-left px-4 py-2 text-sm border-b last:border-b-0 flex items-center justify-between"
                                >
                                    <span className="truncate">{item.clinicName}</span>
                                    <span className="text-[10px] uppercase border px-1.5 py-0.5">
                                        {item.role}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 3: Search Bar */}
            <div className="flex-1 max-w-md mx-6">
                <div className="relative flex items-center border p-2">
                    <Search className="w-4 h-4 mr-2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full text-sm outline-none bg-transparent"
                    />
                </div>
            </div>

            {/* 4: Right Profile Block (Fixed Logic) */}
            <div className="flex items-center gap-2 border p-1 rounded-full">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center font-bold uppercase text-sm">
                    {!mounted ? "..." : (user?.email ? user.email.charAt(0) : "U")}
                </div>
                <span className="text-sm font-medium pr-3">
                    {!mounted ? "Loading..." : (user?.email || "Guest")}
                </span>
            </div>
        </header>
    );
}