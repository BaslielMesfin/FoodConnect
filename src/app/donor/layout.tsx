import AuthProvider from "@/components/providers/AuthProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NewDonationModal from "@/components/donor/NewDonationModal";
import { Suspense } from "react";

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayout>
        {children}
        <Suspense fallback={null}>
          <NewDonationModal />
        </Suspense>
      </DashboardLayout>
    </AuthProvider>
  );
}
