"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
    ArrowLeft,
    Search,
    Stethoscope,
    MapPin,
    Building2,
    AlertCircle,
    ArrowRight,
} from "lucide-react";

import { searchDoctorsAction } from "@/actions/public/searchDoctors";
import {
    PublicDoctorSearchData,
    SearchFormData,
    searchFormSchema,
} from "@/shared/types/schemas";
import { APP_URLS } from "@/shared/config/constants/urls";
import { useThemeStore } from "@/shared/stores/theme-store";
import FullScreenLoader from "@/components/ui/Loader";

export default function PublicDoctorSearchPage() {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [searchParams, setSearchParams] = useState<PublicDoctorSearchData>({
        page: 1,
        limit: 20,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormData>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
            clinicName: "",
            doctorName: "",
            location: "",
            specialization: "",
        },
    });

    const {
        data: doctors,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["public-doctors", searchParams],
        queryFn: () => searchDoctorsAction(searchParams),
    });

    const onSubmit = (data: SearchFormData) => {
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== "" && v !== undefined)
        ) as SearchFormData;

        setSearchParams({ ...cleanedData, page: 1, limit: 20 });
    };

    // Shared input/label helpers (floating)
    const inputClass = (hasError?: boolean) =>
        `peer flex h-12 w-full rounded-lg border-2 bg-transparent px-3 pt-5 pb-1 text-sm transition-all duration-200
        focus:outline-none
        ${
            isDark
                ? `border-zinc-700 text-white placeholder:text-transparent
                   hover:border-zinc-500
                   focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
                   ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
                : `border-zinc-300 text-black placeholder:text-transparent
                   hover:border-amber-400
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                   ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : ""}`
        }`;

    const labelClass = (hasError?: boolean) =>
        `absolute left-3 top-1.5 text-[11px] font-medium transition-all duration-200 pointer-events-none
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
        peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium
        ${
            isDark
                ? `text-zinc-500 peer-focus:text-emerald-400 peer-placeholder-shown:text-zinc-400
                   ${hasError ? "peer-focus:text-red-400" : ""}`
                : `text-zinc-500 peer-focus:text-indigo-600 peer-placeholder-shown:text-zinc-500
                   ${hasError ? "peer-focus:text-red-500" : ""}`
        }`;

    return (
        <div
            className={`relative min-h-screen transition-colors duration-500 ${
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

            {/* ===== Content ===== */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-10 space-y-6">

                {/* Back + Header */}
                <div className="space-y-4 animate-fade-slide-up">
                    <Link
                        href={APP_URLS.HOME}
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
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${
                                isDark
                                    ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-400"
                                    : "bg-indigo-50 ring-indigo-200 text-indigo-600"
                            }`}
                        >
                            <Stethoscope className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                                Find a{" "}
                                <span
                                    className={`bg-clip-text text-transparent ${
                                        isDark
                                            ? "bg-gradient-to-r from-emerald-400 to-amber-300"
                                            : "bg-gradient-to-r from-indigo-500 to-amber-500"
                                    }`}
                                >
                                    Doctor
                                </span>
                            </h1>
                            <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                Search by name, specialization, clinic, or location.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== Search Form ===== */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={`rounded-2xl border shadow-xl p-5 sm:p-6 animate-fade-slide-up ${
                        isDark
                            ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5"
                            : "bg-white border-amber-200 shadow-indigo-500/5"
                    }`}
                    style={{ animationDelay: "0.05s" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Doctor Name */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register("doctorName")}
                                    id="doctorName"
                                    placeholder=" "
                                    className={inputClass(!!errors.doctorName)}
                                />
                                <label htmlFor="doctorName" className={labelClass(!!errors.doctorName)}>
                                    Doctor Name
                                </label>
                            </div>
                            {errors.doctorName ? (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    {errors.doctorName.message}
                                </p>
                            ) : (
                                <p className={`mt-1.5 text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                    e.g. Smith
                                </p>
                            )}
                        </div>

                        {/* Specialization */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register("specialization")}
                                    id="specialization"
                                    placeholder=" "
                                    className={inputClass(!!errors.specialization)}
                                />
                                <label htmlFor="specialization" className={labelClass(!!errors.specialization)}>
                                    Specialization
                                </label>
                            </div>
                            {errors.specialization ? (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    {errors.specialization.message}
                                </p>
                            ) : (
                                <p className={`mt-1.5 text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                    e.g. Cardiologist
                                </p>
                            )}
                        </div>

                        {/* Clinic Name */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register("clinicName")}
                                    id="clinicName"
                                    placeholder=" "
                                    className={inputClass(!!errors.clinicName)}
                                />
                                <label htmlFor="clinicName" className={labelClass(!!errors.clinicName)}>
                                    Clinic Name
                                </label>
                            </div>
                            {errors.clinicName ? (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    {errors.clinicName.message}
                                </p>
                            ) : (
                                <p className={`mt-1.5 text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                    e.g. City Care
                                </p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    {...register("location")}
                                    id="location"
                                    placeholder=" "
                                    className={inputClass(!!errors.location)}
                                />
                                <label htmlFor="location" className={labelClass(!!errors.location)}>
                                    Location
                                </label>
                            </div>
                            {errors.location ? (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    {errors.location.message}
                                </p>
                            ) : (
                                <p className={`mt-1.5 text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                                    e.g. New York
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-5 mt-5 border-t ${isDark ? 'border-emerald-500/10' : 'border-amber-200/60'}">
                        <button
                            type="submit"
                            className={`inline-flex items-center justify-center gap-2 h-11 px-7 rounded-lg text-sm font-semibold
                            transition-all duration-200 ease-out
                            hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${
                                isDark
                                    ? "bg-amber-400 text-black hover:bg-amber-300 focus-visible:ring-amber-400 focus-visible:ring-offset-black"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                            }`}
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </button>
                    </div>
                </form>

                {/* ===== Results ===== */}
                <div className="flex flex-col gap-5">
                    {isLoading ? (
                        <FullScreenLoader message="Searching for doctors..." />
                    ) : isError ? (
                        <div
                            className={`p-6 rounded-2xl border text-center animate-fade-slide-up ${
                                isDark
                                    ? "bg-red-500/10 border-red-500/30 text-red-300"
                                    : "bg-red-50 border-red-200 text-red-700"
                            }`}
                        >
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                            <h3 className="font-semibold">Failed to search</h3>
                            <p className="text-sm mt-1 opacity-90">
                                {error instanceof Error ? error.message : "Failed to fetch"}
                            </p>
                        </div>
                    ) : !doctors || doctors.length === 0 ? (
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
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                            <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                No doctors found matching your criteria.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {doctors.map((doctor, index) => (
                                <div
                                    key={doctor.doctorId}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    className={`rounded-2xl border shadow-sm p-5 sm:p-6 flex flex-col gap-5 animate-fade-slide-up
                                    transition-all duration-200 hover:shadow-lg
                                    ${
                                        isDark
                                            ? "bg-zinc-900/60 border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-400/50"
                                            : "bg-white border-amber-200 shadow-indigo-500/5 hover:border-indigo-400/50"
                                    }`}
                                >
                                    {/* Doctor header */}
                                    <div
                                        className={`flex flex-col gap-2 border-b pb-4 ${
                                            isDark ? "border-emerald-500/10" : "border-amber-200/60"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                    isDark
                                                        ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                                                        : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-200"
                                                }`}
                                            >
                                                <Stethoscope className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h2 className="text-lg sm:text-xl font-bold leading-tight truncate">
                                                    Dr. {doctor.doctorName}
                                                </h2>
                                                <span
                                                    className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ring-1 ${
                                                        isDark
                                                            ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                                                            : "bg-indigo-50 text-indigo-600 ring-indigo-200"
                                                    }`}
                                                >
                                                    {doctor.doctorSpecialization || "General"}
                                                </span>
                                            </div>
                                        </div>
                                        <p
                                            className={`text-xs ${
                                                isDark ? "text-zinc-400" : "text-zinc-600"
                                            }`}
                                        >
                                            {doctor.doctorQualification}
                                            {doctor.doctorAdditionalQualification
                                                ? ` | ${doctor.doctorAdditionalQualification}`
                                                : ""}
                                        </p>
                                    </div>

                                    {/* Clinics */}
                                    <div className="flex flex-col gap-3">
                                        <h3
                                            className={`text-[11px] font-semibold uppercase tracking-wider ${
                                                isDark ? "text-zinc-400" : "text-zinc-600"
                                            }`}
                                        >
                                            Available at Clinics
                                        </h3>
                                        {doctor.doctorClinics.length === 0 ? (
                                            <span
                                                className={`text-sm ${
                                                    isDark ? "text-zinc-500" : "text-zinc-500"
                                                }`}
                                            >
                                                No clinics assigned yet.
                                            </span>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {doctor.doctorClinics.map((clinic) => (
                                                    <div
                                                        key={clinic.doctorClinicId}
                                                        className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${
                                                            isDark
                                                                ? "bg-zinc-800/40 border-zinc-700/60 hover:border-emerald-500/40 hover:bg-emerald-500/5"
                                                                : "bg-amber-50/60 border-amber-200/60 hover:border-indigo-300 hover:bg-indigo-50/40"
                                                        }`}
                                                    >
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <Building2
                                                                    className={`w-3.5 h-3.5 shrink-0 ${
                                                                        isDark
                                                                            ? "text-emerald-400"
                                                                            : "text-indigo-500"
                                                                    }`}
                                                                />
                                                                <span className="font-semibold text-sm truncate">
                                                                    {clinic.clinicName}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className={`flex items-center text-xs gap-1.5 ${
                                                                    isDark
                                                                        ? "text-zinc-400"
                                                                        : "text-zinc-500"
                                                                }`}
                                                            >
                                                                <MapPin className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">
                                                                    {clinic.clinicLocation}
                                                                </span>
                                                            </div>
                                                            <span
                                                                className={`text-sm font-bold mt-1 ${
                                                                    isDark
                                                                        ? "text-amber-300"
                                                                        : "text-indigo-600"
                                                                }`}
                                                            >
                                                                ₹{clinic.fees}
                                                            </span>
                                                        </div>

                                                        <Link
                                                            href={APP_URLS.VIEW_SCHEDULE(
                                                                clinic.doctorClinicId
                                                            )}
                                                            className={`group inline-flex items-center justify-center gap-1.5 w-full h-9 px-3 rounded-lg text-xs font-semibold border
                                                            transition-all duration-200 active:scale-[0.98]
                                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                                                            ${
                                                                isDark
                                                                    ? "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 focus-visible:ring-emerald-400 focus-visible:ring-offset-black"
                                                                    : "border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#fdfcfb]"
                                                            }`}
                                                        >
                                                            View Schedule & Book
                                                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}