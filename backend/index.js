import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = process.env.RECIPE_API_BASE_URL || "https://api.foodoscope.com";
const API_KEY = process.env.RECIPE_API_KEY || "Bearer gV1LSac1moHdP1dKVfLYlxeWjRK-v-Oix12yZB4klVc28mk1";
const FLAVOR_BASE_URL = process.env.FLAVOR_API_BASE_URL || "http://192.168.1.92:6969/flavordb";
const FLAVOR_API_KEY = process.env.FLAVOR_API_KEY || "Bearer EakuMCplIpn3LWZuhhD9hN5PPZo4xaQ_EOAlgLS3bU8Fez7_";

// Helper function to fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
};

const FALLBACK_MEALS = [
  { 
    Recipe_title: "Butter Chicken", 
    Calories: 420, 
    "Protein (g)": 32, 
    Region: "Indian", 
    reasons: ["Popular Indian classic"],
    img_url: "https://source.unsplash.com/400x300/?butter-chicken,indian-food",
    ingredients: [
      { name: "chicken breast" },
      { name: "butter" },
      { name: "tomato puree" },
      { name: "cream" },
      { name: "garam masala" },
      { name: "garlic" },
      { name: "ginger" }
    ],
    instructions: "Marinate chicken||Cook in butter||Add tomato sauce||Simmer with cream||Garnish and serve"
  },
  { 
    Recipe_title: "Chana Masala", 
    Calories: 360, 
    "Protein (g)": 18, 
    Region: "Indian", 
    reasons: ["Vegetarian protein"],
    img_url: "https://source.unsplash.com/400x300/?chana-masala,chickpeas",
    ingredients: [
      { name: "chickpeas" },
      { name: "onions" },
      { name: "tomatoes" },
      { name: "garlic" },
      { name: "ginger" },
      { name: "cumin" },
      { name: "coriander" }
    ],
    instructions: "Sauté onions and spices||Add tomatoes and chickpeas||Simmer until thick||Garnish with cilantro"
  },
  { 
    Recipe_title: "Palak Paneer", 
    Calories: 390, 
    "Protein (g)": 20, 
    Region: "Indian", 
    reasons: ["Green leafy goodness"],
    img_url: "https://source.unsplash.com/400x300/?palak-paneer,spinach-curry",
    ingredients: [
      { name: "spinach" },
      { name: "paneer" },
      { name: "onions" },
      { name: "tomatoes" },
      { name: "cream" },
      { name: "garam masala" }
    ],
    instructions: "Blanch spinach||Make onion-tomato base||Blend spinach||Add paneer cubes||Finish with cream"
  },
  { 
    Recipe_title: "Rajma", 
    Calories: 340, 
    "Protein (g)": 16, 
    Region: "Indian", 
    reasons: ["Bean-based protein"],
    img_url: "https://source.unsplash.com/400x300/?rajma,kidney-beans",
    ingredients: [
      { name: "kidney beans" },
      { name: "onions" },
      { name: "tomatoes" },
      { name: "ginger-garlic paste" },
      { name: "cumin" },
      { name: "garam masala" }
    ],
    instructions: "Soak and cook beans||Make masala base||Add beans and simmer||Garnish with cilantro"
  },
  { 
    Recipe_title: "Aloo Palak", 
    Calories: 280, 
    "Protein (g)": 7, 
    Region: "Indian", 
    reasons: ["Light vegetable dish"],
    img_url: "https://source.unsplash.com/400x300/?spinach,potato-curry",
    ingredients: [
      { name: "potatoes" },
      { name: "spinach" },
      { name: "onions" },
      { name: "tomatoes" },
      { name: "cumin seeds" },
      { name: "turmeric" }
    ],
    instructions: "Sauté potatoes||Add spinach||Cook with spices||Simmer until done"
  },
  { 
    Recipe_title: "Vegetable Korma", 
    Calories: 310, 
    "Protein (g)": 9, 
    Region: "Indian", 
    reasons: ["Creamy curry"],
    img_url: "https://source.unsplash.com/400x300/?korma,vegetable-curry",
    ingredients: [
      { name: "mixed vegetables" },
      { name: "coconut milk" },
      { name: "cashew paste" },
      { name: "onions" },
      { name: "garam masala" },
      { name: "coriander" }
    ],
    instructions: "Prepare vegetable mix||Make cashew-coconut sauce||Combine and simmer||Garnish with nuts"
  },
  { 
    Recipe_title: "Chicken Tikka Masala", 
    Calories: 460, 
    "Protein (g)": 35, 
    Region: "Indian", 
    reasons: ["High protein classic"],
    img_url: "https://source.unsplash.com/400x300/?tikka-masala,chicken-curry",
    ingredients: [
      { name: "chicken" },
      { name: "yogurt" },
      { name: "tikka masala" },
      { name: "tomatoes" },
      { name: "cream" },
      { name: "bell peppers" }
    ],
    instructions: "Marinate chicken in yogurt||Grill or bake||Make masala sauce||Combine and simmer"
  },
  { 
    Recipe_title: "Matar Paneer", 
    Calories: 370, 
    "Protein (g)": 19, 
    Region: "Indian", 
    reasons: ["Peas and paneer combo"],
    img_url: "https://source.unsplash.com/400x300/?matar-paneer,peas-curry",
    ingredients: [
      { name: "green peas" },
      { name: "paneer" },
      { name: "onions" },
      { name: "tomatoes" },
      { name: "garam masala" },
      { name: "kasuri methi" }
    ],
    instructions: "Sauté onion-tomato base||Add peas and paneer||Simmer with spices||Finish with kasuri methi"
  },
  { 
    Recipe_title: "Dal Tadka", 
    Calories: 260, 
    "Protein (g)": 14, 
    Region: "Indian", 
    reasons: ["Lentil delight"],
    img_url: "https://source.unsplash.com/400x300/?dal,lentils",
    ingredients: [
      { name: "yellow lentils" },
      { name: "ghee" },
      { name: "cumin seeds" },
      { name: "garlic" },
      { name: "green chilies" },
      { name: "turmeric" }
    ],
    instructions: "Cook lentils||Prepare tadka with ghee and spices||Pour over dal||Mix and serve"
  },
  { 
    Recipe_title: "Fish Curry", 
    Calories: 330, 
    "Protein (g)": 28, 
    Region: "Indian", 
    reasons: ["Seafood protein"],
    img_url: "https://source.unsplash.com/400x300/?fish-curry,seafood",
    ingredients: [
      { name: "fish fillets" },
      { name: "coconut milk" },
      { name: "curry leaves" },
      { name: "mustard seeds" },
      { name: "tamarind" },
      { name: "turmeric" }
    ],
    instructions: "Marinate fish||Make coconut curry base||Add fish gently||Simmer until cooked"
  },
  { 
    Recipe_title: "Vegetable Biryani", 
    Calories: 410, 
    "Protein (g)": 12, 
    Region: "Indian", 
    reasons: ["Aromatic rice dish"],
    img_url: "https://source.unsplash.com/400x300/?biryani,rice",
    ingredients: [
      { name: "basmati rice" },
      { name: "mixed vegetables" },
      { name: "fried onions" },
      { name: "yogurt" },
      { name: "biryani masala" },
      { name: "saffron" }
    ],
    instructions: "Cook rice halfway||Layer with vegetables||Add saffron milk||Dum cook until done"
  },
  { 
    Recipe_title: "Chicken Saag", 
    Calories: 400, 
    "Protein (g)": 30, 
    Region: "Indian", 
    reasons: ["Spinach-chicken combo"],
    ingredients: [
      { name: "chicken" },
      { name: "spinach" },
      { name: "onions" },
      { name: "tomatoes" },
      { name: "cream" },
      { name: "garam masala" }
    ],
    instructions: "Cook chicken||Blanch and blend spinach||Make creamy saag||Add chicken and simmer"
  },
];

