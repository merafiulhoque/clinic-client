"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { DOCTOR_MODULE_OPTIONS } from "@/shared/config/owner_modules/doctor_modules";
import { APP_URLS } from "@/shared/config/constants/urls";

const ACCENTS = [
  { hex: "#f6c177", rgb: "246, 193, 119" }, // amber
  { hex: "#7dd3c0", rgb: "125, 211, 192" }, // teal
  { hex: "#c4a7f5", rgb: "196, 167, 245" }, // violet
  { hex: "#f49ac1", rgb: "244, 154, 193" }, // pink
  { hex: "#a3c4f3", rgb: "163, 196, 243" }, // sky
  { hex: "#f5a97f", rgb: "245, 169, 127" }, // peach
];

export default function DoctorModulePage() {
  return (
    <div
      className="relative isolate space-y-10 text-[#e8eaf0]"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Fonts — you can move this to layout.tsx / globals.css if you prefer */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
          `,
        }}
      />

      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div
          className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(125,211,192,0.18), transparent 70%)" }}
        />
        <div
          className="absolute -right-40 top-1/3 h-[560px] w-[560px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(196,167,245,0.16), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(246,193,119,0.10), transparent 70%)" }}
        />
      </div>

      {/* Header & Back Navigation */}
      <div className="flex flex-col gap-6">
        <Link
          href={APP_URLS.OWNER_DASHBOARD}
          className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-[#8a92a6] backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-[#e8eaf0]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7dd3c0] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7dd3c0]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a92a6]">
              Owner · Modules
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Doctor{" "}
              <span
                className="italic"
                style={{
                  fontFamily: "'Instrument Serif', ui-serif, Georgia, serif",
                  backgroundImage:
                    "linear-gradient(90deg, #f6c177 0%, #f49ac1 50%, #c4a7f5 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Management
              </span>
            </h1>
            <p className="max-w-xl text-sm text-[#8a92a6] sm:text-base">
              Handle doctor onboarding, scheduling, and assignments.
            </p>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-end justify-between gap-4 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight">Quick actions</h2>
          <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-[#8a92a6]">
            {DOCTOR_MODULE_OPTIONS.length}
          </span>
        </div>
        <span className="hidden text-[11px] text-[#6b7385] sm:block">
          Select a task to continue
        </span>
      </div>

      {/* Actionable Task Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {DOCTOR_MODULE_OPTIONS.map((option, i) => {
          const Icon = option.icon;
          const accent = ACCENTS[i % ACCENTS.length];

          return (
            <Link
              key={option.title}
              href={option.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              style={{
                backgroundColor: "#0f141c",
                backgroundImage:
                  "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.012) 45%, rgba(255,255,255,0.025) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 0 rgba(0,0,0,0.4), 0 24px 48px -28px rgba(0,0,0,0.9)",
              }}
            >
              {/* Top accent line */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)`,
                }}
              />

              {/* Hover accent ring + glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  boxShadow: `0 20px 50px -20px rgba(${accent.rgb},0.35), inset 0 0 0 1px rgba(${accent.rgb},0.28)`,
                }}
              />

              {/* Corner glow */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle, rgba(${accent.rgb},0.35), transparent 70%)`,
                }}
              />

              {/* Ghost index */}
              <span
                className="pointer-events-none absolute right-4 top-1 select-none text-5xl leading-none"
                style={{
                  color: `rgba(${accent.rgb}, 0.09)`,
                  fontFamily: "'Instrument Serif', ui-serif, Georgia, serif",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div
                className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105"
                style={{
                  borderColor: `rgba(${accent.rgb}, 0.25)`,
                  background: `radial-gradient(circle at 30% 30%, rgba(${accent.rgb},0.24), rgba(${accent.rgb},0.07))`,
                  color: accent.hex,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="relative mb-1.5 text-lg font-semibold tracking-tight text-[#e8eaf0]">
                {option.title}
              </h3>

              <p className="relative mb-6 flex-1 text-sm leading-relaxed text-[#8a92a6]">
                {option.description}
              </p>

              <div className="relative mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7385]">
                  Open
                </span>
                <span
                  className="flex items-center text-sm font-medium transition-colors"
                  style={{ color: accent.hex }}
                >
                  Proceed
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}