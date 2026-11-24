"use server";

import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";

export async function requestPasswordResetLinkAction(email: string): Promise<string> {
    return api<string>(API_ENDPOINTS.AUTH.GET_PASSWORD_LINK, {
        method: "POST",
        body: { email },
    });
}