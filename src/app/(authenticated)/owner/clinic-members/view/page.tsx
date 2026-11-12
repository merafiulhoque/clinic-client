"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
    ArrowLeft,
    Users,
    UserSquare2,
    AlertCircle,
} from "lucide-react";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { useClinicMemberStore } from "@/shared/stores/clinic-member-store";
import { getClinicMembersAction } from "@/actions/clinic-members/getMembers";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";
import FullScreenLoader from "@/components/ui/Loader";

// Role badge colors — theme-aware
const rolePill = (role: string, isDark: boolean) => {
    switch (role) {
        case "MANAGER":
            return isDark
                ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                : "bg-indigo-50 text-indigo-600 ring-indigo-200";
        case "RECEPTIONIST":
            return isDark
                ? "bg-amber-500/10 text-amber-300 ring-amber-500/30"
                : "bg-amber-50 text-amber-700 ring-amber-300";
        case "STAFF":
            return isDark
                ? "bg-sky-500/10 text-sky-300 ring-sky-500/30"
                : "bg-sky-50 text-sky-700 ring-sky-300";
        default:
            return isDark
                ? "bg-zinc-800 text-zinc-300 ring-zinc-700"
                : "bg-zinc-100 text-zinc-700 ring-zinc-300";
    }
};

export default function ViewClinicMembersPage() {
    const { activeClinic } = useClinicStore();
    const { membersByClinic, setMembers } = useClinicMemberStore();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const clinicId = activeClinic?.clinicId;
    const zustandMembers = clinicId ? membersByClinic[clinicId] : undefined;

    const {
        data: fetchedMembers,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["clinic-members", clinicId],
        queryFn: async () => {
            if (!clinicId) return [];
            const result = await getClinicMembersAction(clinicId);
            setMembers(clinicId, result);
            return result;
        },
        enabled: !!clinicId && !zustandMembers,
    });

    if (!activeClinic) {
        return (
            <div
                className={`p-6 rounded-xl border max-w-md mx-auto mt-10 text-center animate-fade-slide-up ${
                    isDark
                        ? "bg-red-500/10 border-red-500/30 text-red-300"
                        : "bg-red-50 border-red-200 text-red-700"
                }`}
            >
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-medium">
                    Please select a clinic first from the dashboard.
                </p>
            </div>
        );
    }

    const displayMembers = zustandMembers || fetchedMembers;

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">

            {/* ===== Header ===== */}
            <div className="space-y-4 animate-fade-slide-up">
                <Link
                    href={`${APP_URLS.OWNER_DASHBOARD}/clinic-members`}
                    className={`group inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                    ${
                        isDark
                            ? "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                            : "border-zinc-300 bg-white text-zinc-600 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                    }`}
                >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    Back to Staff Management
                </Link>

                <div className="flex items-center gap-4">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${
                            isDark
                                ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-400"
                                : "bg-indigo-50 ring-indigo-200 text-indigo-600"
                        }`}
                    >
                        <Users className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            View Clinic{" "}
                            <span
                                className={`bg-clip-text text-transparent ${
                                    isDark
                                        ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                        : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                }`}
                            >
                                Members
                            </span>
                        </h1>
                        <p className={`text-sm truncate ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            Displaying members for:{" "}
                            <span className="font-semibold">
                                {activeClinic.clinicName}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== Content ===== */}
            <div className="flex flex-col gap-4">
                {isLoading && !zustandMembers ? (
                    <FullScreenLoader message="Loading clinic members..." />
                ) : isError ? (
                    <div
                        className={`p-6 rounded-xl border text-center animate-fade-slide-up ${
                            isDark
                                ? "bg-red-500/10 border-red-500/30 text-red-300"
                                : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    >
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                        <h3 className="font-semibold">Failed to load members</h3>
                        <p className="text-sm mt-1 opacity-90">
                            {error instanceof Error ? error.message : "Unknown error"}
                        </p>
                    </div>
                ) : !displayMembers || displayMembers.length === 0 ? (
                    <div
                        className={`max-w-lg mx-auto mt-4 p-8 rounded-2xl border text-center shadow-lg animate-fade-slide-up ${
                            isDark
                                ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                                : "bg-white border-amber-200 shadow-indigo-500/5"
                        }`}
                    >
                        <div
                            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                isDark
                                    ? "bg-emerald-500/10 ring-2 ring-emerald-500/30 text-emerald-400"
                                    : "bg-indigo-500/10 ring-2 ring-indigo-500/30 text-indigo-500"
                            }`}
                        >
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No clinic members found</h3>
                        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            No members have been added to this clinic yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayMembers.map((member, index) => (
                            <div
                                key={member.id}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className={`p-5 rounded-xl border shadow-sm flex flex-col gap-3
                                transition-all duration-200 ease-out
                                hover:-translate-y-1 hover:shadow-lg
                                animate-fade-slide-up
                                ${
                                    isDark
                                        ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-400/50 hover:shadow-emerald-500/10"
                                        : "bg-white border-amber-200 shadow-indigo-500/5 hover:border-indigo-400/50 hover:shadow-indigo-500/10"
                                }`}
                            >
                                {/* Top: icon + name + role */}
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                            isDark
                                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                                : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
                                        }`}
                                    >
                                        <UserSquare2 className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-base leading-tight truncate">
                                            {member.name || "Unnamed Member"}
                                        </h3>
                                        <span
                                            className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ring-1 ${rolePill(
                                                member.role,
                                                isDark
                                            )}`}
                                        >
                                            {member.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Member ID */}
                                <div
                                    className={`mt-auto border-t pt-3 ${
                                        isDark ? "border-emerald-500/10" : "border-amber-200/60"
                                    }`}
                                >
                                    <span
                                        className={`inline-block font-mono text-[10px] px-1.5 py-0.5 rounded ring-1 max-w-full truncate ${
                                            isDark
                                                ? "bg-zinc-800/80 text-zinc-400 ring-zinc-700"
                                                : "bg-amber-50 text-zinc-600 ring-amber-200"
                                        }`}
                                        title={String(member.id)}
                                    >
                                        Member ID: {member.id}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}