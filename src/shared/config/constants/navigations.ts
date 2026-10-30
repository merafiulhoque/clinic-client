import {
    LayoutDashboard,
    Users,
    Stethoscope,
    UserSquare2,
    CalendarPlus,
    ClipboardCheck,
    ListOrdered,
    CalendarDays
} from "lucide-react";
import { APP_URLS } from "./urls";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

export type IconType = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

export interface SidebarItem {
    title: string;
    href: string;
    icon: IconType;
}

// Ensure your APP_URLS has these base paths defined:
// OWNER_DASHBOARD: "/owner",
// STAFF_DASHBOARD: "/staff",

export const SIDEBAR_CONFIG: Record<"OWNER" | "STAFF", SidebarItem[]> = {
    OWNER: [
        {
            title: "Dashboard",
            href: APP_URLS.OWNER_DASHBOARD,
            icon: LayoutDashboard,
        },
        {
            title: "Doctor Module",
            href: `${APP_URLS.OWNER_DASHBOARD}/doctors`, // Will render cards: create, assign, exit
            icon: Stethoscope,
        },
        {
            title: "Staff Module",
            href: `${APP_URLS.OWNER_DASHBOARD}/staff`, // Will render cards for staff management
            icon: UserSquare2,
        },
        {
            title: "Patient Module",
            href: `${APP_URLS.OWNER_DASHBOARD}/patients`, // Will render cards for patient records/analytics
            icon: Users,
        },
    ],

    STAFF: [
        {
            title: "Dashboard",
            href: APP_URLS.STAFF_DASHBOARD,
            icon: LayoutDashboard,
        },
        {
            title: "Book Appointment",
            href: `${APP_URLS.STAFF_DASHBOARD}/appointments/book`, // Direct task URL
            icon: CalendarPlus,
        },
        {
            title: "Mark Arrival",
            href: `${APP_URLS.STAFF_DASHBOARD}/queue/arrival`, // Direct task URL
            icon: ClipboardCheck,
        },
        {
            title: "Patient Queue",
            href: `${APP_URLS.STAFF_DASHBOARD}/queue/view`, // Direct task URL
            icon: ListOrdered,
        },
        {
            title: "Doctors Schedule",
            href: `${APP_URLS.STAFF_DASHBOARD}/schedule`, // Direct task URL
            icon: CalendarDays,
        },
    ],
};