import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Assuming you have standard Tailwind globals

import { QueryProvider } from "@/shared/providers/query-provider";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clinic Management System",
  description: "Manage your clinic and patient appointments",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <QueryProvider>
        {children}
      </QueryProvider>

      {/* Render toaster outside of QueryProvider at the root level */}
      <Toaster />
      </body>
      </html>
  );
}