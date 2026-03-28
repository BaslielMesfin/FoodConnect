import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Phone, Info, CheckCircle, Navigation } from "lucide-react";
import DispatchCardActions from "@/components/shelter/DispatchCardActions";
import Link from "next/link";
import { getTimeRemaining } from "@/lib/utils";

// This page can be cached until the token is marked complete, 
// but since real-time status matters, we keep it dynamic.
export const dynamic = "force-dynamic";

export default async function DriverPickupPage(props: { params: { token: string } }) {
  const params = await props.params;
  const { token } = params;

  const donation = await prisma.donation.findUnique({
    where: { magicLinkToken: token },
    include: {
      donor: { select: { organization: true, name: true, phone: true, address: true, lat: true, lng: true } },
      shelter: { select: { organization: true, name: true } },
    },
  });

  if (!donation) {
    notFound();
  }

  const donorName = donation.donor?.organization || donation.donor?.name || "Anonymous Donor";
  const address = donation.donor?.address || "Address not provided.";
  
  // Create a maps link if we have coordinates or address
  const mapLink = donation.donor?.address 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(donation.donor.address)}`
    : `https://www.google.com/maps/search/?api=1&query=${donation.donor?.lat},${donation.donor?.lng}`;

  const isComplete = donation.status === "COMPLETED";
  const isCancelled = donation.status === "CANCELLED" || donation.status === "EXPIRED";
  const { expired, hours, minutes } = getTimeRemaining(donation.expiresAt);

  return (
    <div style={{ minHeight: "100vh", background: "var(--fc-bg)", padding: "20px 16px", fontFamily: "var(--fc-font-body)", color: "var(--fc-text)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        
        {/* Header Branding */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "var(--fc-primary)", borderRadius: "var(--fc-radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></span>
            </div>
            <span style={{ fontFamily: "var(--fc-font-heading)", fontWeight: 800, fontSize: 20 }}>FoodConnect</span>
          </div>
        </div>

        {isComplete ? (
          <div className="fc-card animate-scale-in" style={{ padding: 40, textAlign: "center", borderTop: "4px solid var(--fc-primary)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <CheckCircle size={48} color="var(--fc-primary)" />
            </div>
            <h1 style={{ fontSize: 24, fontFamily: "var(--fc-font-heading)", marginBottom: 8 }}>Pickup Complete!</h1>
            <p style={{ color: "var(--fc-text-secondary)", fontSize: 15 }}>
              Thank you for rescuing this food on behalf of <strong>{donation.shelter?.organization || donation.shelter?.name}</strong>.
            </p>
          </div>
        ) : isCancelled ? (
          <div className="fc-card animate-scale-in" style={{ padding: 40, textAlign: "center", borderTop: "4px solid var(--fc-danger)" }}>
            <h1 style={{ fontSize: 24, fontFamily: "var(--fc-font-heading)", color: "var(--fc-danger)", marginBottom: 8 }}>Pickup Unavailable</h1>
            <p style={{ color: "var(--fc-text-secondary)", fontSize: 15 }}>
              This request was cancelled or has expired and is no longer active.
            </p>
          </div>
        ) : (
          <>
            {/* Active Details Card */}
            <div className="fc-card" style={{ overflow: "hidden" }}>
              {/* Top Banner */}
              <div style={{ background: "var(--fc-primary)", color: "white", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.9, marginBottom: 4 }}>
                  Destination
                </div>
                <h1 style={{ fontSize: 28, fontFamily: "var(--fc-font-heading)", margin: 0 }}>
                  {donorName}
                </h1>
              </div>

              {/* Info section */}
              <div style={{ padding: 20 }}>
                {expired && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "var(--fc-danger-light)", color: "var(--fc-danger)", borderRadius: "var(--fc-radius-sm)", marginBottom: 16, fontSize: 14, fontWeight: 500 }}>
                    <Info size={18} />
                    This pickup deadline has passed.
                  </div>
                )}
                
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <MapPin size={20} color="var(--fc-text-secondary)" style={{ marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 13, color: "var(--fc-text-secondary)", fontWeight: 500, marginBottom: 2 }}>ADDRESS</div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{address}</div>
                      <Link href={mapLink} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--fc-primary)", fontSize: 14, fontWeight: 500, marginTop: 6, textDecoration: "none" }}>
                        <Navigation size={14} /> Get Directions
                      </Link>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <Phone size={20} color="var(--fc-text-secondary)" />
                    <div>
                      <div style={{ fontSize: 13, color: "var(--fc-text-secondary)", fontWeight: 500, marginBottom: 2 }}>CONTACT / PHONE</div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>
                        <a href={`tel:${donation.donor?.phone}`} style={{ color: "var(--fc-text)", textDecoration: "none" }}>
                          {donation.donor?.phone || "No phone provided"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px dashed var(--fc-border)", margin: "20px 0" }} />

                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fc-text-secondary)", marginBottom: 8 }}>
                    Pickup Instructions
                  </div>
                  <div style={{ background: "var(--fc-surface-hover)", padding: 16, borderRadius: "var(--fc-radius-md)" }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                      {donation.foodDescription}
                    </div>
                    <div style={{ color: "var(--fc-text-secondary)", fontSize: 14, marginBottom: donation.pickupNotes ? 12 : 0 }}>
                      Weight: {donation.weightKg} KG • Expires: {expired ? "Expired" : `${hours}h ${minutes}m`}
                    </div>
                    {donation.pickupNotes && (
                      <div style={{ fontSize: 14, borderLeft: "3px solid var(--fc-primary)", paddingLeft: 12 }}>
                        {donation.pickupNotes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Block */}
            <div className="fc-card" style={{ padding: 24, textAlign: "center", border: "2px solid var(--fc-primary-light)" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fc-text-secondary)", marginBottom: 12 }}>
                Show this PIN to the donor upon arrival:
              </div>
              <div style={{ 
                fontSize: 48, 
                letterSpacing: "0.2em", 
                fontWeight: 800, 
                fontFamily: "var(--fc-font-heading)",
                color: "var(--fc-primary-dark)",
                background: "var(--fc-primary-light)",
                padding: "16px 20px",
                borderRadius: "var(--fc-radius-md)",
                display: "inline-block",
                marginBottom: 20
              }}>
                {donation.verificationPin}
              </div>

              <div style={{ fontSize: 14, color: "var(--fc-text-secondary)", marginBottom: 20 }}>
                Once verified, tap complete.
              </div>
              
              <DispatchCardActions 
                magicLinkToken={donation.magicLinkToken!} 
                donationId={donation.id} 
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}
