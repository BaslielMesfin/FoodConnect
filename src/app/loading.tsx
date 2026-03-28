import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--fc-bg)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Loader2 size={40} className="animate-spin" color="var(--fc-primary)" />
        <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "var(--fc-font-heading)", color: "var(--fc-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Loading FoodConnect...
        </div>
      </div>
    </div>
  );
}
