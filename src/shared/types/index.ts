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