function extractList(json) {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.payload?.data)) return json.payload.data;
  if (Array.isArray(json.results)) return json.results;
  if (Array.isArray(json.items)) return json.items;
  return [];
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]+/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getNumberFrom(record, keys) {
  for (const key of keys) {
    const val = record?.[key];
    const parsed = toNumber(val);
    if (parsed != null) return parsed;
  }
  return null;
}

function applyPreferenceDefaults({ goals, diet, health, caloriesMin, caloriesMax, proteinMin, proteinMax }) {
  let calMin = caloriesMin;
  let calMax = caloriesMax;
  let protMin = proteinMin;
  let protMax = proteinMax;

  const goalList = Array.isArray(goals) ? goals : [];
  const dietList = Array.isArray(diet) ? diet : [];
  const healthList = Array.isArray(health) ? health : [];

  if (goalList.includes("Lose Weight") && calMax == null) calMax = 450;
  if (goalList.includes("Gain Muscle") && protMin == null) protMin = 25;
  if (goalList.includes("Boost Energy") && calMin == null) calMin = 300;
  if (goalList.includes("Eat Clean") && calMax == null) calMax = 600;

  if (dietList.includes("High Protein") && protMin == null) protMin = 30;
  if (dietList.includes("Low Carb") && calMax == null) calMax = 400;

  if (healthList.includes("Diabetes") && calMax == null) calMax = 400;
  if (healthList.includes("Hypertension") && calMax == null) calMax = 450;
  if (healthList.includes("Cholesterol") && calMax == null) calMax = 450;
  if (healthList.includes("Heart Health") && calMax == null) calMax = 450;
  if (healthList.includes("PCOS") && calMax == null) calMax = 450;
  if (healthList.includes("Thyroid") && calMax == null) calMax = 500;

  return { calMin, calMax, protMin, protMax };
}

