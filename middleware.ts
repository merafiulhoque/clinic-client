import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const { pathname } = request.nextUrl;

    const isProtectedPath =
        pathname.startsWith("/owner") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/clinics") ||
        pathname.startsWith("/clinic-member");

    const isAuthPath =
        pathname === "/signin" ||
        pathname === "/signup";

    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (isAuthPath && token) {
        return NextResponse.redirect(new URL("/clinics", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/owner/:path*",
        "/dashboard/:path*",
        "/clinics/:path*",
        "/clinic-member/:path*",
        "/signin",
        "/signup",
    ],
};