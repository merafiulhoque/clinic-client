"use server";

import { api } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config/constants/api_endpoints";

export async function resetPasswordAction(
    uuid: string,
    password: string
): Promise<string> {
    return api<string>(API_ENDPOINTS.AUTH.PASSWORD_RESET, {
        method: "PATCH",
        body: { password, uuid },
    });
}