import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "OWNER" | "STAFF" | "DOCTOR";

export type UserClinicInfo = {
    role: Role;
    clinicId: number;
    clinicName: string;
    clinicLocation: string;
};

interface ClinicState {
    availableClinics: UserClinicInfo[];
    activeClinic: UserClinicInfo | null;
    setAvailableClinics: (clinics: UserClinicInfo[]) => void;
    setActiveClinic: (clinic: UserClinicInfo) => void;
    clearClinics: () => void;
}

export const useClinicStore = create<ClinicState>()(
    persist(
        (set) => ({
            availableClinics: [],
            activeClinic: null,
            setAvailableClinics: (clinics) => set({ availableClinics: clinics }),
            setActiveClinic: (clinic) => set({ activeClinic: clinic }),
            clearClinics: () => set({ availableClinics: [], activeClinic: null }),
        }),
        {
            name: "clinic-storage",
        }
    )
);