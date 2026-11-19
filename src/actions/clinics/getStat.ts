"use server";

import { cookies } from "next/headers";
import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";
import { ClinicStats } from "@/shared/types";


export async function getClinicStatsAction(clinicId: number): Promise<ClinicStats> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) throw new Error("Unauthorized");

  return api<ClinicStats>(API_ENDPOINTS.CLINIC.GET_STAT(clinicId), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}