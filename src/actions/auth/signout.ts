"use server"

import {cookies} from "next/headers";

export async function signoutAction() {
    const cookieStore = await cookies();

    // Clear the secure cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    // Optional: If your backend needs a request to invalidate the token, call it here
    // await api(API_ENDPOINTS.AUTH.SIGN_OUT, { method: "POST" });

    return { success: true };
}