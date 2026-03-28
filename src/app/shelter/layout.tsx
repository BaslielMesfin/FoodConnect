import AuthProvider from "@/components/providers/AuthProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ShelterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
