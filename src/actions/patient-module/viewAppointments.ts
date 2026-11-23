"use server";

import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";
import { AppointmentItem, ViewAppointmentParams } from "@/shared/types";
import { cookies } from "next/headers";


export async function viewAppointmentsAction(
    clinicId: number,
    params: ViewAppointmentParams
): Promise<AppointmentItem[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value; // match your exact cookie name

    if (!token) {
        throw new Error("Unauthorized");
    }

    const searchParams = new URLSearchParams({
        type: params.type,
        page: String(params.page),
        limit: String(params.limit),
    });

    if (params.type === "range") {
        searchParams.set("from", params.from);
        searchParams.set("to", params.to);
    }

    return api<AppointmentItem[]>(
        API_ENDPOINTS.OWNER_VIEW_APPOINTMENTS(clinicId, searchParams.toString()),
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}