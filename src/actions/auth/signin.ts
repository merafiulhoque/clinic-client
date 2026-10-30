"use server"

import {cookies} from "next/headers";
import {API_ENDPOINTS} from "@/shared/config/constants/api_endpoints";
import {api} from "@/shared/api";
import {UserSigninData, userSigninSchema} from "@/shared/types/schemas";

export async function signingAction(data: UserSigninData) {
    const parsed = userSigninSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, message: "Invalid form data provided" };
    }

    try {
        // Backend returns JSON with accessToken and refreshToken[cite: 2]
        const response = await api<{ accessToken: string; refreshToken: string }>(
            API_ENDPOINTS.AUTH.SIGN_IN,
            {
                method: "POST",
                body: parsed.data,
            }
        );

        const cookieStore = await cookies();

        // Set HTTP-only cookies to keep tokens secure on the server[cite: 3]
        cookieStore.set("accessToken", response.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60, // 1 hour lifetime[cite: 1]
        });

        cookieStore.set("refreshToken", response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days lifetime[cite: 1]
        });

        return { success: true, message: "Signed in successfully" };
    } catch (error) {
        // The api utility parses { error: "msg" } and throws it as error.message[cite: 2]
        return { success: false, message: error instanceof Error ? error.message : "Failed to sign in" };
    }
}