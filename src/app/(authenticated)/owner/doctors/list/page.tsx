"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Stethoscope, MapPin, AlertCircle } from "lucide-react";

import { getDoctorsListAction } from "@/actions/doctors/getDoctorsListAction";
import { useDoctorStore } from "@/shared/stores/doctor-store";
import FullScreenLoader from "@/components/ui/Loader";
import { APP_URLS } from "@/shared/config/constants/urls";

export default function DoctorsListPage() {
  const { setDoctors } = useDoctorStore();

  const { data: fetchedDoctors, isLoading, error } = useQuery({
    queryKey: ["doctors", "list"],
    queryFn: getDoctorsListAction,
  });

  // Sync fetched data to the Zustand store for use in other pages (like Assign Doctor)
  useEffect(() => {
    if (fetchedDoctors) {
      setDoctors(fetchedDoctors);
    }
  }, [fetchedDoctors, setDoctors]);

  if (isLoading) return <FullScreenLoader />;

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl border border-red-100 max-w-lg mx-auto mt-10">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
        <h3 className="font-semibold">Failed to load doctors</h3>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Navigation */}
      <div>
        <Link 
          href={`${APP_URLS.OWNER_DASHBOARD}/doctors`} 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctor Module
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctors List</h1>
            <p className="text-sm text-muted-foreground">Manage all doctors registered under your account.</p>
          </div>
          <Link
            href={`${APP_URLS.OWNER_DASHBOARD}/doctors/add`}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + Add Doctor
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {!fetchedDoctors || fetchedDoctors.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto mt-10">
          <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            You haven't registered any doctors yet. Add your first doctor to get started.
          </p>
          <Link
            href={`${APP_URLS.OWNER_DASHBOARD}/doctors/add`}
            className="inline-flex bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Add Doctor
          </Link>
        </div>
      ) : (
        /* Doctors Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fetchedDoctors.map((doctor) => (
            <div 
              key={doctor.doctorId} 
              className="bg-card border border-border p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight text-foreground truncate w-full pr-2">
                    Dr. {doctor.fullName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">ID: {doctor.doctorId}</p>
                </div>
              </div>

              <div className="mt-auto border-t border-border pt-4">
                <h4 className="text-xs font-medium uppercase text-muted-foreground mb-3">
                  Assigned Clinics
                </h4>
                
                {doctor.clinics.length === 0 ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Not Assigned Yet
                  </span>
                ) : (
                  <div className="flex flex-col gap-2">
                    {doctor.clinics.map((clinic) => (
                      <div 
                        key={clinic.clinicId}
                        className="flex flex-col bg-accent/50 p-2 rounded-md border border-border/50"
                      >
                        <span className="text-sm font-medium text-foreground truncate">
                          {clinic.clinicName}
                        </span>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate">{clinic.clinicLocation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}