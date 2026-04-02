import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin, Info, ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import { getUrgencyColor, getTimeRemaining, getUrgencyLevel } from "@/lib/utils";
import AutoRefresh from "@/components/shared/AutoRefresh";
import PageWrapper from "@/components/shared/PageWrapper";
import EmptyState from "@/components/shared/EmptyState";
import { PackageX, CheckCircle2 } from "lucide-react";
import ClaimButton from "@/components/shelter/ClaimButton";

// Make the dashboard dynamic so it always fetches fresh data on load
export const dynamicRoute = "force-dynamic";

import MapWrapper from "@/components/shelter/MapWrapper";

// Helper to generate a consistent dummy coordinate for a given string ID around Addis Ababa
function getDummyCoordinate(seed: string): { lat: number, lng: number } {
  const hash = seed.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const latOffset = (hash % 100) / 1000 - 0.05; // Random number between -0.05 and +0.05
  const lngOffset = (hash % 50) / 1000 - 0.025; // Random number between -0.025 and +0.025
  return {
    lat: 9.032 + latOffset,
    lng: 38.748 + lngOffset,
  };
}

export default async function ShelterDashboard() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch all PENDING available donations 
  const availableDonations = await prisma.donation.findMany({
    where: {
      status: "PENDING",
      expiresAt: {
        gt: new Date(), // Only get non-expired
      }
    },
    orderBy: { expiresAt: "asc" },
  });

  // Map dummy coordinates to the donations 
  const mappedDonations = availableDonations.map((donation: any) => ({
    ...donation,
    ...getDummyCoordinate(donation.id)
  }));

  return (
    <PageWrapper>
      <AutoRefresh intervalMs={15000} />
      <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }} className="animate-fade-in">
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--fc-primary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 2, background: "var(--fc-primary)" }} />
            Discovery Network
          </div>
          <h1 style={{ fontSize: 32, fontFamily: "var(--fc-font-heading)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Surplus Food Tracking
          </h1>
        </div>
        <div style={{ padding: "10px 20px", background: "var(--fc-surface)", border: "1px solid var(--fc-border)", borderRadius: "var(--fc-radius-full)", fontSize: 13, display: "flex", alignItems: "center", gap: 10, fontWeight: 700, boxShadow: "var(--fc-shadow-sm)" }}>
          <div style={{ width: 8, height: 8, background: "var(--fc-primary)", borderRadius: "50%", animation: "pulse 2s infinite" }}></div>
          Live Network Active
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "flex",
          gap: 24,
          flex: 1,
          minHeight: 0, // critical for nested flex layout to scroll
        }}
      >
        {/* Left Column: List View */}
        <div
          style={{
            width: 380,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            background: "var(--fc-surface)",
            borderRadius: "var(--fc-radius-md)",
            border: "1px solid var(--fc-border)",
            overflow: "hidden"
          }}
        >
          <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--fc-border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--fc-bg)" }}>
            <h2 style={{ fontSize: 15, fontFamily: "var(--fc-font-heading)", fontWeight: 800, display: "flex", alignItems: "center", gap: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Available Today
              <span style={{ fontSize: 12, padding: "2px 10px", background: "var(--fc-primary)", color: "white", borderRadius: "var(--fc-radius-full)", fontWeight: 700 }}>{mappedDonations.length}</span>
            </h2>
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {mappedDonations.length === 0 ? (
              <EmptyState
                icon={<PackageX size={28} strokeWidth={1.5} />}
                title="No Surplus Available"
                description="We will notify you when a donor posts an item."
              />
            ) : (
              mappedDonations.map((donation: any) => {
                const urgencyColor = getUrgencyColor(donation.expiresAt);
                const { hours, minutes } = getTimeRemaining(donation.expiresAt);

                return (
                    <div key={donation.id} className="fc-card hover-lift" style={{ 
                      padding: 16, 
                      background: "white",
                      borderTop: `4px solid ${urgencyColor}`,
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--fc-font-heading)", margin: 0 }}>{donation.foodDescription}</h3>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fc-text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={12} color="var(--fc-primary)" />
                          Est. 2km
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--fc-text-secondary)", marginBottom: 14 }}>
                        <div><strong>Weight:</strong> {donation.weightKg} KG</div>
                        <div style={{ color: hours < 1 ? "var(--fc-danger)" : "inherit", fontWeight: hours < 1 ? 700 : 500 }}>
                          <strong>Expires:</strong> {hours}h {minutes}m
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <ClaimButton donationId={donation.id} />
                      </div>
                    </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapWrapper donations={mappedDonations} />
        </div>
      </div>
    </PageWrapper>
  );
}
