import { 
  UserPlus, 
  Users, 
  UserCheck, 
  CalendarPlus, 
  CalendarClock, 
  RefreshCcw, 
  LogOut 
} from "lucide-react";
import { APP_URLS } from "../constants/urls";

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
];