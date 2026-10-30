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