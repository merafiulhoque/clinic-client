import { AuthInitializer } from "@/components/utility/auth-initializer";
import { Sidebar } from "@/components/layout/Sidebar"; // Adjust imports to your structure
import { Navbar } from "@/components/layout/Navbar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthInitializer>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="p-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {children}
          </main>
        </div>
      </div>
    </AuthInitializer>
  );
}