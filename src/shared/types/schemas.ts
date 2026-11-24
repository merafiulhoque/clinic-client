import { z } from "zod";
import { Weekday } from "../constants";
import { capitalizeWords, emailSchema, formatMedicalQualifications, nameSchema, optionalNameSchema, passwordSchema, titleCase, titleCaseSchema } from "./zodHelpers";
import { Role } from ".";

// auth related schemas
export const userSignupSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export type UserSignupData = z.infer<typeof userSignupSchema>;

export const userSigninSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export type UserSigninData = z.infer<typeof userSigninSchema>;



// clinic creation -- Clinic Module

export const clinicCreateSchema = z.object({
    name: titleCaseSchema,
    ownerName: titleCaseSchema,
    location: z
        .string()
        .trim()
        .min(2, "Clinic location is required")
        .max(200, "Location cannot exceed 200 characters")
        .transform(titleCase),
});

export type ClinicCreateData = z.infer<typeof clinicCreateSchema>;




// Doctor Module

export const createDoctorSchema = z.object({
    email: emailSchema,
    password: passwordSchema,

    firstName: nameSchema,
    middleName: optionalNameSchema,
    lastName: optionalNameSchema,

    qualification: z
        .string()
        .trim()
        .max(200, "Qualification cannot exceed 200 characters")
        .transform(formatMedicalQualifications)
        .optional(),

    additionalQualification: z
        .string()
        .trim()
        .max(200, "Additional qualification cannot exceed 200 characters")
        .transform(formatMedicalQualifications)
        .optional(),

    experience: z
        .string()
        .trim()
        .regex(/^\d+$/, "Experience must be a number")
        .transform((value) => `${value} yrs`),

    registrationNo: z
        .string()
        .trim()
        .min(1, "Registration number is required")
        .max(30, "Registration number cannot exceed 30 characters")
        .regex(
            /^[a-zA-Z0-9 ]+$/,
            "Registration number can only contain letters, numbers, and spaces"
        )
        .transform((value) =>
            value
                .replace(/\s+/g, " ")
                .replace(/[a-z]/g, (char) => char.toUpperCase())
        ),

    specialization: z
        .string()
        .trim()
        .max(100, "Specialization cannot exceed 100 characters")
        .transform(capitalizeWords)
        .optional(),
});

export type CreateDoctorData = z.infer<typeof createDoctorSchema>;



export const assignDoctorToClinicSchema = z.object({
    doctorId: z
        .number()
        .int("Doctor ID must be an integer")
        .positive("Invalid doctor ID"),

    clinicId: z
        .number()
        .int("Clinic ID must be an integer")
        .positive("Invalid clinic ID"),

    fees: z
        .number()
        .finite("Fees must be a valid number")
        .min(0, "Fees cannot be negative"),
});

export type AssignDoctorToClinicData = z.infer<
    typeof assignDoctorToClinicSchema
>;



export const createScheduleSchema = z
    .object({
        doctorClinicId: z.coerce
            .number()
            .int("Invalid doctor-clinic ID")
            .positive("Doctor-clinic ID is required"),

        dayOfWeek: z.enum(Weekday),

        startTime: z.coerce
            .number()
            .int("Start time must be in minutes")
            .min(480, "Clinic cannot start before 8:00 AM")
            .max(1319, "Start time cannot be after 9:59 PM"),

        endTime: z.coerce
            .number()
            .int("End time must be in minutes")
            .min(481, "End time must be after 8:00 AM")
            .max(1320, "Clinic cannot end after 10:00 PM"),
    })
    .refine(
        ({ startTime, endTime }) => startTime < endTime,
        {
            message: "End time must be after start time",
            path: ["endTime"],
        }
    );

export type CreateScheduleData = z.infer<typeof createScheduleSchema>;



export const memberCreateSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: titleCaseSchema,

    role: z.enum(Role),

    clinicId: z
        .number()
        .int("Clinic ID must be an integer")
        .positive("Invalid clinic ID"),
});

export type MemberCreateData = z.infer<typeof memberCreateSchema>;


// public module

export const publicDoctorSearchSchema = z.object({
    clinicName: z.string().trim().toLowerCase().max(100).optional(),
    doctorName: z.string().trim().toLowerCase().max(100).optional(),
    location: z.string().trim().toLowerCase().max(200).optional(),
    specialization: z.string().trim().toLowerCase().max(100).optional(),

    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20),
});

export type PublicDoctorSearchData = z.infer<typeof publicDoctorSearchSchema>;



// The form schema without page and limit
export const searchFormSchema = publicDoctorSearchSchema.omit({ page: true, limit: true });
export type SearchFormData = z.infer<typeof searchFormSchema>;





// You can use this for React Hook Form validation on the client
export const bookingFormSchema = z.object({
    scheduleId: z
        .number()
        .int("Invalid schedule ID")
        .positive("Invalid schedule ID"),

    appointmentDate: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .refine((date) => {
            const parsed = new Date(`${date}T00:00:00`);
            return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
        }, "Invalid appointment date"),

    patientName: titleCaseSchema,

    patientPhone: z
        .string()
        .trim()
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number cannot exceed 20 characters")
        .regex(/^[+0-9\s-]+$/, "Invalid phone format"),

    idempotencyKey: z
        .string()
        .uuid("Invalid idempotency key"),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

