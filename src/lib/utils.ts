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

export function getUrgencyLevel(expiresAt: Date): "green" | "yellow" | "red" {
  const { total } = getTimeRemaining(expiresAt);
  const hoursLeft = total / (1000 * 60 * 60);
  if (hoursLeft > 4) return "green";
  if (hoursLeft > 1) return "yellow";
  return "red";
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tons`;
  return `${kg} kg`;
}
