import { CLINIC_MEMBER_MODULE_OPTIONS } from "@/shared/config/modules/owner_modules/clinicMemberModule";
import Link from "next/link";

export default function StaffModulePage() {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
      
      {/* Header Structure */}
      <div className="border-b pb-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <p className="text-sm">Manage your clinic members, roles, and assignments.</p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CLINIC_MEMBER_MODULE_OPTIONS.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            className="border p-6 flex flex-col gap-2"
          >
            <h2 className="font-bold text-lg">{option.title}</h2>
            <span className="text-sm">{option.description}</span>
          </Link>
        ))}
      </div>

    </div>
  );
}