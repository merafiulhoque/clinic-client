"use server"

import {UserSignupData, userSignupSchema} from "@/shared/types/schemas";
import {api} from "@/shared/api";
import {API_ENDPOINTS} from "@/shared/config/constants/api_endpoints";

export async function signupAction(data: UserSignupData) {
    // Re-validate on the server
    const parsed = userSignupSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, message: "Invalid form data provided" };
    }

    try {
        // The backend returns plain text "user created" on success[cite: 1]
        const response = await api<string>(API_ENDPOINTS.AUTH.SIGN_UP, {
            method: "POST",
            body: parsed.data,
        });

        return { success: true, message: response };
    } catch (error) {
        // The api utility parses the { error: "msg" } JSON and throws it as error.message[cite: 2]
        return { success: false, message: error instanceof Error ? error.message : "Failed to create account" };
    }
}