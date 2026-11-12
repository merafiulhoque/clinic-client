"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useClinicStore } from "@/shared/stores/clinic-store";
import { lookupDoctorsAction } from "@/actions/doctors/lookupAction";
import { assignDoctorToClinicSchema, AssignDoctorToClinicData, DoctorLookupResult } from "@/shared/types/schemas";
import { assignDoctorAction } from "@/actions/doctors/assignDoctorAction";

// --- ISOLATED CARD COMPONENT ---
function DoctorLookupCard({ 
  doctor, 
  clinicId 
}: { 
  doctor: DoctorLookupResult; 
  clinicId: number 
}) {
  const [assignMessage, setAssignMessage] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AssignDoctorToClinicData>({
    resolver: zodResolver(assignDoctorToClinicSchema),
    defaultValues: {
      doctorId: doctor.doctorId,
      clinicId: clinicId,
      fees: 0,
    }
  });

  const onSubmit = async (data: AssignDoctorToClinicData) => {
    setAssignMessage(null);
    setAssignError(null);
    try {
      const response = await assignDoctorAction(data);
      setAssignMessage(response.message);
    } catch (err: any) {
      setAssignError(err.message || "Failed to assign doctor");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 border p-4">
      <div className="flex flex-col gap-1 border-b pb-4">
        <span className="font-bold text-lg">Dr. {doctor.doctorName}</span>
        <span className="text-sm">{doctor.doctorQualification}</span>
        <span className="text-xs">ID: {doctor.doctorId}</span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold">Consultation Fees</label>
        <input 
          type="number" 
          {...register("fees", {valueAsNumber: true})} 
          className="border p-2" 
          placeholder="Enter fees amount"
        />
        {errors.fees && <span className="text-xs text-red-500">{errors.fees.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || !!assignMessage} 
        className="border px-4 py-2 font-bold disabled:opacity-50 mt-2"
      >
        {isSubmitting ? "Assigning..." : assignMessage ? "Assigned" : "Add to Clinic"}
      </button>

      {assignMessage && <span className="text-sm text-green-600 font-bold">{assignMessage}</span>}
      {assignError && <span className="text-sm text-red-500 font-bold">{assignError}</span>}
    </form>
  );
}


// --- MAIN PAGE COMPONENT ---
export default function LookupDoctorsPage() {
  const { activeClinic } = useClinicStore();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: doctors, isLoading, isError, error } = useQuery({
    queryKey: ["all-doctors-lookup", page, limit],
    queryFn: () => lookupDoctorsAction(page, limit),
  });

  if (!activeClinic) {
    return <div className="p-4 border">Please select a clinic first from the dashboard.</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl p-4">
      
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-2xl font-bold">Lookup Existing Doctors</h1>
        <p className="text-sm">Search and assign registered doctors to: {activeClinic.clinicName}</p>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="p-4 border text-sm">Loading doctors database...</div>
        ) : isError ? (
          <div className="p-4 border text-sm text-red-500">
            Error: {error instanceof Error ? error.message : "Failed to load"}
          </div>
        ) : !doctors || doctors.length === 0 ? (
          <div className="p-4 border text-sm">No doctors found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <DoctorLookupCard 
                key={doctor.doctorId} 
                doctor={doctor} 
                clinicId={activeClinic.clinicId} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between border-t pt-4">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
          className="border px-4 py-2 font-bold disabled:opacity-50"
        >
          Previous
        </button>
        <span className="p-2 text-sm font-bold">Page {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={!doctors || doctors.length < limit}
          className="border px-4 py-2 font-bold disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}