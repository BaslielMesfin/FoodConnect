import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageWrapper from "@/components/shared/PageWrapper";
import { Users, Search, Building2, MapPin, Phone, Mail, PackageCheck } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  // Find all completely processed donations for this shelter to trace back to unique Donors
  const receivedDonations = await prisma.donation.findMany({
    where: { shelterId: session.user.id, status: "COMPLETED" },
    include: { donor: true },
    orderBy: { completedAt: "desc" }
  });

  // Extract unique donors using a Map
  const donorMap = new Map();
  receivedDonations.forEach(donation => {
    if (donation.donor && !donorMap.has(donation.donor.id)) {
      donorMap.set(donation.donor.id, {
        ...donation.donor,
        totalDonations: receivedDonations.filter(d => d.donorId === donation.donor.id).length,
        totalKg: receivedDonations
          .filter(d => d.donorId === donation.donor.id)
          .reduce((sum, d) => sum + d.weightKg, 0)
      });
    }
  });

  const partners = Array.from(donorMap.values());

  return (
    <PageWrapper>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fc-text-secondary)", marginBottom: 4 }}>
            Community Network
          </div>
          <h1 style={{ fontSize: 28, fontFamily: "var(--fc-font-heading)", display: "flex", alignItems: "center", gap: 12 }}>
            <Users size={28} color="var(--fc-primary)" />
            Donor Partners
          </h1>
        </div>
        
        <div style={{ position: "relative", width: 260 }}>
          <Search size={16} color="var(--fc-text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search partners..." 
            className="fc-input" 
            style={{ paddingLeft: 36, borderRadius: "var(--fc-radius-full)", background: "white", padding: "10px 16px 10px 36px" }} 
          />
        </div>
      </div>

      {partners.length === 0 ? (
        <EmptyState 
          icon={<Users size={28} strokeWidth={1.5} />}
          title="No Partners Yet"
          description="Your directory will populate automatically once you successfully receive food from a donor."
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {partners.map(partner => (
            <div key={partner.id} className="fc-card" style={{ display: "flex", flexDirection: "column", padding: 24, borderTop: "4px solid var(--fc-primary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: "var(--fc-radius-md)", background: "var(--fc-primary-light)", color: "var(--fc-primary)", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {(partner.organization || partner.name || "D")[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontFamily: "var(--fc-font-heading)", margin: "0 0 2px" }}>
                    {partner.organization || partner.name}
                  </h3>
                  <div style={{ fontSize: 13, color: "var(--fc-text-secondary)" }}>
                    Partnered Donor
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 20 }}>
                {partner.address && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--fc-text)" }}>
                    <MapPin size={16} color="var(--fc-text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.4 }}>{partner.address}</span>
                  </div>
                )}
                {partner.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--fc-text)" }}>
                    <Mail size={16} color="var(--fc-text-muted)" />
                    {partner.email}
                  </div>
                )}
                {partner.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--fc-text)" }}>
                    <Phone size={16} color="var(--fc-text-muted)" />
                    {partner.phone}
                  </div>
                )}
              </div>

              <div style={{ background: "var(--fc-bg)", padding: "12px 16px", borderRadius: "var(--fc-radius-sm)", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px dashed var(--fc-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PackageCheck size={16} color="var(--fc-primary)" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fc-text-secondary)" }}>Contributions</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--fc-font-heading)" }}>
                  {partner.totalDonations} <span style={{ fontSize: 11, fontWeight: 500, color: "var(--fc-text-secondary)" }}>({partner.totalKg} KG)</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
