export type METHODS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
    method?: METHODS;
    body?: unknown;
    credentials?: RequestCredentials;
    headers?: HeadersInit;
}



export type DoctorClinic = {
  clinicId: number;
  clinicName: string;
  clinicLocation: string;
};

export type DoctorListItem = {
  doctorId: number;
  fullName: string;
  clinics: DoctorClinic[];
};

export type Weekday = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export type PublicSchedule = {
  scheduleId: number;
  doctorClinicId: number;
  dayOfWeek: Weekday;
  startTime: number; // Integer (minutes from midnight)
  endTime: number;   // Integer (minutes from midnight)
};


export type ClinicStats = {
  totalDoctors: number;
  totalMember: number;
  totalPatient: number;
};


export type AppointmentStatus = "BOOKED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED"; // match your Prisma enum

export interface AppointmentItem {
    appointmentId: number;
    patientName: string;
    appointmentDate: string; // ISO string from JSON
    appointmentTime: number; // minutes from midnight
    appointmentStatus: AppointmentStatus;
    doctorName: string;
}

export type ViewAppointmentParams =
    | { type: "today"; page: number; limit: number }
    | { type: "all"; page: number; limit: number }
    | { type: "range"; from: string; to: string; page: number; limit: number };

export interface TodayScheduleItem {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    qualification: string;
    startTime: number;
    endTime: number;
    lastAppointmentEnd: number | null;
}


export interface WalkinBookingResult {
    patientName: string;
    doctorName: string;
    clinicName: string;
    clinicLocation: string;
    appointmentDate: string;
    appointmentTime: string;
    AppointmentStatus: AppointmentStatus;
}

export interface PatientLookupItem {
    patientName: string;
    patientPhone: string;
}

export interface PatientLookupParams {
    patientName?: string;
    patientPhone?: string;
}