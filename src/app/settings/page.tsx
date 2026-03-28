import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AuthProvider from "@/components/providers/AuthProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageWrapper from "@/components/shared/PageWrapper";
import { Settings, UserCircle, MapPin, Building2, Phone } from "lucide-react";
import SettingsForm from "./SettingsForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch complete user profile
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <AuthProvider>
      <DashboardLayout>
        <PageWrapper>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fc-text-secondary)", marginBottom: 4 }}>
              Preferences & Profile
            </div>
            <h1 style={{ fontSize: 28, fontFamily: "var(--fc-font-heading)", display: "flex", alignItems: "center", gap: 12 }}>
              <Settings size={28} color="var(--fc-primary)" />
              Account Settings
            </h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "flex-start" }}>
            
            {/* Main Form Section */}
            <div className="fc-card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: 18, fontFamily: "var(--fc-font-heading)", borderBottom: "1px solid var(--fc-border-light)", paddingBottom: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <UserCircle size={20} color="var(--fc-text-secondary)" />
                Profile Details
              </h2>
              <SettingsForm user={{
                name: user.name,
                organization: user.organization,
                email: user.email,
                phone: user.phone,
                address: user.address
              }} />
            </div>

            {/* Side Info Panel */}
            <div className="fc-card" style={{ padding: 24, background: "linear-gradient(to bottom, var(--fc-surface), var(--fc-bg))" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--fc-primary-light)", color: "var(--fc-primary)", fontSize: 32, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  {(user.name || "U")[0].toUpperCase()}
                </div>
                <h3 style={{ fontSize: 18, fontFamily: "var(--fc-font-heading)" }}>{user.organization || user.name}</h3>
                <div style={{ fontSize: 13, color: "var(--fc-text-secondary)", marginTop: 4, textTransform: "capitalize" }}>
                  {user.role} Account
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px", background: "white", borderRadius: "var(--fc-radius-sm)", border: "1px solid var(--fc-border)" }}>
                  <Building2 size={16} color="var(--fc-text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: "var(--fc-text-secondary)", wordBreak: "break-word" }}>
                    {user.organization || "No organization set"}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px", background: "white", borderRadius: "var(--fc-radius-sm)", border: "1px solid var(--fc-border)" }}>
                  <Phone size={16} color="var(--fc-text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: "var(--fc-text-secondary)", wordBreak: "break-word" }}>
                    {user.phone || "No phone number set"}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px", background: "white", borderRadius: "var(--fc-radius-sm)", border: "1px solid var(--fc-border)" }}>
                  <MapPin size={16} color="var(--fc-text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: "var(--fc-text-secondary)", wordBreak: "break-word" }}>
                    {user.address || "No address set. This may delay driver tracking."}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </PageWrapper>
      </DashboardLayout>
    </AuthProvider>
  );
}