function mapCuisineRegion(region) {
  const map = {
    Indian: "Indian",
    Asian: "Asian",
    Mediterranean: "Mediterranean",
    Mexican: "Mexican",
    Italian: "Italian",
    Continental: "European",
  };
  return map[region] || region;
}

function normalizeDiet(diet) {
  if (!diet) return null;
  const key = String(diet).trim().toLowerCase();
  const map = {
    vegan: "vegan",
    vegetarian: "ovo_lacto_vegetarian",
    "ovo vegetarian": "ovo_vegetarian",
    "lacto vegetarian": "lacto_vegetarian",
    "ovo lacto vegetarian": "ovo_lacto_vegetarian",
    pescetarian: "pescetarian",
  };
  const normalized = map[key] || key.replace(/\s+/g, "_");
  const allowed = new Set([
    "vegan",
    "pescetarian",
    "ovo_vegetarian",
    "lacto_vegetarian",
    "ovo_lacto_vegetarian",
  ]);
  return allowed.has(normalized) ? normalized : null;
}

// 🔥 MAIN ENDPOINT
app.post("/api/meals", async (req, res) => {
  try {
    const {
      cuisine,
      diet,
      caloriesMin,
      caloriesMax,
      proteinMin,
      proteinMax,
      goals,
      health,
      allergies,
    } = req.body;
    function inferFromGoals(gs, calMin, calMax, protMin, protMax) {
      let a = calMin, b = calMax, c = protMin, d = protMax;
      if (Array.isArray(gs) && gs.length) {
        if (gs.includes("Lose Weight")) {
          if (a == null) a = 200;
          if (b == null) b = 450;
        }
        if (gs.includes("Gain Muscle")) {
          if (c == null) c = 25;
          if (d == null) d = 45;
        }
      }
      return { a, b, c, d };
    }
    const inferred = inferFromGoals(goals, caloriesMin, caloriesMax, proteinMin, proteinMax);
    const defaults = applyPreferenceDefaults({
      goals,
      diet,
      health,
      caloriesMin: inferred.a,
      caloriesMax: inferred.b,
      proteinMin: inferred.c,
      proteinMax: inferred.d,
    });
    const useCaloriesMin = defaults.calMin;
    const useCaloriesMax = defaults.calMax;
    const useProteinMin = defaults.protMin;
    const useProteinMax = defaults.protMax;

    async function fetchCuisine(region) {
      try {
        const r = mapCuisineRegion(region);
        const field = "total_time";
        const min = 0;
        const max = 259260;
        const continent = r === "Indian" ? "Asian" : "";
        const subRegion = r === "Indian" ? "Indian" : "";
        const url = `${BASE_URL}/recipe2-api/recipes_cuisine/cuisine/${encodeURIComponent(
          r === "Indian" ? "Indian Subcontinent" : r
        )}?field=${encodeURIComponent(field)}&min=${encodeURIComponent(
          min
        )}&max=${encodeURIComponent(max)}&continent=${encodeURIComponent(
          continent
        )}&subRegion=${encodeURIComponent(subRegion)}&page=1&page_size=12`;
        const response = await fetchWithTimeout(url, {
          headers: {
            Authorization: API_KEY,
            "Content-Type": "application/json",
          },
        }, 8000);
        if (!response.ok) {
          const text = await response.text();
          return { ok: false, status: response.status, text };
        }
        const json = await response.json();
        return { ok: true, json };
      } catch (err) {
        console.error("fetchCuisine error:", err.message);
        return { ok: false, error: err.message };
      }
    }

    async function fetchCalories(min, max) {
      try {
        const url = `${BASE_URL}/recipe2-api/recipes-calories/calories?minCalories=${encodeURIComponent(
          min ?? 0
        )}&maxCalories=${encodeURIComponent(max ?? 1000000)}&limit=12`;
        const response = await fetchWithTimeout(url, {
          headers: {
            Authorization: API_KEY,
            "Content-Type": "application/json",
          },
        }, 8000);
        if (!response.ok) {
          const text = await response.text();
          return { ok: false, status: response.status, text };
        }
        const json = await response.json();
        return { ok: true, json };
      } catch (err) {
        console.error("fetchCalories error:", err.message);
        return { ok: false, error: err.message };
      }
    }

    async function fetchProtein(min, max) {
      try {
        const url = `${BASE_URL}/recipe2-api/protein/protein-range?min=${encodeURIComponent(
          min ?? 0
        )}&max=${encodeURIComponent(max ?? 1000)}&page=1&limit=12`;
        const response = await fetchWithTimeout(url, {
          headers: {
            Authorization: API_KEY,
            "Content-Type": "application/json",
          },
        }, 8000);
        if (!response.ok) {
          const text = await response.text();
          return { ok: false, status: response.status, text };
        }
        const json = await response.json();
        return { ok: true, json };
      } catch (err) {
        console.error("fetchProtein error:", err.message);
        return { ok: false, error: err.message };
      }
    }

    async function fetchDiet(d, region) {
      try {
        const apiDiet = normalizeDiet(d);
        if (!apiDiet) return { ok: true, json: { data: [] } };

        const regionValue = region
          ? mapCuisineRegion(region) === "Indian"
            ? "Indian Subcontinent"
            : mapCuisineRegion(region)
          : null;

        const buildUrl = (useRegion) =>
          useRegion && regionValue
            ? `${BASE_URL}/recipe2-api/recipe/region-diet/region-diet?region=${encodeURIComponent(
                regionValue
              )}&diet=${encodeURIComponent(apiDiet)}&limit=12`
            : `${BASE_URL}/recipe2-api/recipe-diet/recipe-diet?diet=${encodeURIComponent(
                apiDiet
              )}&limit=12`;

        const tryFetch = async (useRegion) => {
          try {
            const url = buildUrl(useRegion);
            const response = await fetchWithTimeout(url, {
              headers: {
                Authorization: API_KEY,
                "Content-Type": "application/json",
              },
            }, 8000);
            if (!response.ok) {
              const text = await response.text();
              return { ok: false, status: response.status, text };
            }
            const json = await response.json();
            return { ok: true, json };
          } catch (err) {
            console.error("fetchDiet error:", err.message);
            return { ok: false, error: err.message };
          }
        };

        const regionResp = regionValue ? await tryFetch(true) : null;
        if (regionResp?.ok && extractList(regionResp.json).length > 0) {
          return regionResp;
        }
        return tryFetch(false);
      } catch (err) {
        console.error("fetchDiet outer error:", err.message);
        return { ok: false, error: err.message };
      }
    }

    async function generateMealsWithLLM({ cuisine, diet, caloriesMin, caloriesMax, proteinMin, proteinMax }) {
      const groqKey = process.env.GROQ_API_KEY;
      const openaiKey = process.env.OPENAI_API_KEY;
      const useGroq = !!groqKey;
      const key = useGroq ? groqKey : openaiKey;
      if (!key) return [];
      const url = useGroq
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      const model =
        process.env.LLM_MODEL ||
        (useGroq ? "llama-3.3-70b-versatile" : process.env.OPENAI_MODEL || "gpt-4o-mini");
      const user = [
        `Cuisine: ${cuisine || "any"}`,
        `Diet: ${diet || "any"}`,
        `Calories: ${caloriesMin ?? ""}-${caloriesMax ?? ""}`,
        `Protein: ${proteinMin ?? ""}-${proteinMax ?? ""}`,
        `Return 10 meals strictly as JSON with shape {"meals":[{"name":string,"calories":number|null,"protein":number|null,"region":string}]}. No extra text.`,
      ].join("\n");
      const r = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          messages: [
            { role: "system", content: "You produce compact JSON only." },
            { role: "user", content: user },
          ],
        }),
      });
      if (!r.ok) return [];
      const j = await r.json();
      let content = j?.choices?.[0]?.message?.content || "";
      if (!content) return [];
      content = content.trim();
      if (content.startsWith("```")) {
        const m = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (m) content = m[1].trim();
      }
      try {
        const parsed = JSON.parse(content);
        const arr = Array.isArray(parsed?.meals) ? parsed.meals : [];
        return arr
          .filter((x) => x && typeof x === "object")
          .map((x) => ({
            id: null,
            name: String(x.name || "Untitled"),
            calories: x.calories == null ? null : Number(x.calories),
            protein: x.protein == null ? null : Number(x.protein),
            region: String(x.region || cuisine || "Unknown"),
          }))
          .slice(0, 12);
      } catch {
        return [];
      }
    }

    const [cuisineResp, calsResp, protResp, dietResp] = await Promise.all([
      cuisine ? fetchCuisine(cuisine) : Promise.resolve({ ok: true, json: { data: [] } }),
      useCaloriesMin != null || useCaloriesMax != null
        ? fetchCalories(useCaloriesMin, useCaloriesMax)
        : Promise.resolve({ ok: true, json: { data: [] } }),
      useProteinMin != null || useProteinMax != null
        ? fetchProtein(useProteinMin, useProteinMax)
        : Promise.resolve({ ok: true, json: { data: [] } }),
      fetchDiet(diet, cuisine),
    ]);

    if (cuisine && !cuisineResp.ok) {
      console.error("Cuisine fetch failed", cuisineResp?.status, cuisineResp?.text);
    }

    const cuisineList = cuisineResp.ok ? extractList(cuisineResp.json) : [];
    const calsList = calsResp.ok ? extractList(calsResp.json) : [];
    const protList = protResp.ok ? extractList(protResp.json) : [];
    const dietList = dietResp.ok ? extractList(dietResp.json) : [];

    function byId(list) {
      const m = new Map();
      for (const r of list || []) {
        const id = r?.Recipe_id ?? r?._id ?? r?.id ?? Math.random().toString(36).slice(2);
        if (!m.has(id)) m.set(id, r);
      }
      return m;
    }

    const base =
      (diet && dietList.length > 0)
        ? dietList
        : cuisineList.length > 0
        ? cuisineList
        : dietList.length > 0
        ? dietList
        : calsList.length > 0
        ? calsList
        : protList;

    let merged = base;

    // 🔥 ENRICH diet results with cuisine details (images, ingredients)
    if (diet && dietList.length > 0 && cuisineList.length > 0) {
      const cuisineMapById = new Map();
      const cuisineMapByTitle = new Map();
      for (const c of cuisineList) {
        const id = c?._id || c?.Recipe_id;
        const title = String(c?.Recipe_title ?? c?.name ?? "").toLowerCase().trim();
        if (id) cuisineMapById.set(id, c);
        if (title) cuisineMapByTitle.set(title, c);
      }
      
      merged = merged.map((d) => {
        let cuisineMatch = null;
        
        // Try matching by ID first
        const dId = d?._id || d?.Recipe_id;
        if (dId && cuisineMapById.has(dId)) {
          cuisineMatch = cuisineMapById.get(dId);
        }
        
        // Fall back to matching by title
        if (!cuisineMatch) {
          const dTitle = String(d?.Recipe_title ?? d?.name ?? "").toLowerCase().trim();
          if (dTitle && cuisineMapByTitle.has(dTitle)) {
            cuisineMatch = cuisineMapByTitle.get(dTitle);
          }
        }
        
        if (cuisineMatch) {
          return {
            ...d,
            img_url: d.img_url || cuisineMatch.img_url,
            ingredients: (d.ingredients && d.ingredients.length > 0) ? d.ingredients : (cuisineMatch.ingredients || []),
          };
        }
        return d;
      });
    }

    const cuisineIds = new Set(Array.from(byId(cuisineList).keys()));
    if (calsList.length > 0) {
      const calsIds = new Set(Array.from(byId(calsList).keys()));
      merged = merged.filter((r) => calsIds.has(r?.Recipe_id ?? r?._id ?? r?.id));
    }
    if (protList.length > 0) {
      const protIds = new Set(Array.from(byId(protList).keys()));
      merged = merged.filter((r) => protIds.has(r?.Recipe_id ?? r?._id ?? r?.id));
    }
    if (dietList.length > 0 && merged.length > 0) {
      const dietIds = new Set(Array.from(byId(dietList).keys()));
      merged = merged.filter((r) => dietIds.has(r?.Recipe_id ?? r?._id ?? r?.id));
    }

    if (merged.length === 0) {
      const union = [...cuisineList, ...dietList, ...calsList, ...protList];
      merged = union.slice(0, 12);
    }

    if (merged.length === 0) {
      const llmMeals = await generateMealsWithLLM({
        cuisine,
        diet,
        caloriesMin: useCaloriesMin,
        caloriesMax: useCaloriesMax,
        proteinMin: useProteinMin,
        proteinMax: useProteinMax,
      });
      if (Array.isArray(llmMeals) && llmMeals.length > 0) {
        const transformedLlmMeals = llmMeals.map((m) => ({
          Recipe_title: m.Recipe_title || m.name,
          Calories: m.Calories || m.calories,
          "Protein (g)": m["Protein (g)"] || m.protein,
          Region: m.Region || m.region || cuisine,
          reasons: m.reasons || [],
        }));
        return res.json({ meals: transformedLlmMeals });
      }
      const fallback = FALLBACK_MEALS.filter((m) => {
        if (cuisine && m.Region && m.Region !== cuisine) return false;
        if (typeof useCaloriesMin === "number" && m.Calories < useCaloriesMin) return false;
        if (typeof useCaloriesMax === "number" && m.Calories > useCaloriesMax) return false;
        if (typeof useProteinMin === "number" && m["Protein (g)"] < useProteinMin) return false;
        if (typeof useProteinMax === "number" && m["Protein (g)"] > useProteinMax) return false;
        return true;
      }).slice(0, 12);
      return res.json({ meals: fallback.length ? fallback : FALLBACK_MEALS.slice(0, 12) });
    }

    if (typeof useCaloriesMin === "number" || typeof useCaloriesMax === "number") {
      merged = merged.filter((r) => {
        const v = getNumberFrom(r, [
          "calories",
          "Calories",
          "Energy (kcal)",
          "Energy (kcal)",
        ]);
        if (v == null) return true;
        if (typeof useCaloriesMin === "number" && v < useCaloriesMin) return false;
        if (typeof useCaloriesMax === "number" && v > useCaloriesMax) return false;
        return true;
      });
    }
    if (typeof useProteinMin === "number" || typeof useProteinMax === "number") {
      merged = merged.filter((r) => {
        const v = getNumberFrom(r, [
          "protein",
          "Protein",
          "Protein (g)",
          "Adjusted Protein (g)",
        ]);
        if (v == null) return true;
        if (typeof useProteinMin === "number" && v < useProteinMin) return false;
        if (typeof useProteinMax === "number" && v > useProteinMax) return false;
        return true;
      });
    }

    const allergyTokens = typeof allergies === "string"
      ? allergies
          .split(/[,;/]+/)
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      : [];
    if (allergyTokens.length > 0) {
      merged = merged.filter((r) => {
        const title = String(r?.Recipe_title ?? r?.name ?? r?.title ?? "").toLowerCase();
        const region = String(r?.Region ?? r?.region ?? "").toLowerCase();
        const subRegion = String(r?.Sub_region ?? r?.sub_region ?? "").toLowerCase();
        const hay = `${title} ${region} ${subRegion}`;
        return !allergyTokens.some((token) => hay.includes(token));
      });
    }

    const meals = (merged || []).slice(0, 12).map((r) => {
      const id = r?.Recipe_id ?? r?._id ?? null;
      const calories = getNumberFrom(r, [
        "calories",
        "Calories",
        "Energy (kcal)",
      ]);
      const protein = getNumberFrom(r, [
        "protein",
        "Protein",
        "Protein (g)",
        "Adjusted Protein (g)",
      ]);
      const regionVal = r?.Region ?? r?.region ?? cuisine ?? null;
      const reasons = [];
      if (cuisine && id && cuisineIds.has(id)) {
        reasons.push(`Cuisine match: ${cuisine}`);
      }
      if (diet) {
        reasons.push(`Diet-friendly: ${diet}`);
      }
      if (typeof useCaloriesMin === "number" || typeof useCaloriesMax === "number") {
        const parts = [];
        if (typeof useCaloriesMin === "number") parts.push(`≥${useCaloriesMin} kcal`);
        if (typeof useCaloriesMax === "number") parts.push(`≤${useCaloriesMax} kcal`);
        if (parts.length) reasons.push(`Calories ${parts.join(" & ")}`);
      }
      if (typeof useProteinMin === "number" || typeof useProteinMax === "number") {
        const parts = [];
        if (typeof useProteinMin === "number") parts.push(`≥${useProteinMin}g protein`);
        if (typeof useProteinMax === "number") parts.push(`≤${useProteinMax}g protein`);
        if (parts.length) reasons.push(`Protein ${parts.join(" & ")}`);
      }
      return {
        _id: r?._id || id,
        Recipe_title: r?.Recipe_title ?? r?.name ?? r?.title ?? "Untitled",
        Calories: calories,
        "Energy (kcal)": r?.["Energy (kcal)"] || calories,
        "Protein (g)": protein,
        "Total lipid (fat) (g)": r?.["Total lipid (fat) (g)"] || null,
        "Carbohydrate, by difference (g)": r?.["Carbohydrate, by difference (g)"] || null,
        Region: regionVal,
        img_url: r?.img_url || null,
        ingredients: r?.ingredients || [],
        instructions: r?.instructions || r?.Processes || null,
        vegan: r?.vegan,
        pescetarian: r?.pescetarian,
        ovo_vegetarian: r?.ovo_vegetarian,
        lacto_vegetarian: r?.lacto_vegetarian,
        ovo_lacto_vegetarian: r?.ovo_lacto_vegetarian,
        reasons,
      };
    });

    res.json({ meals });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "RecipeDB failed" });
  }
});

