import type { ExpiryType } from "@/backend";

// Re-export backend types for convenience
export type { ExpiryType, Movie, PinCode } from "@/backend";

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const DEVICE_TOKEN_KEY = "drama_device_token";
const ADMIN_TOKEN_KEY = "drama_admin_token";

// ─── Device Token (localStorage) ─────────────────────────────────────────────

export function setDeviceToken(token: string): void {
  localStorage.setItem(DEVICE_TOKEN_KEY, token);
}

export function getDeviceToken(): string | null {
  return localStorage.getItem(DEVICE_TOKEN_KEY);
}

export function clearDeviceAuth(): void {
  localStorage.removeItem(DEVICE_TOKEN_KEY);
}

export function isDeviceAuthenticated(): boolean {
  return !!localStorage.getItem(DEVICE_TOKEN_KEY);
}

// ─── Admin Session (sessionStorage) ──────────────────────────────────────────

export function setAdminSession(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function getAdminSession(): string {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}

export function isAdminAuthenticated(): boolean {
  return !!sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

// ─── Expiry Helpers ───────────────────────────────────────────────────────────

export function expiryLabel(type: ExpiryType): string {
  switch (type) {
    case "twentyMinutes":
      return "20 минут";
    case "thirtyDays":
      return "30 хоног";
    case "ninetyDays":
      return "90 хоног";
    case "unlimited":
      return "Хугацаагүй";
    default:
      return String(type);
  }
}

export function formatExpiry(ts: bigint): string {
  if (ts === -1n) return "Хугацаагүй";
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
