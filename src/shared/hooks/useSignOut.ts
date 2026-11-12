"use client";

import { useRouter } from "next/navigation";
import { useClinicStore } from "@/shared/stores/clinic-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useDoctorStore } from "@/shared/stores/doctor-store";
import { signoutAction } from "@/actions/auth/signout";
import { APP_URLS } from "@/shared/config/constants/urls";

export function useSignOut() {
    const router = useRouter();
    const { clearClinics } = useClinicStore();
    const { clearUser } = useAuthStore();
    const { clearDoctors } = useDoctorStore();

    return async () => {
        await signoutAction();
        clearClinics();
        clearUser();
        clearDoctors();
        router.push(APP_URLS.SIGN_IN);
    };
}