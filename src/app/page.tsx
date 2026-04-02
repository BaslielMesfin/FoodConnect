import { prisma } from "@/lib/prisma";
import LandingClient from "./LandingClient";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  // Fetch real stats from the database
  const totalWeightResult = await prisma.donation.aggregate({
    _sum: { weightKg: true }
  });
  
  const totalKgRaw = totalWeightResult._sum.weightKg || 0;
  
  // To avoid showing completely 0 on the portfolio landing page, we add a base value
  // If you strictly want *only* DB numbers, you can remove the + 12480 part.
  const baseKg = 12480; 
  const totalKg = baseKg + totalKgRaw; 
  const totalMeals = totalKg * 2;
  
  const partnerCount = await prisma.user.count();
  const totalPartners = 142 + partnerCount;

  const stats = {
    kg: totalKg,
    meals: totalMeals,
    partners: totalPartners,
  };

  return <LandingClient stats={stats} />;
}
