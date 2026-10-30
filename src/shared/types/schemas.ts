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