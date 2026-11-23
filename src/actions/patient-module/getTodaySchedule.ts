"use server";

import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";
import { TodayScheduleItem } from "@/shared/types";
import { cookies } from "next/headers";

export async function getTodaySchedulesAction(
    clinicId: number
): Promise<TodayScheduleItem[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value; // match your exact cookie name

    if (!token) {
        throw new Error("Session expired, sign in again");
    }

    return api<TodayScheduleItem[]>(API_ENDPOINTS.OWNER_GET_TODAYS_SCHEDULES(clinicId), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}