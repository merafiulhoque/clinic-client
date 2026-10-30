"use server";

import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";
import { CreateDoctorData, createDoctorSchema } from "@/shared/types/schemas";
import { cookies } from "next/headers";


export async function createDoctorAction(data: CreateDoctorData) {
  const parsed = createDoctorSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Invalid form data provided" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { success: false, message: "Session expired. Please sign in again." };
  }

  try {
    const response = await api<string>(API_ENDPOINTS.DOCTOR.CREATE, {
      method: "POST",
      body: parsed.data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Returns "Doctor Created: ${newDoctorId}"
    return { success: true, message: response };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to add doctor" };
  }
}