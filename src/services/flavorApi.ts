import { BACKEND_URL } from "@/services/api";

// Uses deployed backend proxy - no direct external calls, works in production
const FLAVOR_BASE = `${BACKEND_URL}/api/flavor`;

export async function getFlavorPairings(ingredient: string) {
  const res = await fetch(
    `${FLAVOR_BASE}/foodpairing/ingredient/${encodeURIComponent(ingredient)}`
  );

  if (!res.ok) {
    throw new Error("FlavorDB pairing fetch failed");
  }

  return res.json();
}

export async function getFlavorProfile(profile: string) {
  const res = await fetch(
    `${FLAVOR_BASE}/molecules/flavor-profile/${encodeURIComponent(profile)}`
  );

  if (!res.ok) {
    throw new Error("Flavor profile fetch failed");
  }

  return res.json();
}
