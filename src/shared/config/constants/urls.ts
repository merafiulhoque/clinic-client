export const APP_URLS = {
    // Public Routes
    HOME: "/",
    SIGN_UP: "/signup",
    SIGN_IN: "/signin",

    // Public Appointments
    PUBLIC_DIRECTORY: "/appointments",
    BOOK_APPOINTMENT: "/appointments/book", // Will append ?scheduleId=...&date=...

    // Authenticated Routes
    CLINIC_SELECTION: "/clinics",
    CLINIC_ONBOARDING: "/clinics/new",

    // Role-based Dashboards (Base paths to be expanded later)
    OWNER_DASHBOARD: "/owner",
    STAFF_DASHBOARD: "/staff",
} as const;