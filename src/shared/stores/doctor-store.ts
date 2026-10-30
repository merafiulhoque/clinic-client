import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DoctorListItem } from "../types";

interface DoctorState {
  doctors: DoctorListItem[];
  setDoctors: (doctors: DoctorListItem[]) => void;
  clearDoctors: () => void;
}

export const useDoctorStore = create<DoctorState>()(
  persist(
    (set) => ({
      doctors: [],
      setDoctors: (doctors) => set({ doctors }),
      clearDoctors: () => set({ doctors: [] }),
    }),
    {
      name: "doctor-storage",
    }
  )
);