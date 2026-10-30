"use server"

// Add to src/actions/doctor-actions.ts
import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";
import { assignDoctorToClinicSchema, AssignDoctorToClinicData } from "@/shared/types/schemas";
import { cookies } from "next/headers";

export async function assignDoctorAction(data: AssignDoctorToClinicData) {
  const parsed = assignDoctorToClinicSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Invalid assignment data provided" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { success: false, message: "Session expired. Please sign in again." };
  }

  try {
    const response = await api<string>(API_ENDPOINTS.DOCTOR_CLINIC.ASSIGN, {
      method: "POST",
      body: parsed.data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return { success: true, message: response };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to assign doctor" };
  }
}