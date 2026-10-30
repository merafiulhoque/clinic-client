import Link from "next/link";
import { APP_URLS } from "@/shared/config/constants/urls";
import { CalendarCheck, Stethoscope, ArrowRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
            <div className="max-w-3xl space-y-8">

                {/* Header Icon */}
                <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Stethoscope className="h-12 w-12 text-primary" />
                    </div>
                </div>

                {/* Hero Text */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                        Clinic Management & <br className="hidden md:block" />
                        Patient Appointments
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A unified platform to find doctors, book your appointments seamlessly, and manage clinic operations efficiently.
                    </p>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    {/* Patient Action */}
                    <Link
                        href={APP_URLS.PUBLIC_DIRECTORY}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center"
                    >
                        <CalendarCheck className="h-5 w-5" />
                        Book an Appointment
                    </Link>

                    {/* Staff/Owner Actions */}
                    <Link
                        href={APP_URLS.SIGN_IN}
                        className="flex items-center gap-2 border border-input bg-background px-8 py-3 rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-auto justify-center"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Sign Up Link */}
                <div className="pt-8">
                    <Link
                        href={APP_URLS.SIGN_UP}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        New clinic owner? Create an account
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
}