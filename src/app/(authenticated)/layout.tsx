"use client";

import { AuthInitializer } from "@/components/utility/auth-initializer";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useThemeStore } from "@/shared/stores/theme-store";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    return (
        <AuthInitializer>
            <div
                className={`flex h-screen overflow-hidden transition-colors duration-300 ${
                    isDark ? "bg-black text-white" : "bg-[#fdfcfb] text-black"
                }`}
            >
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar />
                    <main
                        className={`flex-1 overflow-y-auto px-3 sm:px-4 pt-3 pb-20 md:pb-3
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none`}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </AuthInitializer>
    );
}