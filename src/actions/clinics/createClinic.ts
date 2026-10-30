"use server";

import { cookies } from "next/headers";
import {ClinicCreateData, clinicCreateSchema} from "@/shared/types/schemas";
import {api} from "@/shared/api";
import {API_ENDPOINTS} from "@/shared/config/constants/api_endpoints";


export async function createClinicAction(data: ClinicCreateData) {
    console.log(data)
    const parsed = clinicCreateSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, message: "Invalid form data provided" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return { success: false, message: "Session expired. Please sign in again." };
    }

    try {
        // The backend returns a plain text string on success
        const response = await api<string>(API_ENDPOINTS.CLINIC.CREATE, {
            method: "POST",
            body: parsed.data,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, message: response };
    } catch (error: any) {
        // The api utility parses the { error: "msg" } JSON and throws it
        return { success: false, message: error.message || "Failed to create clinic" };
    }
}