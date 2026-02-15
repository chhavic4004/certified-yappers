import { BACKEND_URL } from "@/services/api";

export async function getFlavorPairings(ingredient: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/flavor/pairings/${encodeURIComponent(ingredient)}`
  );

  if (!res.ok) {
    throw new Error("FlavorDB pairing fetch failed");
  }

  return res.json();
}

export async function getFlavorProfile(profile: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/flavor/profile/${encodeURIComponent(profile)}`
  );

  if (!res.ok) {
    throw new Error("Flavor profile fetch failed");
  }

  return res.json();
}
