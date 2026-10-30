"use server"

// Replace UserClinics with UserClinicInfo in the import and return type
import {UserClinicInfo} from "@/shared/stores/clinic-store";
import {cookies} from "next/headers";
import {api} from "@/shared/api";
import {API_ENDPOINTS} from "@/shared/config/constants/api_endpoints";

export async function getUserClinicsAction(): Promise<UserClinicInfo[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        throw new Error("Session expired. Please sign in again.");
    }

    try {
        const data = await api<UserClinicInfo[]>(API_ENDPOINTS.CLINIC.GET_INFO, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch clinic info");
    }
}

export default getUserClinicsAction