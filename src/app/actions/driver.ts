"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Public action allows anyone with the exact magic link token to mark a pickup as completed.
 * Does not require authentication, which is the core value of the driver link.
 */
export async function completePickup(magicLinkToken: string) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { magicLinkToken },
    });

    if (!donation) {
      return { error: "Invalid or expired tracking link." };
    }

    if (donation.status === "COMPLETED") {
      return { error: "This donation has already been completed." };
    }

    if (donation.status !== "CLAIMED" && donation.status !== "IN_TRANSIT") {
      return { error: "This donation is not currently in an active dispatch state." };
    }

    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Revalidate all areas that list active/historical orders
    revalidatePath("/donor");
    revalidatePath("/donor/history");
    revalidatePath("/shelter");
    revalidatePath("/shelter/dispatch");
    revalidatePath("/shelter/history"); // if they have one or eventually
    revalidatePath(`/pickup/${magicLinkToken}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to complete pickup:", error);
    return { error: "Failed to process completion. Please try again." };
  }
}
