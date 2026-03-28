"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generatePin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createDonation(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "DONOR") {
    return { error: "Unauthorized. Only donors can create donations." };
  }

  const foodDescription = formData.get("foodType") as string;
  const weightKg = parseFloat(formData.get("weightKg") as string);
  const expiresAt = new Date(formData.get("expiresAt") as string);
  const pickupNotes = formData.get("pickupNotes") as string;

  if (!foodDescription || isNaN(weightKg) || !expiresAt) {
    return { error: "Missing required fields." };
  }

  if (expiresAt <= new Date()) {
    return { error: "Expiration time must be in the future." };
  }

  // Generate a random 4-digit PIN for handoff verification
  const verificationPin = generatePin();
  const magicLinkToken = crypto.randomUUID();

  try {
    const donation = await prisma.donation.create({
      data: {
        donorId: session.user.id,
        foodDescription,
        weightKg,
        expiresAt,
        pickupNotes: pickupNotes || null,
        status: "PENDING",
        verificationPin,
        magicLinkToken,
      },
    });

    revalidatePath("/donor");
    revalidatePath("/shelter"); // Revalidate shelter side so they see it immediately

    return { success: true, donationId: donation.id };
  } catch (error) {
    console.error("Failed to create donation:", error);
    return { error: "Failed to create donation. Please try again." };
  }
}

export async function cancelDonation(donationId: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== "DONOR") {
    return { error: "Unauthorized." };
  }

  try {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
    });

    if (!donation) {
      return { error: "Donation not found." };
    }

    if (donation.donorId !== session.user.id) {
      return { error: "You can only cancel your own donations." };
    }

    if (donation.status === "COMPLETED") {
      return { error: "Cannot cancel a completed donation." };
    }

    await prisma.donation.update({
      where: { id: donationId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/donor");
    revalidatePath("/shelter");

  } catch (error) {
    console.error("Failed to cancel donation:", error);
  }
}

export async function claimDonation(donationId: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== "SHELTER") {
    return { error: "Unauthorized. Only shelters can claim donations." };
  }

  try {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
    });

    if (!donation) {
      return { error: "Donation not found." };
    }

    if (donation.status !== "PENDING") {
      return { error: "This donation is no longer available." };
    }

    if (donation.expiresAt <= new Date()) {
      return { error: "This donation has expired." };
    }

    // Update status to CLAIMED and assign the Shelter ID
    await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: "CLAIMED",
        shelterId: session.user.id,
        claimedAt: new Date(),
      },
    });

    // Revalidate paths so dashboards update immediately
    revalidatePath("/donor");
    revalidatePath("/shelter");
    revalidatePath("/shelter/dispatch");

    return { success: true };
  } catch (error) {
    console.error("Failed to claim donation:", error);
    return { error: "Failed to claim donation." };
  }
}
