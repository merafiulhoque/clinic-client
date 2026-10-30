"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";

// Import your custom showToast function from wherever it is located
// import { showToast } from "@/shared/utils/toast"; 

import { useClinicStore } from "@/shared/stores/clinic-store";
import { DoctorOfClinic, getAllAssignedDoctorsAction } from "@/actions/doctor-clinic/getAll";
import { createScheduleData, createScheduleSchema } from "@/shared/types/schemas";
import { createNewScheduleAction } from "@/actions/schedules/createNew";
import { timeToMinutes } from "@/shared/utils/formatTime";
import { showToast } from "@/shared/stores/toast-store";

const WEEKDAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export default function CreateSchedulePage() {
  const { activeClinic, availableClinics } = useClinicStore();
  
  const [filterMode, setFilterMode] = useState<"CURRENT" | "ALL">("CURRENT");
  const [selectedDoctor, setSelectedDoctor] = useState<(DoctorOfClinic & { clinicName: string }) | null>(null);

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

  const { data: allClinicsWithDoctors, isLoading } = useQuery({
    queryKey: ["all-assigned-doctors"],
    queryFn: getAllAssignedDoctorsAction,
  });

  const scheduleMutation = useMutation({
    mutationFn: async (payload: createScheduleData) => {
      const result = await createNewScheduleAction(payload);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      // Replaced alert with custom showToast
      showToast({
        text: "Schedule created successfully",
        textColor: "white",
        bgColor: "green" // Assuming green for success
      });
      reset();
    },
    onError: (error: Error) => {
      // Replaced alert with custom showToast
      showToast({
        text: error.message,
        textColor: "white",
        bgColor: "red"
      });
    }
  });

  const onSubmit = (formData: any) => {
    if (!selectedDoctor) return;

    const startTimeInMinutes = timeToMinutes(formData.startTimeStr);
    const endTimeInMinutes = timeToMinutes(formData.endTimeStr);

    const payload = {
      doctorClinicId: selectedDoctor.doctorClinicId,
      dayOfWeek: formData.dayOfWeek,
      startTime: startTimeInMinutes,
      endTime: endTimeInMinutes,
    };

    // 1. Client-side Zod Validation
    const parsed = createScheduleSchema.safeParse(payload);
    
    if (!parsed.success) {
      // 2. Map Zod errors below specific form fields
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path === "startTime") {
          setError("startTimeStr", { type: "manual", message: issue.message });
        } else if (path === "endTime") {
          setError("endTimeStr", { type: "manual", message: issue.message });
        } else {
          setError(path as string, { type: "manual", message: issue.message });
        }
      });
      return; 
    }

    // 3. Mutate if validation passes
    scheduleMutation.mutate(parsed.data);
  };

  if (!activeClinic) {
    return <div className="p-4 border">Please select a clinic first from the dashboard.</div>;
  }

  const getClinicName = (clinicId: number) => {
    const clinic = availableClinics.find(c => c.clinicId === clinicId);
    return clinic ? clinic.clinicName : `Clinic ID: ${clinicId}`;
  };

  const filteredData = filterMode === "CURRENT" 
    ? allClinicsWithDoctors?.filter(c => c.clinicId === activeClinic.clinicId) || []
    : allClinicsWithDoctors || [];

  return (
    <div className="flex flex-col gap-8 max-w-4xl p-4">
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-2xl font-bold">Create Doctor Schedule</h1>
      </div>

      {!selectedDoctor ? (
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 p-4 border">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                checked={filterMode === "CURRENT"} 
                onChange={() => setFilterMode("CURRENT")} 
              />
              Only for {activeClinic.clinicName}
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                checked={filterMode === "ALL"} 
                onChange={() => setFilterMode("ALL")} 
              />
              All Clinics
            </label>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="p-4 border">Loading doctors...</div>
            ) : filteredData.length === 0 ? (
              <div className="p-4 border">No doctors found for the selected view.</div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredData.map((clinicData) => {
                  const clinicName = getClinicName(clinicData.clinicId);
                  
                  return (
                    <div key={clinicData.clinicId} className="flex flex-col gap-2 border p-4">
                      <h3 className="font-bold border-b pb-2 mb-2">{clinicName}</h3>
                      
                      {clinicData.doctorsOfThisClinic.length === 0 ? (
                        <p className="text-sm">No doctors assigned.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {clinicData.doctorsOfThisClinic.map((doc) => (
                            <button
                              key={doc.doctorClinicId}
                              onClick={() => setSelectedDoctor({ ...doc, clinicName })}
                              className="flex flex-col items-start p-4 border text-left"
                            >
                              <span className="font-bold">Dr. {doc.doctorName}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center p-4 border">
            <div className="flex flex-col">
              <span className="font-bold">Scheduling for: Dr. {selectedDoctor.doctorName}</span>
              <span className="text-sm">Clinic: {selectedDoctor.clinicName}</span>
            </div>
            <button className="p-2 border text-sm" onClick={() => setSelectedDoctor(null)}>
              Change Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Day of Week</label>
                <select 
                  {...register("dayOfWeek")} 
                  className={`p-2 border ${errors.dayOfWeek ? "border-red-500" : ""}`} 
                  required
                >
                  <option value="">-- Select Day --</option>
                  {WEEKDAYS.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                {errors.dayOfWeek && <span className="text-xs text-red-500">{String(errors.dayOfWeek.message)}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Start Time</label>
                <input 
                  type="time" 
                  {...register("startTimeStr")} 
                  className={`p-2 border ${errors.startTimeStr ? "border-red-500" : ""}`} 
                  required
                />
                {errors.startTimeStr && <span className="text-xs text-red-500">{String(errors.startTimeStr.message)}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">End Time</label>
                <input 
                  type="time" 
                  {...register("endTimeStr")} 
                  className={`p-2 border ${errors.endTimeStr ? "border-red-500" : ""}`}
                  required
                />
                {errors.endTimeStr && <span className="text-xs text-red-500">{String(errors.endTimeStr.message)}</span>}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t mt-2">
              <button 
                type="submit" 
                disabled={scheduleMutation.isPending}
                className="px-6 py-2 border font-bold"
              >
                {scheduleMutation.isPending ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}