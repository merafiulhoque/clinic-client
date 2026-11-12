"use server";

import { cookies } from "next/headers";
import { api } from "@/shared/api";
import { 
  DoctorLookupResult, 
  assignDoctorToClinicSchema, 
  AssignDoctorToClinicData 
} from "@/shared/types/schemas";

export async function lookupDoctorsAction(page = 1, limit = 20): Promise<DoctorLookupResult[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) throw new Error("Unauthorized");

  return api<DoctorLookupResult[]>(`/api/v1/doctor/all-doctors-lookup?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function assignDoctorAction(data: AssignDoctorToClinicData): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) throw new Error("Unauthorized");

  const parsed = assignDoctorToClinicSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid assignment data");

  // The backend returns a plain string on success
  return api<string>(`/api/v1/doctor/assign`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: parsed.data,
  });
}