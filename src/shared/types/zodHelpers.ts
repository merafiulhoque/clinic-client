import z  from "zod"
import { medicalAbbreviations } from "../constants";

export const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(254, "Email address is too long");

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );



export const titleCase = (value: string) =>
    value
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

export const titleCaseSchema = z
    .string()
    .trim()
    .min(2, "Must be at least 2 characters")
    .max(100, "Cannot exceed 100 characters")
    .transform(titleCase);



export const removeDoctorPrefix = (value: string) =>
    value
        .trim()
        .replace(/\bdr\.?\s*/gi, "")
        .trim();

export const nameSchema = z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .transform(removeDoctorPrefix)
    .transform(titleCase)
    .pipe(z.string().min(1, "Name is required"));

export const optionalNameSchema = z
    .string()
    .trim()
    .max(100, "Name cannot exceed 100 characters")
    .transform((value) => (value ? titleCase(removeDoctorPrefix(value)) : value))
    .optional();

export const capitalizeWords = (value: string) =>
    value
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

export const formatMedicalQualifications = (value: string) => {
    let formatted = capitalizeWords(value);

    for (const abbreviation of medicalAbbreviations) {
        const regex = new RegExp(`\\b${abbreviation}\\b`, "gi");
        formatted = formatted.replace(regex, abbreviation);
    }

    return formatted;
};