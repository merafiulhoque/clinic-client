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