"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized access. Please log in again." };
  }

  const name = formData.get("name") as string;
  const organization = formData.get("organization") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        organization: organization || null,
        phone: phone || null,
        address: address || null,
      },
    });

    // Revalidate multiple paths that might rely on user data
    revalidatePath("/settings");
    revalidatePath("/donor");
    revalidatePath("/shelter");

    return { 
      success: true, 
      user: {
        name: updatedUser.name,
        organization: updatedUser.organization,
      }
    };
  } catch (error) {
    console.error("Failed to update profile", error);
    return { error: "An error occurred while updating your profile. Please try again." };
  }
}
