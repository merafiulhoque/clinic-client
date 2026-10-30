"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Stethoscope, Loader2 } from "lucide-react";

import { useDoctorStore} from "@/shared/stores/doctor-store";
import { useClinicStore } from "@/shared/stores/clinic-store";
import { assignDoctorToClinicSchema, AssignDoctorToClinicData } from "@/shared/types/schemas";
import { assignDoctorAction } from "@/actions/doctors/assignDoctorAction";
import { showToast } from "@/shared/stores/toast-store";
import { APP_URLS } from "@/shared/config/constants/urls";
import { DoctorListItem } from "@/shared/types";

export default function AssignDoctorPage() {
  const queryClient = useQueryClient();
  const { doctors } = useDoctorStore();
  const { availableClinics, activeClinic } = useClinicStore();
  
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorListItem | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignDoctorToClinicData>({
    resolver: zodResolver(assignDoctorToClinicSchema),
    // ADD THIS: Explicitly define the default values as numbers
    defaultValues: {
      doctorId: 0,
      clinicId: 0,
      fees: 0,
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (data: AssignDoctorToClinicData) => {
      const result = await assignDoctorAction(data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      showToast({ text: data.message, bgColor: "bg-green-600" });
      
      // Invalidate the doctors list query so the new clinic badge appears in the View Doctors page
      queryClient.invalidateQueries({ queryKey: ["doctors", "list"] });
      
      // Reset form and return to list view
      reset();
      setSelectedDoctor(null);
    },
    onError: (error: Error) => {
      showToast({ text: error.message || "Failed to assign doctor", bgColor: "bg-red-600" });
    },
  });

  const onSubmit = (data: AssignDoctorToClinicData) => {
    assignMutation.mutate(data);
  };

  const handleSelectDoctor = (doctor: DoctorListItem) => {
    setSelectedDoctor(doctor);
    // Pre-fill the doctorId and default to the currently active clinic
    reset({ 
      doctorId: doctor.doctorId,
      clinicId: activeClinic?.clinicId || 0,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <Link 
          href={`${APP_URLS.OWNER_DASHBOARD}/doctors`} 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctor Module
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Assign Doctor</h1>
          <p className="text-sm text-muted-foreground">Link registered doctors to your clinics and set their consultation fees.</p>
        </div>
      </div>

      {/* Conditionally render the Form or the List */}
      {selectedDoctor ? (
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm max-w-xl">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Assigning Dr. {selectedDoctor.fullName}</h3>
              <p className="text-sm text-muted-foreground">ID: {selectedDoctor.doctorId}</p>
            </div>
            <button 
              onClick={() => setSelectedDoctor(null)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden doctorId field - Cast to Number */}
            <input type="hidden" {...register("doctorId", { valueAsNumber: true })} />

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="clinicId">
                Select Clinic
              </label>
              {/* Select Clinic - Cast to Number */}
              <select
                {...register("clinicId", { valueAsNumber: true })}
                id="clinicId"
                disabled={assignMutation.isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
              >
                <option value="0">-- Choose a Clinic --</option>
                {availableClinics.map((clinic) => (
                  <option key={clinic.clinicId} value={clinic.clinicId}>
                    {clinic.clinicName} ({clinic.clinicLocation})
                  </option>
                ))}
              </select>
              {errors.clinicId && <p className="text-xs text-red-500">{errors.clinicId.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="fees">
                Consultation Fees (₹)
              </label>
              {/* Fees - Cast to Number */}
              <input
                {...register("fees", { valueAsNumber: true })}
                id="fees"
                type="number"
                min="0"
                placeholder="e.g. 500"
                disabled={assignMutation.isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
              />
              {errors.fees && <p className="text-xs text-red-500">{errors.fees.message}</p>}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={assignMutation.isPending}
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {assignMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Assignment
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-accent/50 rounded-xl border border-border">
              <p className="text-muted-foreground">No doctors available. Please add a doctor first.</p>
            </div>
          ) : (
            doctors.map((doctor) => (
              <div 
                key={doctor.doctorId} 
                className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight text-foreground truncate w-full pr-2">
                      Dr. {doctor.fullName}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">ID: {doctor.doctorId}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectDoctor(doctor)}
                  className="w-full inline-flex items-center justify-center rounded-md border border-primary text-primary hover:bg-primary/10 h-9 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Assign to Clinic
                </button>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}