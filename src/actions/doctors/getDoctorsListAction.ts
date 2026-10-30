"use server"
// src/actions/doctor-actions.ts

import { cookies } from "next/headers";
import { api } from "@/shared/api"
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";
import { DoctorListItem } from "@/shared/types";

export async function getDoctorsListAction(): Promise<DoctorListItem[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Session expired. Please sign in again.");
  }

  try {
    const data = await api<DoctorListItem[]>(API_ENDPOINTS.DOCTOR.GET_LIST, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch doctors list");
  }
}