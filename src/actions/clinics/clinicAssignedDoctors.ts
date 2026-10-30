"use server";

import { cookies } from "next/headers";
import { api } from "@/shared/api";
import { createScheduleSchema, createScheduleData } from "@/shared/types/schemas";

export type ClinicAssignedDoctor = {
  doctorClinicId: number;
  doctorName: string;
};

export async function getAssignedDoctorsByClinicAction(clinicId: number): Promise<ClinicAssignedDoctor[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) throw new Error("Session expired");

  return api<ClinicAssignedDoctor[]>(`/api/v1/doctor-clinic/${clinicId}/doctors`, {
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