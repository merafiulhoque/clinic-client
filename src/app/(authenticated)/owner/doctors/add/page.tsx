"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, UserPlus } from "lucide-react";

import { createDoctorSchema, CreateDoctorData } from "@/shared/types/schemas";
import { createDoctorAction } from "@/actions/doctors/createNewDoctor";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";

const INPUT =
  "flex h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-[#e8eaf0] placeholder:text-[#5a6274] transition-all duration-200 focus-visible:outline-none focus-visible:border-white/20 focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#7dd3c0]/25 disabled:cursor-not-allowed disabled:opacity-50";

const LABEL = "text-[13px] font-medium text-[#b8bfd0]";
const ERROR = "text-xs text-[#f49ac1]";

const SECTIONS = {
  account: { hex: "#7dd3c0", rgb: "125, 211, 192", step: "01" },
  personal: { hex: "#c4a7f5", rgb: "196, 167, 245", step: "02" },
  professional: { hex: "#f6c177", rgb: "246, 193, 119", step: "03" },
};

function SectionHeader({ accent, title }: {accent: any, title: any}) {
  return (
    <div className="md:col-span-2 mb-1 mt-4 first:mt-0">
      <div className="flex items-center gap-3">
        <span
          className="flex h-6 min-w-6 items-center justify-center rounded-md border px-1.5 text-[10px] font-semibold tracking-wider"
          style={{
            color: accent.hex,
            borderColor: `rgba(${accent.rgb}, 0.28)`,
            background: `rgba(${accent.rgb}, 0.08)`,
          }}
        >
          {accent.step}
        </span>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a92a6]">
          {title}
        </h3>
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, rgba(${accent.rgb},0.35), transparent)`,
          }}
        />
      </div>
    </div>
  );
}

export default function AddDoctorPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDoctorData>({
    resolver: zodResolver(createDoctorSchema),
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateDoctorData) => {
      const result = await createDoctorAction(data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      showToast({ text: data.message, bgColor: "bg-green-600" });
      reset();
      router.push(`${APP_URLS.OWNER_DASHBOARD}/doctors`);
    },
    onError: (error: Error) => {
      showToast({ text: error.message || "Failed to add doctor", bgColor: "bg-red-600" });
    },
  });

  const onSubmit = (data: CreateDoctorData) => {
    createMutation.mutate(data);
  };

  return (
    <div
      className="relative isolate mx-auto max-w-3xl space-y-8 text-[#e8eaf0]"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Fonts */}
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');`,
        }}
      />

      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div
          className="absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(125,211,192,0.16), transparent 70%)" }}
        />
        <div
          className="absolute -right-32 top-1/2 h-[460px] w-[460px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(196,167,245,0.14), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(246,193,119,0.10), transparent 70%)" }}
        />
      </div>

      {/* Back link */}
      <Link
        href={`${APP_URLS.OWNER_DASHBOARD}/doctors`}
        className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-[#8a92a6] backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-[#e8eaf0]"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back to Doctor Module
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
          style={{
            borderColor: "rgba(125,211,192,0.28)",
            background:
              "radial-gradient(circle at 30% 30%, rgba(125,211,192,0.28), rgba(196,167,245,0.12))",
            color: "#7dd3c0",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <UserPlus className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Add New{" "}
            <span
              className="italic"
              style={{
                fontFamily: "'Instrument Serif', ui-serif, Georgia, serif",
                backgroundImage:
                  "linear-gradient(90deg, #7dd3c0 0%, #c4a7f5 60%, #f6c177 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Doctor
            </span>
          </h1>
          <p className="text-sm text-[#8a92a6]">
            Register a new medical professional in the system.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-6 md:p-8"
        style={{
          backgroundColor: "#0f141c",
          backgroundImage:
            "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.012) 45%, rgba(255,255,255,0.025) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 0 rgba(0,0,0,0.4), 0 32px 60px -32px rgba(0,0,0,0.9)",
        }}
      >
        {/* Top accent line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(125,211,192,0.7), rgba(196,167,245,0.5), transparent)",
          }}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">

            {/* Account Info */}
            <SectionHeader accent={SECTIONS.account} title="Account Details" />

            <div className="space-y-2">
              <label className={LABEL} htmlFor="email">
                Email <span className="text-[#f6c177]">*</span>
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                disabled={createMutation.isPending}
                className={INPUT}
              />
              {errors.email && <p className={ERROR}>{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className={LABEL} htmlFor="password">
                Password <span className="text-[#f6c177]">*</span>
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                disabled={createMutation.isPending}
                className={INPUT}
              />
              {errors.password && <p className={ERROR}>{errors.password.message}</p>}
            </div>

            {/* Personal Info */}
            <SectionHeader accent={SECTIONS.personal} title="Personal Details" />

            <div className="space-y-2">
              <label className={LABEL} htmlFor="firstName">
                First Name <span className="text-[#f6c177]">*</span>
              </label>
              <input
                {...register("firstName")}
                id="firstName"
                disabled={createMutation.isPending}
                className={INPUT}
              />
              {errors.firstName && <p className={ERROR}>{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className={LABEL} htmlFor="middleName">Middle Name</label>
              <input
                {...register("middleName")}
                id="middleName"
                disabled={createMutation.isPending}
                className={INPUT}
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL} htmlFor="lastName">Last Name</label>
              <input
                {...register("lastName")}
                id="lastName"
                disabled={createMutation.isPending}
                className={INPUT}
              />
            </div>

            {/* Professional Info */}
            <SectionHeader accent={SECTIONS.professional} title="Professional Details" />

            <div className="space-y-2">
              <label className={LABEL} htmlFor="registrationNo">
                Registration No. <span className="text-[#f6c177]">*</span>
              </label>
              <input
                {...register("registrationNo")}
                id="registrationNo"
                disabled={createMutation.isPending}
                className={INPUT}
              />
              {errors.registrationNo && <p className={ERROR}>{errors.registrationNo.message}</p>}
            </div>

            <div className="space-y-2">
              <label className={LABEL} htmlFor="specialization">Specialization</label>
              <input
                {...register("specialization")}
                id="specialization"
                placeholder="e.g., Cardiology"
                disabled={createMutation.isPending}
                className={INPUT}
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL} htmlFor="qualification">Qualification</label>
              <input
                {...register("qualification")}
                id="qualification"
                placeholder="e.g., MBBS"
                disabled={createMutation.isPending}
                className={INPUT}
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL} htmlFor="additionalQualification">Additional Qualification</label>
              <input
                {...register("additionalQualification")}
                id="additionalQualification"
                placeholder="e.g., MD, FRCS"
                disabled={createMutation.isPending}
                className={INPUT}
              />
            </div>

            <div className="space-y-2">
              <label className={LABEL} htmlFor="experience">Experience</label>
              <input
                {...register("experience")}
                id="experience"
                placeholder="e.g., 5 years"
                disabled={createMutation.isPending}
                className={INPUT}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-2 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
            <p className="text-[11px] text-[#6b7385]">
              Fields marked <span className="text-[#f6c177]">*</span> are required.
            </p>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-[#0a0d12] transition-all duration-200 hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #7dd3c0 0%, #c4a7f5 55%, #f6c177 100%)",
                boxShadow:
                  "0 10px 30px -10px rgba(125,211,192,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Register Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}