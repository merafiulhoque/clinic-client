"use client";

import { useQuery } from "@tanstack/react-query";
import { useClinicStore } from "@/shared/stores/clinic-store";
import { useClinicMemberStore } from "@/shared/stores/clinic-member-store";
import { getClinicMembersAction } from "@/actions/clinic-members/getMembers";

export default function ViewClinicMembersPage() {
  const { activeClinic } = useClinicStore();
  const { membersByClinic, setMembers } = useClinicMemberStore();

  const clinicId = activeClinic?.clinicId;
  const zustandMembers = clinicId ? membersByClinic[clinicId] : undefined;

  const { data: fetchedMembers, isLoading, isError, error } = useQuery({
    queryKey: ["clinic-members", clinicId],
    queryFn: async () => {
      if (!clinicId) return [];
      const result = await getClinicMembersAction(clinicId);
      // Save to Zustand once fetched
      setMembers(clinicId, result);
      return result;
    },
    // ONLY fetch if we have an active clinic AND the data is not already in Zustand
    enabled: !!clinicId && !zustandMembers, 
  });

  if (!activeClinic) {
    return <div className="p-4 border">Please select a clinic first from the dashboard.</div>;
  }

  // Use Zustand data if available, fallback to fetched data
  const displayMembers = zustandMembers || fetchedMembers;

  return (
    <div className="flex flex-col gap-8 max-w-4xl p-4">
      
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-2xl font-bold">View Clinic Members</h1>
        <p className="text-sm">Displaying members for: {activeClinic.clinicName}</p>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading && !zustandMembers ? (
          <div className="p-4 border text-sm">Loading clinic members...</div>
        ) : isError ? (
          <div className="p-4 border text-red-500 text-sm">
            Failed to load members: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        ) : !displayMembers || displayMembers.length === 0 ? (
          <div className="p-4 border text-sm">
            No clinic members found for this clinic.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayMembers.map((member) => (
              <div key={member.id} className="flex flex-col gap-2 border p-4">
                <span className="font-bold text-lg">
                  {member.name || "Unnamed Member"}
                </span>
                <span className="text-xs border-t pt-2">
                  Member ID: {member.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}