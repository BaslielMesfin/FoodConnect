import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Truck, Navigation, Phone, MapPin, Key, MessageSquare } from "lucide-react";
import { getTimeRemaining } from "@/lib/utils";
import DispatchCardActions from "@/components/shelter/DispatchCardActions";
import AutoRefresh from "@/components/shared/AutoRefresh";

export const dynamic = "force-dynamic";

export default async function ShelterDispatchPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch donations claimed by this shelter
  const activeDispatch = await prisma.donation.findMany({
    where: {
      shelterId: session.user.id,
      status: { in: ["CLAIMED", "IN_TRANSIT"] },
    },
    include: {
      donor: {
        select: { organization: true, name: true, phone: true, address: true },
      },
    },
    orderBy: { expiresAt: "asc" },
  });

  return (
    <div className="animate-fade-in">
      <AutoRefresh intervalMs={10000} />
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontFamily: "var(--fc-font-heading)", display: "flex", alignItems: "center", gap: 12 }}>
            <Truck size={28} color="var(--fc-primary)" />
            Active Dispatch
          </h1>
          <p style={{ color: "var(--fc-text-secondary)", fontSize: 14, marginTop: 4 }}>
            Monitor and coordinate food pick-ups you've claimed.
          </p>
        </div>
      </div>

      {activeDispatch.length === 0 ? (
        <div className="fc-card" style={{ padding: "48px 32px", textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--fc-radius-full)",
              background: "var(--fc-primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Navigation size={24} color="var(--fc-primary)" />
          </div>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>
            No active dispatch assignments.
          </h3>
          <p style={{ color: "var(--fc-text-secondary)", fontSize: 14, maxWidth: 400, margin: "0 auto" }}>
            Head over to the Dashboard to discover and claim surplus food available in your area today.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }}>
          {activeDispatch.map((donation) => {
            const { expired, hours, minutes } = getTimeRemaining(donation.expiresAt);

            return (
              <div key={donation.id} className="fc-card" style={{ display: "flex", flexDirection: "column" }}>
                {/* Header Phase */}
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--fc-border-light)", background: "var(--fc-primary-light)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--fc-primary-dark)", fontWeight: 600, fontSize: 13 }}>
                    <div style={{ width: 8, height: 8, background: "var(--fc-primary)", borderRadius: "50%", animation: "pulse 2s infinite" }}></div>
                    {donation.status}
                  </div>
                  <div className={`status-badge ${expired ? 'urgency-high' : 'urgency-low'}`}>
                    {expired ? "Expired" : `Pickup Deadline: ${hours}h ${minutes}m`}
                  </div>
                </div>

                {/* Donor Information */}
                <div style={{ padding: 20, flex: 1 }}>
                  <h2 style={{ fontSize: 20, fontFamily: "var(--fc-font-heading)", marginBottom: 4 }}>
                    {donation.donor?.organization || donation.donor?.name || "Anonymous Donor"}
                  </h2>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--fc-text-secondary)" }}>
                      <MapPin size={16} style={{ color: "var(--fc-primary)", flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong>Pickup Location</strong><br />
                        {donation.donor?.address || "Address hidden until claimed (Check map for est. location)"}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--fc-text-secondary)" }}>
                      <Phone size={16} style={{ color: "var(--fc-primary)" }} />
                      <span>{donation.donor?.phone || "No phone number provided"}</span>
                    </div>

                    <div style={{ background: "var(--fc-surface-hover)", padding: 12, borderRadius: "var(--fc-radius-sm)", borderLeft: "3px solid var(--fc-border)", marginTop: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fc-text-secondary)", marginBottom: 4 }}>DONATION DETAILS</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fc-text)" }}>{donation.foodDescription} ({donation.weightKg} KG)</div>
                      {donation.pickupNotes && (
                        <div style={{ display: "flex", gap: 6, fontSize: 13, color: "var(--fc-text-secondary)", marginTop: 6 }}>
                          <MessageSquare size={14} style={{ marginTop: 2, flexShrink: 0 }} /> 
                          <span style={{ fontStyle: "italic" }}>"{donation.pickupNotes}"</span>
                        </div>
                      )}
                    </div>
                    
                    {donation.magicLinkToken && (
                      <DispatchCardActions 
                        magicLinkToken={donation.magicLinkToken} 
                        donationId={donation.id}
                      />
                    )}
                  </div>
                </div>

                {/* Footer Action PIN */}
                <div style={{ padding: "16px 20px", background: "var(--fc-bg)", borderTop: "1px solid var(--fc-border-light)", borderBottomLeftRadius: "var(--fc-radius-md)", borderBottomRightRadius: "var(--fc-radius-md)" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fc-text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <Key size={14} /> Verification PIN
                      </div>
                      <p style={{ fontSize: 11, color: "var(--fc-text-muted)", maxWidth: 180 }}>Required to verify pickup with the donor.</p>
                    </div>
                    <div className="pin-display" style={{ padding: "8px 16px", fontSize: 24, letterSpacing: "0.2em", background: "white", border: "1px dashed var(--fc-border)", color: "var(--fc-primary-dark)" }}>
                      {donation.verificationPin}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
