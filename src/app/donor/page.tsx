import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrendingUp, Heart, Truck, Clock, AlertCircle, PackageX } from "lucide-react";
import { getUrgencyLevel, getTimeRemaining, getUrgencyColor } from "@/lib/utils";
import AutoRefresh from "@/components/shared/AutoRefresh";
import PageWrapper from "@/components/shared/PageWrapper";
import EmptyState from "@/components/shared/EmptyState";

// Make the dashboard dynamic so it always fetches fresh data on load
export const dynamic = "force-dynamic";

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <div className="fc-card hover-lift hover-glow animate-fade-in" style={{ padding: "24px", borderTop: `4px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fc-text-secondary)" }}>
          {label}
        </span>
        <div style={{ width: 32, height: 32, borderRadius: "var(--fc-radius-sm)", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          fontFamily: "var(--fc-font-heading)",
          color: "var(--fc-text)",
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: "var(--fc-text-secondary)", fontWeight: 500, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
        {subtext}
      </div>
    </div>
  );
}

export default async function DonorDashboard() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch active donations (PENDING, CLAIMED, IN_TRANSIT)
  const activeDonations = await prisma.donation.findMany({
    where: {
      donorId: session.user.id,
      status: { in: ["PENDING", "CLAIMED", "IN_TRANSIT"] },
    },
    orderBy: { expiresAt: "asc" },
  });

  // Calculate some stats (just examples based on active data for now)
  const totalWeight = activeDonations.reduce((acc: number, d: any) => acc + d.weightKg, 0);

  return (
    <PageWrapper>
      <AutoRefresh intervalMs={10000} />
      <div style={{ marginBottom: 32 }} className="animate-fade-in">
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--fc-primary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 2, background: "var(--fc-primary)" }} />
          Live Operations
        </div>
        <h1 style={{ fontSize: 28, fontFamily: "var(--fc-font-heading)", fontWeight: 700, letterSpacing: "-0.03em" }}>
          Operational Insight
        </h1>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard
          icon={TrendingUp}
          label="Total Rescued Volume"
          value={`${totalWeight.toFixed(1)} KG`}
          subtext="Active today"
          color="var(--fc-primary)"
        />
        <StatCard
          icon={Truck}
          label="Active Pickups"
          value={activeDonations.length.toString()}
          subtext="Currently Pending/In Transit"
          color="#3B82F6"
        />
        <StatCard
          icon={Clock}
          label="Average Response"
          value="-- min"
          subtext="Sufficient Data Needed"
          color="#7C3AED"
        />
        <StatCard
          icon={Heart}
          label="Total Meals"
          value={(totalWeight * 2).toFixed(0)} // Estimate 1 meal = 0.5kg
          subtext="♥ Active meal impact"
          color="var(--fc-tertiary)"
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }} className="animate-fade-in">
        <h2 style={{ fontSize: 21, fontFamily: "var(--fc-font-heading)", fontWeight: 700, display: "flex", alignItems: "center", gap: 12, letterSpacing: "-0.02em" }}>
          <Truck size={22} color="var(--fc-primary)" />
          Active Pickup Queue
        </h2>
      </div>

      {activeDonations.length === 0 ? (
        <EmptyState 
          icon={<PackageX size={28} strokeWidth={1.5} />} 
          title="No Active Pickups" 
          description="You don't have any surplus food awaiting pickup. Tap schedule pickup to make a donation!"
          actionHref="/donor?new=true"
          actionLabel="Schedule Pickup"
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {activeDonations.map((donation: any) => {
            const urgencyColor = getUrgencyColor(donation.expiresAt);
            const { expired, hours, minutes } = getTimeRemaining(donation.expiresAt);
            
            return (
              <div key={donation.id} className="fc-card" style={{ display: "flex", flexDirection: "column", borderTop: `4px solid ${urgencyColor}` }}>
                {/* Header: Urgency + Status */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--fc-border-light)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: hours < 4 ? "var(--fc-danger)" : "var(--fc-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={14} />
                    {expired ? "Expired" : `Expires in ${hours}h ${minutes}m`}
                  </div>
                  <div className={`status-badge status-${donation.status.toLowerCase()}`}>
                    {donation.status}
                  </div>
                </div>

                {/* Body: Details */}
                <div style={{ padding: 20, flex: 1 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 4, fontFamily: "var(--fc-font-body)" }}>
                    {donation.foodDescription}
                  </h3>
                  <div style={{ fontSize: 14, color: "var(--fc-text-secondary)", marginBottom: 16 }}>
                    {donation.weightKg} KG
                  </div>

                  {donation.pickupNotes && (
                    <div style={{ fontSize: 13, background: "var(--fc-bg)", padding: 12, borderRadius: "var(--fc-radius-sm)", color: "var(--fc-text)", borderLeft: "3px solid var(--fc-border)" }}>
                      <strong>Notes:</strong> {donation.pickupNotes}
                    </div>
                  )}
                </div>

                {/* Footer: PIN Display + Cancel */}
                <div style={{ padding: "16px 20px", background: "var(--fc-bg)", borderTop: "1px solid var(--fc-border-light)", borderBottomLeftRadius: "var(--fc-radius-md)", borderBottomRightRadius: "var(--fc-radius-md)", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fc-text-secondary)", marginBottom: 8 }}>
                      Driver Handoff PIN
                    </div>
                    <div className="pin-display" style={{ padding: "8px 16px", fontSize: 24, letterSpacing: "0.2em", background: "white", border: "1px dashed var(--fc-border)" }}>
                      {donation.verificationPin}
                    </div>
                  </div>
                  {donation.status === "PENDING" && (
                    <form action={async () => {
                      "use server";
                      const { cancelDonation } = await import("@/app/actions/donation");
                      await cancelDonation(donation.id);
                    }}>
                      <button type="submit" style={{ background: "none", border: "none", color: "var(--fc-danger)", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "8px" }} className="hover:underline">
                        Cancel Pickup
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
