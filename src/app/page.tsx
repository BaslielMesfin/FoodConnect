import { prisma } from "@/lib/prisma";
import LandingClient from "./LandingClient";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  // Fetch real stats from the database
  const totalWeightResult = await prisma.donation.aggregate({
    _sum: { weightKg: true }
  });
  
  const totalKg = totalWeightResult._sum.weightKg || 0;
  const totalMeals = totalKg * 2;
  
  const totalPartners = await prisma.user.count();

  const stats = {
    kg: totalKg,
    meals: totalMeals,
    partners: totalPartners,
  };

  return <LandingClient stats={stats} />;
}
