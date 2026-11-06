"use server";

import { cookies } from "next/headers";
import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";

export type ClinicMemberSummary = {
  id: number;
  name: string;
};

export async function getClinicMembersAction(clinicId: number): Promise<ClinicMemberSummary[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Session expired. Please sign in again.");
  }

  // Uses your exact endpoint structure
  return api<ClinicMemberSummary[]>(API_ENDPOINTS.CLINIC_MEMBER.MEMBERS(clinicId), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}