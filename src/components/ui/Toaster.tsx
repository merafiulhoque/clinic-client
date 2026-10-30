"use client";

import { useToastStore } from "@/shared/stores/toast-store";
import { useEffect, useState } from "react";

export function Toaster() {
    const { toasts } = useToastStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`px-4 py-3 rounded shadow-lg pointer-events-auto transition-all animate-in slide-in-from-bottom-5 ${toast.bgColor} ${toast.textColor}`}
                >
                    {toast.text}
                </div>
            ))}
        </div>
    );
}