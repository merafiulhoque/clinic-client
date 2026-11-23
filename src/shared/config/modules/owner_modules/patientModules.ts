import { CalendarDays, Search, UserPlus } from "lucide-react";
import { APP_URLS } from "../../constants/urls";

export const PATIENT_MODULE_FOR_OWNER = [
    {
        title: "View Appointments",
        description: "Manage today's queue and upcoming patient appointments",
        href: `${APP_URLS.OWNER_DASHBOARD}/patient-module/appointments`,
        icon: CalendarDays,
    },
    {
        title: "Walk-In Appointment",
        description: "Register a walk-in patient and book an immediate slot",
        href: `${APP_URLS.OWNER_DASHBOARD}/patient-module/walk-in`,
        icon: UserPlus,
    },
    {
        title: "Patient Directory",
        description: "Search patient records and past visit history",
        href: `${APP_URLS.OWNER_DASHBOARD}/patient-module/lookup`,
        icon: Search,
    },
];

// Rotating, theme-aware accents (visual only)
export const CARD_ACCENTS = [
    {
        iconDark: "text-emerald-400",
        iconLight: "text-indigo-600",
        bgDark: "bg-emerald-500/10",
        bgLight: "bg-indigo-50",
        ringDark: "ring-emerald-500/30",
        ringLight: "ring-indigo-200",
        lineDark: "from-transparent via-emerald-400/60 to-transparent",
        lineLight: "from-transparent via-indigo-400/60 to-transparent",
    },
    {
        iconDark: "text-amber-300",
        iconLight: "text-amber-600",
        bgDark: "bg-amber-500/10",
        bgLight: "bg-amber-50",
        ringDark: "ring-amber-500/30",
        ringLight: "ring-amber-200",
        lineDark: "from-transparent via-amber-300/60 to-transparent",
        lineLight: "from-transparent via-amber-400/60 to-transparent",
    },
    {
        iconDark: "text-sky-400",
        iconLight: "text-sky-600",
        bgDark: "bg-sky-500/10",
        bgLight: "bg-sky-50",
        ringDark: "ring-sky-500/30",
        ringLight: "ring-sky-200",
        lineDark: "from-transparent via-sky-400/60 to-transparent",
        lineLight: "from-transparent via-sky-400/60 to-transparent",
    },
];