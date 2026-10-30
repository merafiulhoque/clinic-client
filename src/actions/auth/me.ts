"use server";

import { cookies } from "next/headers";
import { api } from "@/shared/api";

export type AuthUser = {
  id: string | number;
  email: string;
};

export async function getMeAction(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const user = await api<AuthUser>("/api/v1/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}