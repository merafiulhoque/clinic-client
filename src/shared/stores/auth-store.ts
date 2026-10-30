import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: string | number;
    email: string;
}

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: "auth-storage", // stores in localStorage by default
        }
    )
);