// Image proxy to avoid CORS issues when loading external images (Unsplash etc.)
app.get("/api/image-proxy", async (req, res) => {
  try {
    const url = String(req.query.url || "");
    if (!url || !/^https?:\/\//i.test(url)) {
      return res.status(400).json({ error: "Invalid or missing url parameter" });
    }

    // Only allow common image hosts or image MIME types to reduce abuse
    const allowedHosts = ["unsplash.com", "source.unsplash.com", "images.unsplash.com", "i.imgur.com", "cdn.pixabay.com", "images.pexels.com"];
    try {
      const parsed = new URL(url);
      const hostOk = allowedHosts.some((h) => parsed.hostname.endsWith(h));
      if (!hostOk) {
        // still allow but be conservative: reject unknown hosts to prevent misuse
        return res.status(403).json({ error: "Host not allowed" });
      }
    } catch (e) {
      return res.status(400).json({ error: "Invalid url" });
    }

    const upstream = await fetchWithTimeout(url, { headers: { Accept: "image/*" } }, 15000);
    if (!upstream || !upstream.ok) {
      const text = upstream ? await upstream.text().catch(() => "") : "";
      return res.status(502).json({ error: "Failed to fetch image", details: text });
    }

    const contentType = upstream.headers.get("content-type") || "image/*";
    if (!contentType.startsWith("image/")) {
      return res.status(415).json({ error: "Fetched resource is not an image" });
    }

    // Allow CORS for browser clients
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Content-Type", contentType);

    // Stream the image to client
    const body = upstream.body;
    if (body && typeof body.pipe === "function") {
      body.pipe(res);
    } else {
      const buf = await upstream.arrayBuffer();
      res.send(Buffer.from(buf));
    }
  } catch (err) {
    console.error("image-proxy error:", err);
    res.status(500).json({ error: "Image proxy failed" });
  }
});

