import { SECTION_ACCENTS } from "@/shared/config/modules/owner_modules/doctor_modules";

export default function SectionHeader({
    accent,
    title,
    isDark,
}: {
    accent: (typeof SECTION_ACCENTS)[number];
    title: string;
    isDark: boolean;
}) {
    return (
        <div className="md:col-span-2 mb-1 mt-4 first:mt-0">
            <div className="flex items-center gap-3">
                <span
                    className={`flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[10px] font-semibold tracking-wider ring-1 ${
                        isDark
                            ? `${accent.bgDark} ${accent.ringDark} ${accent.iconDark}`
                            : `${accent.bgLight} ${accent.ringLight} ${accent.iconLight}`
                    }`}
                >
                    {accent.step}
                </span>
                <h3
                    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                >
                    {title}
                </h3>
                <span
                    className={`h-px flex-1 bg-gradient-to-r to-transparent ${
                        isDark ? accent.lineDark : accent.lineLight
                    }`}
                />
            </div>
        </div>
    );
}