import { encodeId } from "@/shared/utils/hashids";

export const APP_URLS = {
    // Public Routes
    HOME: "/",
    SIGN_UP: "/signup",
    SIGN_IN: "/signin",

    //

    // Public Appointments
    PUBLIC_DIRECTORY: "/appointments",
    BOOK_APPOINTMENT: "/appointments/book", // Will append ?scheduleId=...&date=...

    // Authenticated Routes

    // Role-based Dashboards (Base paths to be expanded later)
    
    CLINIC_MEMBER_DASHBOARD: "/clinic-member",

    //patient corner
    PATIENTS_CORNER: "/patients-corner",
    VIEW_SCHEDULE: (doctorClinicId: number)=> `/patients-corner/book/${encodeId(doctorClinicId)}/schedule`,

    //owners modules routes
    CLINIC_SELECTION: "/clinics",
    CLINIC_ONBOARDING: "/clinics/new",
    OWNER_DASHBOARD: "/owner-dashboard",

    OWNER_PATIENT_MODULE: "/owner-dashboard/patient-module",
    OWNER_VIEW_APPOINTMENTS: "owner-dashboard/patient-module/appointments"



} as const;