app.get("/api/recipes/cuisine/:region", async (req, res) => {
  try {
    const { region } = req.params;
    const page = req.query.page ?? 1;
    const pageSize = req.query.page_size ?? 10;
    const field = req.query.field ?? "total_time";
    const min = req.query.min ?? 0;
    const max = req.query.max ?? 259260;
    const continent = req.query.continent ?? "";
    const subRegion = req.query.subRegion ?? "";
    const url = `${BASE_URL}/recipe2-api/recipes_cuisine/cuisine/${encodeURIComponent(
      region
    )}?field=${encodeURIComponent(field)}&min=${encodeURIComponent(
      min
    )}&max=${encodeURIComponent(max)}&continent=${encodeURIComponent(
      continent
    )}&subRegion=${encodeURIComponent(subRegion)}&page=${encodeURIComponent(
      page
    )}&page_size=${encodeURIComponent(pageSize)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe cuisine fetch failed" });
  }
});

app.get("/api/recipes/diet/:diet", async (req, res) => {
  try {
    const { diet } = req.params;
    const { region } = req.query;
    const apiDiet = normalizeDiet(diet);
    if (!apiDiet) {
      return res.status(400).json({ error: "Unsupported diet value" });
    }

    const regionValue = region
      ? mapCuisineRegion(String(region)) === "Indian"
        ? "Indian Subcontinent"
        : mapCuisineRegion(String(region))
      : null;

    const url = regionValue
      ? `${BASE_URL}/recipe2-api/recipe/region-diet/region-diet?region=${encodeURIComponent(
          regionValue
        )}&diet=${encodeURIComponent(apiDiet)}&limit=10`
      : `${BASE_URL}/recipe2-api/recipe-diet/recipe-diet?diet=${encodeURIComponent(
          apiDiet
        )}&limit=10`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe diet fetch failed" });
  }
});

app.get("/api/recipes/title", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: "Missing title query" });
    }
    const url = `${BASE_URL}/recipe2-api/recipe-bytitle/recipeByTitle?title=${encodeURIComponent(
      String(title)
    )}`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe title fetch failed" });
  }
});

app.get("/api/recipes/instructions/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const url = `${BASE_URL}/recipe2-api/instructions/${encodeURIComponent(recipeId)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe instructions fetch failed" });
  }
});

app.get("/api/recipes/recipeofday", async (req, res) => {
  try {
    const url = `${BASE_URL}/recipe2-api/recipe/recipeofday`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe of day fetch failed" });
  }
});

app.get("/api/recipes/recipeofday/with-ingredients-categories", async (req, res) => {
  try {
    const { excludeIngredients = "", excludeCategories = "" } = req.query;
    const url = `${BASE_URL}/recipe2-api/recipe/recipe-day/with-ingredients-categories?excludeIngredients=${encodeURIComponent(
      String(excludeIngredients)
    )}&excludeCategories=${encodeURIComponent(String(excludeCategories))}`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe of day with exclusions fetch failed" });
  }
});

app.get("/api/recipes/calories", async (req, res) => {
  try {
    const { minCalories = 0, maxCalories = 1000000, limit = 10 } = req.query;
    const url = `${BASE_URL}/recipe2-api/recipes-calories/calories?minCalories=${encodeURIComponent(
      minCalories
    )}&maxCalories=${encodeURIComponent(maxCalories)}&limit=${encodeURIComponent(limit)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe calories fetch failed" });
  }
});

app.get("/api/recipes/protein", async (req, res) => {
  try {
    const { min = 0, max = 1000, page = 1, limit = 10 } = req.query;
    const url = `${BASE_URL}/recipe2-api/protein/protein-range?min=${encodeURIComponent(
      min
    )}&max=${encodeURIComponent(max)}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(
      limit
    )}`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe protein fetch failed" });
  }
});

app.get("/api/recipes/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const url = `${BASE_URL}/recipe2-api/recipe/nutrition/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe nutrition fetch failed" });
  }
});

app.get("/api/recipes/micronutrition", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const url = `${BASE_URL}/recipe2-api/recipe-micronutri/micronutritioninfo?page=${encodeURIComponent(
      page
    )}&limit=${encodeURIComponent(limit)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recipe micronutrition fetch failed" });
  }
});

app.get("/api/flavor/pairings/:ingredient", async (req, res) => {
  try {
    const { ingredient } = req.params;
    const url = `${FLAVOR_BASE_URL}/foodpairing/ingredient/${encodeURIComponent(ingredient)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: FLAVOR_API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Flavor pairing fetch failed" });
  }
});

app.get("/api/flavor/profile/:profile", async (req, res) => {
  try {
    const { profile } = req.params;
    const url = `${FLAVOR_BASE_URL}/molecules/flavor-profile/${encodeURIComponent(profile)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: FLAVOR_API_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Flavor profile fetch failed" });
  }
});
app.get("/", (req, res) => {
  res.send("FlavourAI backend is running 🚀");
});

// Start server only if not in Vercel production
const isProduction = process.env.VERCEL === '1';
if (!isProduction) {
  const PORT = process.env.PORT || 5051;
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

// Export app for Vercel serverless
export default app;
