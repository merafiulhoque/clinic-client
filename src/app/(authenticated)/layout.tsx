import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { APP_URLS } from "@/shared/config/constants/urls";
import AuthenticatedShell from "@/components/layout/AuthenticatedShell";

export default async function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    // Match the exact cookie name used in your sign-in action (e.g. "accessToken" or "access_token")
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        redirect(APP_URLS.SIGN_IN);
    }

    return <AuthenticatedShell>{children}</AuthenticatedShell>;
}