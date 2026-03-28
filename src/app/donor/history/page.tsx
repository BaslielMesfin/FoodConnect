import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, Search, PackageX } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import EmptyState from "@/components/shared/EmptyState";

export const dynamic = "force-dynamic";

export default async function DonorHistoryPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch all donations by this donor
  const donations = await prisma.donation.findMany({
    where: {
      donorId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
    include: {
      shelter: {
        select: { organization: true, name: true },
      },
    },
  });

  return (
    <PageWrapper>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fc-text-secondary)", marginBottom: 4 }}>
            Past Activity
          </div>
          <h1 style={{ fontSize: 28, fontFamily: "var(--fc-font-heading)", display: "flex", alignItems: "center", gap: 12 }}>
            <Package size={28} color="var(--fc-primary)" />
            Donation History
          </h1>
        </div>
        
        <div style={{ position: "relative", width: 240 }}>
          <Search size={16} color="var(--fc-text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search donations..." 
            className="fc-input" 
            style={{ paddingLeft: 36, borderRadius: "var(--fc-radius-full)", background: "white", padding: "10px 16px 10px 36px" }} 
          />
        </div>
      </div>

      {donations.length === 0 ? (
        <EmptyState 
          icon={<PackageX size={28} strokeWidth={1.5} />}
          title="No History Yet"
          description="You haven't posted any surplus food donations. Once you do, they will be logged here."
        />
      ) : (
        <div className="fc-card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--fc-bg)", borderBottom: "1px solid var(--fc-border-light)", color: "var(--fc-text-secondary)", textTransform: "uppercase", fontSize: 12, letterSpacing: "0.05em" }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: 600 }}>Date Posted</th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: 600 }}>Food Description</th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: 600 }}>Weight</th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: 600 }}>Shelter Partner</th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation: any) => (
                <tr key={donation.id} style={{ borderBottom: "1px solid var(--fc-border-light)", transition: "background 0.2s" }} className="hover:bg-[var(--fc-surface-hover)]">
                  <td style={{ padding: "16px 20px" }}>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(donation.createdAt)}
                  </td>
                  <td style={{ padding: "16px 20px", fontWeight: 500 }}>
                    {donation.foodDescription}
                  </td>
                  <td style={{ padding: "16px 20px", color: "var(--fc-text-secondary)" }}>
                    {donation.weightKg} KG
                  </td>
                  <td style={{ padding: "16px 20px", color: "var(--fc-text-secondary)" }}>
                    {donation.shelter?.organization || donation.shelter?.name || "—"}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span className={`status-badge status-${donation.status.toLowerCase()}`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
}
