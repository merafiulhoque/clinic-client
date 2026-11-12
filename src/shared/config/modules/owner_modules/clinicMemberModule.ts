import { ArrowLeftRight, UserCog, UserPlus, Users } from "lucide-react";

export const CLINIC_MEMBER_MODULE_OPTIONS = [
  {
    title: "Create Clinic Member",
    description: "Add a new staff member to the system.",
    href: "/owner/clinic-members/create",
  },
  {
    title: "View Clinic Members",
    description: "See all staff members across your clinics.",
    href: "/owner/clinic-members/view",
  },
  {
    title: "Assign to Another Clinic",
    description: "Assign an existing clinic member to a different clinic.",
    href: "/owner/clinic-members/assign",
  },
  {
    title: "Modify Clinic Member Details",
    description: "Update roles or details of existing staff.",
    href: "/owner/clinic-members/modify",
  },
];

// Icons assigned by index (config has no icon field)
export const CARD_ICONS = [UserPlus, Users, ArrowLeftRight, UserCog];

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