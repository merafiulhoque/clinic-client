import { z } from "zod";

export const userSignupSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserSignupData = z.infer<typeof userSignupSchema>;

export const userSigninSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserSigninData = z.infer<typeof userSigninSchema>;


export const clinicCreateSchema = z.object({
    name: z.string().min(2, "Clinic name is required"),
    location: z.string().min(2, "Clinic location is required"),
    ownerName: z.string()
});

export type ClinicCreateData = z.infer<typeof clinicCreateSchema>;


export const createDoctorSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  qualification: z.string().optional(),
  additionalQualification: z.string().optional(),
  experience: z.string().optional(),
  registrationNo: z.string().min(1, "Registration number is required"),
  specialization: z.string().optional(),
});

export type CreateDoctorData = z.infer<typeof createDoctorSchema>;


export const assignDoctorToClinicSchema = z.object({
  // Make sure these have () at the end!
  doctorId: z.number(), 
  clinicId: z.number(), 
  fees: z.number().min(0, "Fees must be a positive number"),
});

export type AssignDoctorToClinicData = z.infer<typeof assignDoctorToClinicSchema>;

export const Weekday =[
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
]

export const createScheduleSchema = z.object({
    doctorClinicId: z.number().int().positive(),
    dayOfWeek: z.enum(Weekday),
    startTime: z.number().int().min(480, "Does not sit before 8.00AM").max(1319, "Start time after end time"),
    endTime: z.number().int().min(481, "End time is less that start").max(22*60, "Does not sit after 10.00PM")
}).refine(
    ({ startTime, endTime }) => startTime < endTime,
    {
        message: "End time must be after start time",
        path: ["endTime"],
    }
)

export type createScheduleData = z.infer<typeof createScheduleSchema>

export enum Role  {
    OWNER="OWNER",
    STAFF="STAFF",
    RECEPTIONIST="RECEPTIONIST",
    DOCTOR="DOCTOR",
    MANAGER="MANAGER"
}

export const memberCreateSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
    role: z.enum(Role),
    clinicId: z.number()
})

export type memberCreateData = z.infer<typeof memberCreateSchema>


export const publicDoctorSearchSchema = z.object({
  clinicName: z.string().trim().min(1).optional(),
  doctorName: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  specialization: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PublicDoctorSearchData = z.infer<typeof publicDoctorSearchSchema>;

// The form schema without page and limit
export const searchFormSchema = publicDoctorSearchSchema.omit({ page: true, limit: true });
export type SearchFormData = z.infer<typeof searchFormSchema>;

export type PublicDoctorClinic = {
  doctorClinicId: number;
  clinicId: number;
  clinicName: string;
  clinicLocation: string;
  fees: number;
};

export type PublicDoctor = {
  doctorId: number;
  doctorName: string;
  doctorQualification: string | null;
  doctorAdditionalQualification: string | null;
  doctorSpecialization: string | null;
  doctorClinics: PublicDoctorClinic[];
};


export type PublicSlot = {
  scheduleId: number;
  availableTime: number; // minutes from midnight
};

// You can use this for React Hook Form validation on the client
export const bookingFormSchema = z.object({
  scheduleId: z.number().int().positive(),
  appointmentDate: z.string().min(1), // YYYY-MM-DD
  patientName: z.string().trim().min(1, "Name is required"),
  patientEmail: z.string().email("Invalid email"),
  patientPhone: z.string().trim().min(10).max(20).regex(/^[+0-9\s-]+$/, "Invalid phone format"),
  idempotencyKey: z.string().uuid(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export type AppointmentResponse = {
  id: number;
  startTime: number;
  endTime: number;
  appointmentDate: Date;
  doctorScheduleId: number;
  status: string;
};


export type DoctorLookupResult = {
  doctorId: number;
  doctorName: string;
  doctorQualification: string;
};