import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageWrapper from "@/components/shared/PageWrapper";
import { BarChart3 } from "lucide-react";
import AnalyticsClient from "./AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function ShelterAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const donations = await prisma.donation.findMany({
    where: { shelterId: session.user.id, status: "COMPLETED" },
    orderBy: { createdAt: "asc" }
  });

  return (
    <PageWrapper>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fc-text-secondary)", marginBottom: 4 }}>
          Shelter Insights
        </div>
        <h1 style={{ fontSize: 28, fontFamily: "var(--fc-font-heading)", display: "flex", alignItems: "center", gap: 12 }}>
          <BarChart3 size={28} color="var(--fc-primary)" />
          Intake Analytics
        </h1>
      </div>
      
      <AnalyticsClient donations={donations} />
    </PageWrapper>
  );
}
