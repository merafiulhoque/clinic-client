import { create } from "zustand";

export interface ToastOptions {
    text: string;
    textColor?: string;
    bgColor?: string;
    duration?: number;
}

interface Toast extends ToastOptions {
    id: string;
}

interface ToastState {
    toasts: Toast[];
    addToast: (toast: Toast) => void;
    removeToast: (id: string) => void;
}

const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
    removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Exported standalone function so you can call it from anywhere
export function showToast({
                              text,
                              textColor = "text-white",
                              bgColor = "bg-slate-900",
                              duration = 3000,
                          }: ToastOptions) {
    const id = Math.random().toString(36).substring(2, 9);

    useToastStore.getState().addToast({ id, text, textColor, bgColor, duration });

    if (duration > 0) {
        setTimeout(() => {
            useToastStore.getState().removeToast(id);
        }, duration);
    }
}

export { useToastStore };