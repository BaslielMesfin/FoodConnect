"use client";

import { useState } from "react";
import { updateUserProfile } from "@/app/actions/user";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function SettingsForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateUserProfile(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(true);
      // Automatically clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }
    
    setLoading(false);
  }

  return (
    <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "var(--fc-radius-sm)", background: "var(--fc-danger-light)", color: "var(--fc-danger)", fontSize: 13, border: "1px solid #FFCDD2" }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: "12px 16px", borderRadius: "var(--fc-radius-sm)", background: "var(--fc-primary-light)", color: "var(--fc-primary-dark)", fontSize: 13, border: "1px solid var(--fc-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} />
          Profile updated successfully!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="fc-label" htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            defaultValue={user.name || ""}
            className="fc-input"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="fc-label" htmlFor="organization">Organization Name</label>
          <input
            id="organization"
            name="organization"
            defaultValue={user.organization || ""}
            className="fc-input"
            placeholder="e.g. Grand Hotel Addis"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label className="fc-label" htmlFor="email">Email Address <span style={{ textTransform: "none", color: "var(--fc-text-muted)", fontWeight: "normal" }}>(Read-only)</span></label>
          <input
            id="email"
            defaultValue={user.email}
            className="fc-input"
            disabled
            style={{ background: "var(--fc-bg)", color: "var(--fc-text-secondary)", cursor: "not-allowed" }}
          />
        </div>
        <div>
          <label className="fc-label" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={user.phone || ""}
            className="fc-input"
            placeholder="+251 911 234 567"
          />
        </div>
      </div>

      <div>
        <label className="fc-label" htmlFor="address">Physical Address</label>
        <textarea
          id="address"
          name="address"
          defaultValue={user.address || ""}
          className="fc-input"
          placeholder="Enter your physical location or descriptive directions..."
          rows={3}
          style={{ resize: "vertical" }}
        />
        <div style={{ fontSize: 12, color: "var(--fc-text-muted)", marginTop: 6 }}>
          This address will be visible to drivers when they are dispatched to pick up your donations.
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button 
          type="submit" 
          className="fc-btn-primary" 
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 32px" }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </form>
  );
}
