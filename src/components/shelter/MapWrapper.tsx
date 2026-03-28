"use client";

import dynamic from "next/dynamic";

const DynamicLiveMap = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", width: "100%", background: "var(--fc-surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fc-text-secondary)" }}>
      Loading Live Map...
    </div>
  ),
});

export default function MapWrapper({ donations }: any) {
  return <DynamicLiveMap donations={donations} />;
}
