const FLAVOR_BASE_URL = "http://192.168.1.92:6969/flavordb";
const FLAVOR_API_KEY = "EakuMCplIpn3LWZuhhD9hN5PPZo4xaQ_EOAlgLS3bU8Fez7_";

const headers = {
  Authorization: `Bearer ${FLAVOR_API_KEY}`,
  "Content-Type": "application/json",
};

export async function getFlavorPairings(ingredient: string) {
  const res = await fetch(
    `${FLAVOR_BASE_URL}/foodpairing/ingredient/${ingredient}`,
    { headers }
  );

  if (!res.ok) {
    throw new Error("FlavorDB pairing fetch failed");
  }

  return res.json();
}

export async function getFlavorProfile(profile: string) {
  const res = await fetch(
    `${FLAVOR_BASE_URL}/molecules/flavor-profile/${profile}`,
    { headers }
  );

  if (!res.ok) {
    throw new Error("Flavor profile fetch failed");
  }

  return res.json();
}
