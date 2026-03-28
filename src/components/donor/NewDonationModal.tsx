"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Package, Clock, Send, AlertCircle, Loader2 } from "lucide-react";
import { createDonation } from "@/app/actions/donation";

const commonFoodTypes = [
  "Prepared Meals",
  "Fresh Produce",
  "Baked Goods",
  "Packaged Items",
  "Dairy Products",
];

export default function NewDonationModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("new") === "true";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [foodType, setFoodType] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");

  useEffect(() => {
    // Set default expiration to 2 hours from now
    if (isOpen && !expiresAt) {
      const date = new Date();
      date.setHours(date.getHours() + 2);
      // Format to YYYY-MM-DDThh:mm for datetime-local
      setExpiresAt(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    }
  }, [isOpen, expiresAt]);

  if (!isOpen) return null;

  const closeModal = () => {
    router.push("/donor");
  };

  const handleQuickAdd = (hours: number) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    setExpiresAt(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("foodType", foodType);
    formData.append("weightKg", weightKg);
    formData.append("expiresAt", new Date(expiresAt).toISOString());
    formData.append("pickupNotes", pickupNotes);

    const result = await createDonation(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Success
      setFoodType("");
      setWeightKg("");
      setPickupNotes("");
      setLoading(false);
      closeModal();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={closeModal}
    >
      <div
        className="fc-card animate-scale-in"
        style={{
          width: "100%",
          maxWidth: 500,
          background: "var(--fc-surface)",
          position: "relative",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid var(--fc-border-light)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 20, fontFamily: "var(--fc-font-heading)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ padding: 6, background: "var(--fc-primary-light)", borderRadius: "var(--fc-radius-sm)", color: "var(--fc-primary)" }}>
              <Package size={20} />
            </div>
            Post Surplus Food
          </h2>
          <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fc-text-secondary)" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24, overflowY: "auto" }}>
          {error && (
            <div style={{ padding: 12, background: "var(--fc-danger-light)", color: "var(--fc-danger)", borderRadius: "var(--fc-radius-sm)", fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form id="donation-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Food Type */}
            <div>
              <label className="fc-label">Food Type</label>
              <input
                type="text"
                className="fc-input"
                placeholder="e.g., 50x Prepared Sandwiches"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                required
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {commonFoodTypes.map((type: any) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFoodType(type)}
                    style={{
                      padding: "4px 10px",
                      background: foodType === type ? "var(--fc-primary-light)" : "var(--fc-bg)",
                      border: `1px solid ${foodType === type ? "var(--fc-primary)" : "var(--fc-border)"}`,
                      color: foodType === type ? "var(--fc-primary-dark)" : "var(--fc-text-secondary)",
                      borderRadius: "var(--fc-radius-full)",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="fc-label">Total Weight (KG)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                className="fc-input"
                placeholder="0.0"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
              />
            </div>

            {/* Expiration */}
            <div>
              <label className="fc-label">Pickup Deadline</label>
              <input
                type="datetime-local"
                className="fc-input"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <Clock size={14} color="var(--fc-text-muted)" />
                <span style={{ fontSize: 12, color: "var(--fc-text-secondary)" }}>Quick set:</span>
                <button type="button" onClick={() => handleQuickAdd(1)} style={{ fontSize: 12, color: "var(--fc-primary)", cursor: "pointer", background: "none", border: "none", fontWeight: 500 }}>+1 hr</button>
                <button type="button" onClick={() => handleQuickAdd(2)} style={{ fontSize: 12, color: "var(--fc-primary)", cursor: "pointer", background: "none", border: "none", fontWeight: 500 }}>+2 hrs</button>
                <button type="button" onClick={() => handleQuickAdd(4)} style={{ fontSize: 12, color: "var(--fc-primary)", cursor: "pointer", background: "none", border: "none", fontWeight: 500 }}>+4 hrs</button>
              </div>
            </div>

            {/* Pickup Notes */}
            <div>
              <label className="fc-label">Special Pickup Notes (Optional)</label>
              <textarea
                className="fc-input"
                placeholder="e.g., Ask for Sarah at the kitchen back door."
                rows={3}
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                style={{ resize: "none" }}
              />
            </div>
          </form>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--fc-border-light)", background: "var(--fc-bg)", borderBottomLeftRadius: "var(--fc-radius-md)", borderBottomRightRadius: "var(--fc-radius-md)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button type="button" onClick={closeModal} className="fc-btn-secondary">
            Cancel
          </button>
          <button type="submit" form="donation-form" disabled={loading} className="fc-btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Posting...</> : <><Send size={16} /> Post Donation</>}
          </button>
        </div>
      </div>
    </div>
  );
}
