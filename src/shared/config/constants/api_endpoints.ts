export const API_ENDPOINTS = {
    AUTH: {
        SIGN_UP: "/api/v1/auth/signup",
        SIGN_IN: "/api/v1/auth/signin",
        SIGN_OUT: "/api/v1/auth/signout",
        ME: "/api/v1/auth/me",
    },
    CLINIC: {
        CREATE: "/api/v1/clinic/create",
        GET_INFO: "/api/v1/clinic/get-info",
    },
    MEMBER: {
        CREATE: "/api/v1/member/create",
    },
    DOCTOR: {
        CREATE: "/api/v1/doctor/create",
        GET_LIST: "/api/v1/doctor/get-list",
    },
    SCHEDULE: {
        CREATE: "/api/v1/schedule/create",
    },
    DOCTOR_CLINIC: {
        ASSIGN: "/api/v1/doctor-clinic/assign",
        CLINICS_AND_DOCTORS: "/api/v1/doctor-clinic/all"
    },
    PUBLIC: {
        VIEW_DOCTORS: "/api/v1/public-corner/view-doctors",
        BOOK_SLOT: "/api/v1/public-corner/book-slot",
        // Dynamic path helpers for doctorClinicId parameters
        getSchedule: (doctorClinicId: number | string) =>
            `/api/v1/public-corner/${doctorClinicId}/schedule`,
        getSlots: (doctorClinicId: number | string) =>
            `/api/v1/public-corner/${doctorClinicId}/slots`,
    },
} as const;