"use server"

import { cookies } from "next/headers";
import { api } from "@/shared/api";
import { memberCreateSchema, memberCreateData } from "@/shared/types/schemas";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";

export async function createClinicMemberAction(data: memberCreateData) {
  const parsed = memberCreateSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, message: "Invalid clinic member data" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { success: false, message: "Session expired. Please sign in again." };
  }

  try {
    // Replace with your actual backend endpoint for creating a clinic member
    const response = await api<string>(API_ENDPOINTS.CLINIC_MEMBER.CREATE, {
      method: "POST",
      body: parsed.data,
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return { success: true, message: response }; // Will return "member created" on success
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create clinic member" };
  }
}