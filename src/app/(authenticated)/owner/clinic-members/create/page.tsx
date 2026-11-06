"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

// import { showToast } from "@/shared/utils/toast"; // Adjust path to your toaster

import { useClinicStore } from "@/shared/stores/clinic-store";
import { memberCreateSchema, memberCreateData } from "@/shared/types/schemas";
import { createClinicMemberAction } from "@/actions/clinic-members/createNew";
import { showToast } from "@/shared/stores/toast-store";

export default function CreateClinicMemberPage() {
  const { activeClinic } = useClinicStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<memberCreateData>({
    resolver: zodResolver(memberCreateSchema),
    defaultValues: {
      clinicId: activeClinic?.clinicId,
    }
  });

  const memberMutation = useMutation({
    mutationFn: async (payload: memberCreateData) => {
      const result = await createClinicMemberAction(payload);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      showToast({
        text: data.message, // "member created"
        textColor: "white",
        bgColor: "green"
      });
      // Reset form but keep the current clinicId
      reset({ clinicId: activeClinic?.clinicId, email: "", password: "", role: undefined });
      history.back()
    },
    onError: (error: Error) => {
      showToast({
        text: error.message,
        textColor: "white",
        bgColor: "red"
      });
    }
  });

  const onSubmit = (data: memberCreateData) => {
    memberMutation.mutate(data);
  };

  if (!activeClinic) {
    return <div className="p-4 border">Please select a clinic first from the dashboard.</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl p-4">
      
      {/* Header Structure */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-2xl font-bold">Create Clinic Member</h1>
        <p className="text-sm">Adding member to: {activeClinic.clinicName}</p>
      </div>

      {/* Form Structure */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 border p-6">
        
        {/* Hidden Clinic ID (handled by React Hook Form defaultValues, but good to ensure it submits) */}
        <input type="hidden" {...register("clinicId", { valueAsNumber: true })} />

        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">Full Name</label>
          <input 
            type="name" 
            {...register("name")} 
            className={`p-2 border ${errors.email ? "border-red-500" : ""}`} 
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>


        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">Email Address</label>
          <input 
            type="email" 
            {...register("email")} 
            className={`p-2 border ${errors.email ? "border-red-500" : ""}`} 
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">Temporary Password</label>
          <input 
            type="text" 
            {...register("password")} 
            className={`p-2 border ${errors.password ? "border-red-500" : ""}`} 
          />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        {/* Role Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold">Assign Role</label>
          <select 
            {...register("role")} 
            className={`p-2 border ${errors.role ? "border-red-500" : ""}`}
          >
            <option value="">-- Select Role --</option>
            <option value="MANAGER">Manager</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="STAFF">Staff</option>
          </select>
          {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t mt-2">
          <button 
            type="submit" 
            disabled={memberMutation.isPending}
            className="px-6 py-2 border font-bold"
          >
            {memberMutation.isPending ? "Creating..." : "Create Member"}
          </button>
        </div>
        
      </form>
    </div>
  );
}