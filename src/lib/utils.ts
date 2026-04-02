import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function generateMagicToken(): string {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
}

export function getTimeRemaining(expiresAt: Date): {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  expired: boolean;
} {
  const total = new Date(expiresAt).getTime() - Date.now();
  const expired = total <= 0;
  return {
    total: Math.max(0, total),
    hours: expired ? 0 : Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: expired ? 0 : Math.floor((total / (1000 * 60)) % 60),
    seconds: expired ? 0 : Math.floor((total / 1000) % 60),
    expired,
  };
}

export function getUrgencyColor(expiresAt: Date): string {
  const { total } = getTimeRemaining(expiresAt);
  const maxTime = 24 * 60 * 60 * 1000; // 24 hours in ms
  const percentage = Math.min(1, total / maxTime);
  
  // HSL: 120 is green, 0 is red
  const hue = percentage * 120;
  return `hsl(${hue}, 80%, 45%)`;
}

export function getUrgencyLevel(expiresAt: Date): "green" | "yellow" | "red" {
  const { total } = getTimeRemaining(expiresAt);
  const hoursLeft = total / (1000 * 60 * 60);
  if (hoursLeft > 12) return "green";
  if (hoursLeft > 4) return "yellow";
  return "red";
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tons`;
  return `${kg} kg`;
}

export function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";
  
  const lastSegment = segments[segments.length - 1];
  
  const titles: Record<string, string> = {
    donor: "Donor Dashboard",
    shelter: "Shelter Dashboard",
    analytics: "Impact Analytics",
    history: "Activity History",
    dispatch: "Active Dispatch",
    partners: "Partner Network",
    settings: "Account Settings",
  };

  return titles[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}

