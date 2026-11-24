"use server";

import { cookies } from "next/headers";
import { api } from "@/shared/api";
import { CreateScheduleData, createScheduleSchema } from "@/shared/types/schemas";

export async function createNewScheduleAction(data: CreateScheduleData) {
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