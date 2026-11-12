"use server";

import { api } from "@/shared/api";
import { AppointmentResponse, BookingFormData, bookingFormSchema, PublicSlot } from "@/shared/types/schemas";
import { decodeId } from "@/shared/utils/hashids";

// 1. Fetch available slots
export async function getSlotsAction(publicId: string, date: string): Promise<PublicSlot[]> {
  const doctorClinicId = decodeId(publicId);
  
  if (!doctorClinicId) {
    throw new Error("Invalid clinic link");
  }

  return api<PublicSlot[]>(`/api/v1/public-corner/${doctorClinicId}/slots?date=${date}`, {
    method: "GET",
  });
}

// 2. Book the appointment
export async function bookSlotAction(data: BookingFormData): Promise<AppointmentResponse> {
  // Validate the payload exactly as you specified
  const parsed = bookingFormSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid booking data");
  }

  // Your backend schema uses z.iso.date().transform() on the server, 
  // so we just pass the YYYY-MM-DD string exactly as it is.
  return api<AppointmentResponse>(`/api/v1/public-corner/book-slot`, {
    method: "POST",
    body: parsed.data,
  });
}