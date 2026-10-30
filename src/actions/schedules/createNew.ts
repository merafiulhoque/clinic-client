"use server";

// import { api } from "@/shared/api";
// import { cookies } from "next/headers";
// import { createScheduleSchema, createScheduleData } from "@/shared/types/schemas";

// // Expected response from your new endpoint
// export type AssignedDoctor = {
//   doctorClinicId: number;
//   doctorId: number;
//   doctorName: string;
//   clinicId: number;
//   clinicName: string;
// };

// export async function getAssignedDoctorsAction(): Promise<AssignedDoctor[]> {
//   const token = (await cookies()).get("accessToken")?.value;
//   if (!token) throw new Error("Unauthorized");

//   // Replace with your actual new endpoint URL
//   return api<AssignedDoctor[]>("/api/v1/doctor/assigned", {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
// }

// export async function createScheduleAction(data: createScheduleData) {
//   const parsed = createScheduleSchema.safeParse(data);
//   if (!parsed.success) return { success: false, message: "Invalid schedule data" };

//   const token = (await cookies()).get("accessToken")?.value;
//   if (!token) return { success: false, message: "Unauthorized" };

//   try {
//     const response = await api<string>("/api/v1/schedule/create", {
//       method: "POST",
//       body: parsed.data,
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return { success: true, message: response };
//   } catch (error: any) {
//     return { success: false, message: error.message };
//   }
// }


import { cookies } from "next/headers";
import { api } from "@/shared/api";
import { createScheduleSchema, createScheduleData } from "@/shared/types/schemas";

export async function createNewScheduleAction(data: createScheduleData) {
  console.log(data)
  const parsed = createScheduleSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, message: "Invalid schedule data" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { success: false, message: "Session expired. Please sign in again." };
  }

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