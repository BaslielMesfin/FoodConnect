"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { claimDonation } from "@/app/actions/donation";

export default function ClaimButton({ donationId }: { donationId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await claimDonation(donationId);
      if (result.error) {
        setError(result.error);
        setLoading(false);
      }
      // If success, revalidatePath in the server action will handle the refresh
    } catch {
      setError("Failed to claim. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <button
        onClick={handleClaim}
        disabled={loading}
        className="fc-btn-primary"
        style={{
          width: "100%",
          padding: "8px 0",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          height: 36,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <CheckCircle2 size={14} />
        )}
        {loading ? "Accepting..." : "Accept Item"}
      </button>
      {error && (
        <div style={{ position: "absolute", bottom: -20, left: 0, right: 0, fontSize: 10, color: "var(--fc-danger)", textAlign: "center", fontWeight: 600 }}>
          {error}
        </div>
      )}
    </div>
  );
}
