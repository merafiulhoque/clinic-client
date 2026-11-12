import { 
  UserPlus, 
  Users, 
  UserCheck, 
  CalendarPlus, 
  CalendarClock, 
  RefreshCcw, 
  LogOut, 
  SearchIcon
} from "lucide-react";
import { APP_URLS } from "../../constants/urls";

export const DOCTOR_MODULE_OPTIONS = [
  {
    title: "Add Doctor",
    description: "Register a new doctor profile in the system.",
    href: `${APP_URLS.OWNER_DASHBOARD}/doctors/add`,
    icon: UserPlus,
  },
  {
    title: "View Doctors List",
    description: "Browse and manage all registered doctors.",
    href: `${APP_URLS.OWNER_DASHBOARD}/doctors/list`,
    icon: Users,
  },
  {
    title: "Assign Doctor",
    description: "Assign a doctor to specific clinic departments or roles.",
    href: `${APP_URLS.OWNER_DASHBOARD}/doctors/assign`,
    icon: UserCheck,
  },
  {
    title: "Create Schedule",
    description: "Set up weekly availability and visiting hours.",
    href: `${APP_URLS.OWNER_DASHBOARD}/doctors/schedule/create`,
    icon: CalendarPlus,
  },
  {
    title: "Modify Schedule",
    description: "Update or override an existing doctor's schedule.",
    href: `${APP_URLS.OWNER_DASHBOARD}/doctors/schedule/modify`,
    icon: CalendarClock,
  },
  {
    title: "Change Assignment",
    description: "Reassign a doctor to different clinics or shifts.",
    href: `${APP_URLS.OWNER_DASHBOARD}/doctors/reassign`,
    icon: RefreshCcw,
  },
  {
    title: "Mark Exit",
    description: "Process a doctor's departure and revoke access.",
    href: `${APP_URLS.OWNER_DASHBOARD}/doctors/exit`,
    icon: LogOut,
  },
  {
    title: "Lookup Doctor Database",
    description: "View Doctors Registered in this system",
    href: `${APP_URLS.OWNER_DASHBOARD}/doctors/all-doctors-lookup`,
    icon: SearchIcon  
  }
];


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
    {
        iconDark: "text-violet-400",
        iconLight: "text-violet-600",
        bgDark: "bg-violet-500/10",
        bgLight: "bg-violet-50",
        ringDark: "ring-violet-500/30",
        ringLight: "ring-violet-200",
        lineDark: "from-transparent via-violet-400/60 to-transparent",
        lineLight: "from-transparent via-violet-400/60 to-transparent",
    },
];


// Theme-aware accent per section (rotates Account → Personal → Professional)
export const SECTION_ACCENTS = [
    {
        step: "01",
        iconDark: "text-emerald-400",
        iconLight: "text-indigo-600",
        bgDark: "bg-emerald-500/10",
        bgLight: "bg-indigo-50",
        ringDark: "ring-emerald-500/30",
        ringLight: "ring-indigo-200",
        lineDark: "from-emerald-400/40",
        lineLight: "from-indigo-400/40",
    },
    {
        step: "02",
        iconDark: "text-amber-300",
        iconLight: "text-amber-600",
        bgDark: "bg-amber-500/10",
        bgLight: "bg-amber-50",
        ringDark: "ring-amber-500/30",
        ringLight: "ring-amber-200",
        lineDark: "from-amber-300/40",
        lineLight: "from-amber-400/40",
    },
    {
        step: "03",
        iconDark: "text-sky-400",
        iconLight: "text-sky-600",
        bgDark: "bg-sky-500/10",
        bgLight: "bg-sky-50",
        ringDark: "ring-sky-500/30",
        ringLight: "ring-sky-200",
        lineDark: "from-sky-400/40",
        lineLight: "from-sky-400/40",
    },
];