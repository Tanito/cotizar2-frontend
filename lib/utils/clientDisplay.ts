import { normalizeText } from "./normalizeText";

const AVATAR_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#0F172A",
  "#16A34A",
  "#EA580C",
  "#DB2777",
  "#0EA5E9",
] as const;

export function getClientInitials(name: string): string {
  const parts = normalizeText(name)
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
}

export function getClientColor(name: string): string {
  if (!name.trim()) {
    return AVATAR_COLORS[0];
  }

  const hash = normalizeText(name).split("").reduce((sum, char) => {
    return (sum + char.charCodeAt(0)) % AVATAR_COLORS.length;
  }, 0);

  return AVATAR_COLORS[hash];
}

