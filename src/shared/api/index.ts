// src/shared/lib/api/index.ts
import { RequestOptions } from "@/shared/types";

export async function api<T>(
    endpoint: string,
    {
        method = "GET",
        body,
        credentials = "omit",
        headers = {},
    }: RequestOptions = {}
): Promise<T> {
    const baseUrl = process.env.API_BASE_URL;

    if (!baseUrl) {
        throw new Error("API_BASE_URL environment variable is not set");
    }

    const url = `${baseUrl}${endpoint}`;

    const res = await fetch(url, {
        method,
        credentials,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...(body !== undefined && method !== "GET"
            ? { body: JSON.stringify(body) }
            : {}),
    });

    const contentType = res.headers.get("content-type");

    // Handle non-2xx backend error responses by throwing an Error
    if (!res.ok) {
        let errorMessage = "Something went wrong";
        if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            // Extract the error message from your backend's { error: "msg" } format
            errorMessage = errorData.error || errorMessage;
        } else {
            errorMessage = await res.text();
        }
        throw new Error(errorMessage);
    }

    // Handle 2xx success responses by returning the raw data
    if (contentType && contentType.includes("application/json")) {
        return (await res.json()) as T;
    } else {
        // Handle plain text success responses
        return (await res.text()) as unknown as T;
    }
}