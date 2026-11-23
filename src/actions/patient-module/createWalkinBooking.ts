"use server";

import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";
import { WalkinBookingResult } from "@/shared/types";
import { BookingFormData } from "@/shared/types/schemas";
import { cookies } from "next/headers";


export async function createWalkinBookingAction(
    data: BookingFormData
): Promise<WalkinBookingResult> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value; // match your exact cookie name

    if (!token) {
        throw new Error("Session expired, sign in again");
    }

    return api<WalkinBookingResult>(API_ENDPOINTS.OWNER_WALKING_PATIENT_REGISTRATION, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: data,
    });
}