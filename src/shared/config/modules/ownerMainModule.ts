import { Stethoscope, Users, UserSquare2 } from "lucide-react";
import { APP_URLS } from "../constants/urls";

export const MODULES = [
    {
        title: "Doctor Module",
        description: "Manage doctor profiles, assignments, and schedules.",
        href: `${APP_URLS.OWNER_DASHBOARD}/doctors`,
        icon: Stethoscope,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        title: "Clinic Member Module",
        description: "Manage receptionists, roles, and system access.",
        href: `${APP_URLS.OWNER_DASHBOARD}/clinic-members`,
        icon: UserSquare2,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
    {
        title: "Patient Module",
        description: "View patient records, history, and clinic analytics.",
        href: `${APP_URLS.OWNER_DASHBOARD}/patients`,
        icon: Users,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
];

// Theme-aware accent per module (keeps visual distinction, works in both themes)
export const MODULE_ACCENTS: Record<
    string,
    { iconDark: string; iconLight: string; bgDark: string; bgLight: string }
> = {
    "Doctor Module": {
        iconDark: "text-emerald-400",
        iconLight: "text-indigo-600",
        bgDark: "bg-emerald-500/10",
        bgLight: "bg-indigo-50",
    },
    "Clinic Member Module": {
        iconDark: "text-amber-300",
        iconLight: "text-amber-600",
        bgDark: "bg-amber-500/10",
        bgLight: "bg-amber-50",
    },
    "Patient Module": {
        iconDark: "text-sky-400",
        iconLight: "text-sky-600",
        bgDark: "bg-sky-500/10",
        bgLight: "bg-sky-50",
    },
};

export const FALLBACK_ACCENT = {
    iconDark: "text-emerald-400",
    iconLight: "text-indigo-600",
    bgDark: "bg-emerald-500/10",
    bgLight: "bg-indigo-50",
};