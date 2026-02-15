import { BACKEND_URL } from "@/services/api";

<<<<<<< HEAD
// Uses deployed backend proxy - no direct external calls, works in production
const FLAVOR_BASE = `${BACKEND_URL}/api/flavor`;

export async function getFlavorPairings(ingredient: string) {
  const res = await fetch(
    `${FLAVOR_BASE}/foodpairing/ingredient/${encodeURIComponent(ingredient)}`
=======
export async function getFlavorPairings(ingredient: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/flavor/pairings/${encodeURIComponent(ingredient)}`
>>>>>>> origin/main
  );

  if (!res.ok) {
    throw new Error("FlavorDB pairing fetch failed");
  }

  return res.json();
}

export async function getFlavorProfile(profile: string) {
  const res = await fetch(
<<<<<<< HEAD
    `${FLAVOR_BASE}/molecules/flavor-profile/${encodeURIComponent(profile)}`
=======
    `${BACKEND_URL}/api/flavor/profile/${encodeURIComponent(profile)}`
>>>>>>> origin/main
  );

  if (!res.ok) {
    throw new Error("Flavor profile fetch failed");
  }

  return res.json();
}
