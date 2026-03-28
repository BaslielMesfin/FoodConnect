"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--fc-bg)",
      padding: 24,
      textAlign: "center"
    }}>
      <div className="fc-card animate-scale-in" style={{ padding: 48, maxWidth: 400, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "var(--fc-warning-light)", color: "var(--fc-warning)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <AlertTriangle size={32} />
          </div>
        </div>
        
        <h1 style={{ fontSize: 24, marginBottom: 12, fontFamily: "var(--fc-font-heading)", color: "var(--fc-text)" }}>
          Page Not Found
        </h1>
        
        <p style={{ color: "var(--fc-text-secondary)", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
          The link you followed may be broken, or the page may have been removed or expired.
        </p>

        <Link href="/" className="fc-btn-primary" style={{ display: "inline-flex", textDecoration: "none", alignItems: "center", gap: 8, width: "100%", justifyContent: "center" }}>
          <ArrowLeft size={16} /> Look for Food
        </Link>
      </div>
    </div>
  );
}
