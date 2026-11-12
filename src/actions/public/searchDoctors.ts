"use server";

import { api } from "@/shared/api";
import { PublicDoctor, PublicDoctorSearchData, publicDoctorSearchSchema } from "@/shared/types/schemas";


export async function searchDoctorsAction(params: PublicDoctorSearchData): Promise<PublicDoctor[]> {
  const parsed = publicDoctorSearchSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid search parameters");
  }

  // Construct query string dynamically
  const queryParams = new URLSearchParams();
  Object.entries(parsed.data).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  return api<PublicDoctor[]>(`/api/v1/public-corner/view-doctors?${queryParams.toString()}`, {
    method: "GET",
    // No authorization header needed for public corner
  });
}