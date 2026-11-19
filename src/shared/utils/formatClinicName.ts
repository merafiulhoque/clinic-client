import { UserClinicInfo } from "../stores/clinic-store";

export const formatClinicName = (
    clinic: UserClinicInfo | null
): string => {
    if (!clinic) return "Select Clinic"
    if (!clinic.clinicName || clinic.clinicName === undefined || !clinic.clinicLocation || clinic.clinicLocation === undefined) return "Select your clinic"
    return clinic.clinicName + " " + clinic.clinicLocation
}