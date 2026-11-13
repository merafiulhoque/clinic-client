"use server";

import { api } from "@/shared/api";
import { PublicSchedule } from "@/shared/types";
import { decodeId } from "@/shared/utils/hashids";

export async function getDoctorScheduleAction(publicId: string): Promise<PublicSchedule[]> {
  // 1. Decode "J8xKp2" back to 15
  const doctorClinicId = decodeId(publicId);

  
  if (!doctorClinicId) {
    throw new Error("Invalid clinic link");
  }

  // 2. Send 15 to Express
  return api<PublicSchedule[]>(`/api/v1/public-corner/${doctorClinicId}/schedule`, {
    method: "GET",
  });
}