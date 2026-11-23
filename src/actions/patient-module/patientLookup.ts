"use server";

import { cookies } from "next/headers";
import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";
import { PatientLookupItem, PatientLookupParams } from "@/shared/types";

export async function patientLookupAction(
    clinicId: number,
    params: PatientLookupParams
): Promise<PatientLookupItem[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value; // match your exact cookie name

    if (!token) {
        throw new Error("Session expired, sign in again");
    }

    const searchParams = new URLSearchParams();
    if (params.patientName?.trim()) {
        searchParams.set("patientName", params.patientName.trim());
    }
    if (params.patientPhone?.trim()) {
        searchParams.set("patientPhone", params.patientPhone.trim());
    }

    return api<PatientLookupItem[]>(
        API_ENDPOINTS.OWNER_PATIENT_LOOKUP(clinicId, searchParams.toString()),
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}