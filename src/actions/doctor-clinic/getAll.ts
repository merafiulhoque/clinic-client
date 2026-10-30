"use server";

import { api } from "@/shared/api";
import { createScheduleData, createScheduleSchema } from "@/shared/types/schemas";
import { cookies } from "next/headers";

export type DoctorOfClinic = {
  doctorClinicId: number;
  doctorName: string;
};

export type ClinicWithDoctors = {
  clinicId: number;
  doctorsOfThisClinic: DoctorOfClinic[];
};

export async function getAllAssignedDoctorsAction(): Promise<ClinicWithDoctors[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) throw new Error("Session expired");

  // Adjust this endpoint URL to match your newly created backend route
  return api<ClinicWithDoctors[]>("/api/v1/doctor-clinic/all", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createScheduleAction(data: createScheduleData) {
  const parsed = createScheduleSchema.safeParse(data);
  if (!parsed.success) return { success: false, message: "Invalid schedule data" };

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return { success: false, message: "Session expired" };

  try {
    const response = await api<string>("/api/v1/schedule/create", {
      method: "POST",
      body: parsed.data,
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: response };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create schedule" };
  }
}