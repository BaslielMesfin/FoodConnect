"use client";

import { useState } from "react";
import { Link as LinkIcon, CheckCircle, Smartphone, Loader2 } from "lucide-react";
import { completePickup } from "@/app/actions/driver";

interface Props {
  magicLinkToken: string;
  donationId: string;
}

export default function DispatchCardActions({ magicLinkToken, donationId }: Props) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickupUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/pickup/${magicLinkToken}`
    : `/pickup/${magicLinkToken}`;

  const handleCopy = async () => {
    if (typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(pickupUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    // Passing the magic link token acts as the auth mechanism here
    const result = await completePickup(magicLinkToken);
    
    // We don't set loading back to false on success because Server Action revalidation 
    // will replace the component. If error, we stop loading to let them retry.
    if (result.error) {
      alert(result.error);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
      <button 
        onClick={handleCopy}
        className="fc-btn-secondary" 
        style={{ flex: 1, padding: "10px 12px", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
      >
        <Smartphone size={16} />
        {copied ? "Link Copied!" : "Driver Link"}
      </button>

      <button 
        onClick={handleComplete}
        disabled={loading}
        className="fc-btn-primary" 
        style={{ flex: 1, padding: "10px 12px", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
        {loading ? "Completing..." : "Complete Pickup"}
      </button>
    </div>
  );
}
