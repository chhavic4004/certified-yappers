const FLAVOR_BASE_URL = "http://cosylab.iiitd.edu.in:6969/flavordb";
const FLAVOR_API_KEY = "EakuMCplIpn3LWZuhhD9hN5PPZo4xaQ_EOAlgLS3bU8Fez7_";

const headers = {
  Authorization: `Bearer ${FLAVOR_API_KEY}`,
  ApiKey: FLAVOR_API_KEY,
  "Content-Type": "application/json",
};

export async function getFlavorPairings(ingredient: string) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `${FLAVOR_BASE_URL}/foodpairing/ingredient/${encodeURIComponent(ingredient)}`,
      { headers, signal: controller.signal },
    );

    if (!res.ok) {
      return { pairs_with: [] as string[] };
    }

    return res.json();
  } catch {
    return { pairs_with: [] as string[] };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function getFlavorProfile(profile: string) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `${FLAVOR_BASE_URL}/molecules/flavor-profile/${encodeURIComponent(profile)}`,
      { headers, signal: controller.signal },
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
