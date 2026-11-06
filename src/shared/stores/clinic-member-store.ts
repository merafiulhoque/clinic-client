import { create } from "zustand";
import { ClinicMemberSummary } from "@/actions/clinic-members/getMembers";

interface ClinicMemberState {
  // Store members mapped by clinicId: { [clinicId]: ClinicMemberSummary[] }
  membersByClinic: Record<number, ClinicMemberSummary[]>;
  setMembers: (clinicId: number, members: ClinicMemberSummary[]) => void;
  clearMembers: (clinicId: number) => void;
}

export const useClinicMemberStore = create<ClinicMemberState>((set) => ({
  membersByClinic: {},
  setMembers: (clinicId, members) =>
    set((state) => ({
      membersByClinic: {
        ...state.membersByClinic,
        [clinicId]: members,
      },
    })),
  clearMembers: (clinicId) =>
    set((state) => {
      const newState = { ...state.membersByClinic };
      delete newState[clinicId];
      return { membersByClinic: newState };
    }),
}));