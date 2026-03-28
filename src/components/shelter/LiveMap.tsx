"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { claimDonation } from "@/app/actions/donation";

// Fix for default Leaflet icons in Next.js
// We'll use a custom DivIcon that looks like a clean marker pin without needing image assets.
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const defaultIcon = createCustomIcon("var(--fc-primary)");
const urgentIcon = createCustomIcon("var(--fc-danger)");

interface MapProps {
  donations: Array<{
    id: string;
    foodDescription: string;
    weightKg: number;
    expiresAt: Date;
    lat: number;
    lng: number;
  }>;
}

// Addis Ababa default center
const CENTER: [number, number] = [9.032, 38.748];

export default function LiveMap({ donations }: MapProps) {
  const [claiming, setClaiming] = useState<string | null>(null);

  const handleClaim = async (id: string) => {
    setClaiming(id);
    const result = await claimDonation(id);
    setClaiming(null);
    if (result.error) {
      alert(result.error);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", borderRadius: "var(--fc-radius-md)", overflow: "hidden", border: "1px solid var(--fc-border)" }}>
      <MapContainer center={CENTER} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {donations.map((donation: any) => {
          const hoursLeft = (new Date(donation.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60);
          const icon = hoursLeft < 2 ? urgentIcon : defaultIcon;

          return (
            <Marker
              key={donation.id}
              position={[donation.lat, donation.lng]}
              icon={icon}
            >
              <Popup>
                <div style={{ padding: "4px 0", minWidth: 200, fontFamily: "var(--fc-font-body)" }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: 16 }}>{donation.foodDescription}</h3>
                  <div style={{ fontSize: 13, color: "var(--fc-text-secondary)", marginBottom: 12 }}>
                    <strong>{donation.weightKg} KG</strong> • Expires in {Math.max(0, Math.floor(hoursLeft))}h
                  </div>
                  
                  <button
                    onClick={() => handleClaim(donation.id)}
                    disabled={claiming === donation.id}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "var(--fc-primary)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--fc-radius-sm)",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {claiming === donation.id ? "Claiming..." : "Claim Donation"}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
