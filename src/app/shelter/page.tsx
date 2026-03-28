import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin, Info, ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import { getTimeRemaining, getUrgencyLevel } from "@/lib/utils";
import AutoRefresh from "@/components/shared/AutoRefresh";
import PageWrapper from "@/components/shared/PageWrapper";
import EmptyState from "@/components/shared/EmptyState";
import { PackageX } from "lucide-react";

// Make the dashboard dynamic so it always fetches fresh data on load
export const dynamicRoute = "force-dynamic";

import MapWrapper from "@/components/shelter/MapWrapper";

// Helper to generate a consistent dummy coordinate for a given string ID around Addis Ababa
function getDummyCoordinate(seed: string): { lat: number, lng: number } {
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
  const mappedDonations = availableDonations.map(donation => ({
    ...donation,
    ...getDummyCoordinate(donation.id)
  }));

  return (
    <PageWrapper>
      <AutoRefresh intervalMs={15000} />
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fc-primary)", marginBottom: 4 }}>
            Discovery Network
          </div>
          <h1 style={{ fontSize: 28, fontFamily: "var(--fc-font-heading)" }}>
            Surplus Food Tracking
          </h1>
        </div>
        <div style={{ padding: "8px 16px", background: "var(--fc-surface)", border: "1px solid var(--fc-border)", borderRadius: "var(--fc-radius-full)", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, background: "var(--fc-primary)", borderRadius: "50%", animation: "pulse 2s infinite" }}></div>
          Live Feed
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
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--fc-border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--fc-bg)" }}>
            <h2 style={{ fontSize: 16, fontFamily: "var(--fc-font-heading)", display: "flex", alignItems: "center", gap: 8 }}>
              Available Today
              <span style={{ fontSize: 12, padding: "2px 8px", background: "var(--fc-primary-light)", color: "var(--fc-primary)", borderRadius: "var(--fc-radius-full)" }}>{mappedDonations.length}</span>
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
              mappedDonations.map((donation) => {
                const urgency = getUrgencyLevel(donation.expiresAt);
                const { hours, minutes } = getTimeRemaining(donation.expiresAt);

                return (
                    <div key={donation.id} style={{ 
                      padding: 16, 
                      border: "1px solid var(--fc-border)", 
                      borderRadius: "var(--fc-radius-sm)", 
                      background: "var(--fc-bg)",
                      borderLeft: `4px solid var(--fc-${urgency === 'red' ? 'danger' : urgency === 'yellow' ? 'warning' : 'primary'})`
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <h3 style={{ fontSize: 16, fontFamily: "var(--fc-font-body)", margin: 0 }}>{donation.foodDescription}</h3>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fc-text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={12} />
                          Est. 2km
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--fc-text-secondary)", marginBottom: 12 }}>
                        <div><strong>Weight:</strong> {donation.weightKg} KG</div>
                        <div style={{ color: urgency === 'red' ? "var(--fc-danger)" : "inherit" }}>
                          <strong>Expires:</strong> {hours}h {minutes}m
                        </div>
                      </div>

                    <button className="fc-btn-secondary" style={{ width: "100%", padding: "6px 0", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      View on Map <ArrowUpRight size={14} />
                    </button>
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
