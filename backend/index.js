import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", "src", ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = process.env.RECIPE_DB_BASE_URL || "http://cosylab.iiitd.edu.in:6969";
const FLAVOR_DB_BASE_URL = process.env.FLAVOR_DB_BASE_URL || `${BASE_URL}/flavordb`;
const API_KEY = process.env.RECIPE_DB_API_KEY || "EakuMCplIpn3LWZuhhD9hN5PPZo4xaQ_EOAlgLS3bU8Fez7_";

const fetchHeaders = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

// 🔥 MAIN ENDPOINT
app.post("/api/meals", async (req, res) => {
  try {
    const { cuisine, diet, caloriesMin, caloriesMax, proteinMin, proteinMax, goals } = req.body;
    console.log("📥 INCOMING REQUEST:", { cuisine, diet, caloriesMin, caloriesMax, proteinMin, proteinMax, goals });
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
    const useCaloriesMin = inferred.a;
    const useCaloriesMax = inferred.b;
    const useProteinMin = inferred.c;
    const useProteinMax = inferred.d;

    async function fetchCuisine(region) {
      const url = `${BASE_URL}/recipe2-api/recipes_cuisine/cuisine/${encodeURIComponent(region)}?page=1&page_size=12`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const text = await response.text();
        return { ok: false, status: response.status, text };
      }
      const json = await response.json();
      return { ok: true, json };
    }

    async function fetchCalories(min, max) {
      const url = `${BASE_URL}/recipe2-api/recipes_calories?min=${encodeURIComponent(
        min ?? ""
      )}&max=${encodeURIComponent(max ?? "")}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const text = await response.text();
        return { ok: false, status: response.status, text };
      }
      const json = await response.json();
      return { ok: true, json };
    }

    async function fetchProtein(min, max) {
      const url = `${BASE_URL}/recipe2-api/recipes_protein?min=${encodeURIComponent(
        min ?? ""
      )}&max=${encodeURIComponent(max ?? "")}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const text = await response.text();
        return { ok: false, status: response.status, text };
      }
      const json = await response.json();
      return { ok: true, json };
    }

    async function fetchDiet(d) {
      if (!d) return { ok: true, json: { data: [] } };
      const url = `${BASE_URL}/recipe2-api/recipes_diet/${encodeURIComponent(d)}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const text = await response.text();
        return { ok: false, status: response.status, text };
      }
      const json = await response.json();
      return { ok: true, json };
    }

    async function generateMealsWithLLM({ cuisine, diet, caloriesMin, caloriesMax, proteinMin, proteinMax }) {
      const groqKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
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
        `Return 10 meals strictly as JSON with shape {"meals":[{"name":string,"calories":number|null,"protein":number|null,"region":string,"ingredients":["item1","item2"],"recipe":string}]}. No extra text.`,
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
            ingredients: Array.isArray(x.ingredients) ? x.ingredients : typeof x.ingredients === "string" ? x.ingredients.split(",").map(i => i.trim()) : [],
            recipe: String(x.recipe || ""),
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
      fetchDiet(diet),
    ]);

    if (cuisine && !cuisineResp.ok) {
      console.error("Cuisine fetch failed", cuisineResp?.status, cuisineResp?.text);
    }

    const cuisineList = cuisineResp.ok && Array.isArray(cuisineResp.json?.data) ? cuisineResp.json.data : [];
    const calsList = calsResp.ok && Array.isArray(calsResp.json?.data) ? calsResp.json.data : [];
    const protList = protResp.ok && Array.isArray(protResp.json?.data) ? protResp.json.data : [];
    const dietList = dietResp.ok && Array.isArray(dietResp.json?.data) ? dietResp.json.data : [];

    function byId(list) {
      const m = new Map();
      for (const r of list || []) {
        const id = r?.Recipe_id ?? r?._id ?? r?.id ?? Math.random().toString(36).slice(2);
        if (!m.has(id)) m.set(id, r);
      }
      return m;
    }

    const base =
      cuisineList.length > 0
        ? cuisineList
        : dietList.length > 0
        ? dietList
        : calsList.length > 0
        ? calsList
        : protList;

    let merged = base;

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
        return res.json({ meals: llmMeals });
      }
    }

    if (typeof useCaloriesMin === "number" || typeof useCaloriesMax === "number") {
      merged = merged.filter((r) => {
        const v = Number(r?.calories ?? r?.Calories);
        if (Number.isNaN(v)) return true;
        if (typeof useCaloriesMin === "number" && v < useCaloriesMin) return false;
        if (typeof useCaloriesMax === "number" && v > useCaloriesMax) return false;
        return true;
      });
    }
    if (typeof useProteinMin === "number" || typeof useProteinMax === "number") {
      merged = merged.filter((r) => {
        const v = Number(r?.protein ?? r?.Protein);
        if (Number.isNaN(v)) return true;
        if (typeof useProteinMin === "number" && v < useProteinMin) return false;
        if (typeof useProteinMax === "number" && v > useProteinMax) return false;
        return true;
      });
    }

    const meals = (merged || []).slice(0, 12).map((r) => ({
      id: r?.Recipe_id ?? r?._id ?? null,
      name: r?.Recipe_title ?? r?.name ?? r?.title ?? "Untitled",
      calories: r?.calories ?? null,
      protein: r?.protein ?? null,
      region: r?.Region ?? r?.region ?? cuisine ?? null,
      ingredients: r?.Ingredients ?? r?.ingredients ?? r?.Items ?? r?.items ?? [],
      recipe: r?.Instructions ?? r?.instructions ?? r?.Recipe ?? r?.recipe ?? null,
    }));

    // Fetch full details (ingredients, instructions) for each meal
    let mealsWithDetails = await Promise.all(
      meals.map(async (meal) => {
        if (!meal.id) return meal; // Skip if no ID
        
        try {
          const url = `${BASE_URL}/recipe2-api/recipe/nutrition/${encodeURIComponent(meal.id)}`;
          const resp = await fetch(url, {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
          });
          
          if (!resp.ok) return meal; // Return original if fetch fails
          
          const detail = await resp.json();
          const detailObj = detail?.data || detail || {};
          
          // Extract ingredients and recipe from detail
          return {
            ...meal,
            ingredients: detailObj?.Ingredients || detailObj?.ingredients || detailObj?.Items || detailObj?.items || meal.ingredients || [],
            recipe: detailObj?.Instructions || detailObj?.instructions || detailObj?.Recipe || detailObj?.recipe || detailObj?.method || meal.recipe || null,
          };
        } catch (err) {
          return meal; // Return original on error
        }
      })
    );

    // If no meals found, try LLM
    if (mealsWithDetails.length === 0) {
      const llmMeals = await generateMealsWithLLM({
        cuisine,
        diet,
        caloriesMin: useCaloriesMin,
        caloriesMax: useCaloriesMax,
        proteinMin: useProteinMin,
        proteinMax: useProteinMax,
      });
      if (Array.isArray(llmMeals) && llmMeals.length > 0) {
        return res.json({ meals: llmMeals });
      }
    }

    return res.json({ meals: mealsWithDetails });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "RecipeDB failed" });
  }
});
// 🍽️ RECIPE DB PROXY (for frontend direct recipe API calls)
app.get("/api/recipe/cuisine/:region", async (req, res) => {
  try {
    const { region } = req.params;
    const { page = 1, page_size = 10 } = req.query;
    const url = `${BASE_URL}/recipe2-api/recipes_cuisine/cuisine/${encodeURIComponent(region)}?page=${page}&page_size=${page_size}`;
    const r = await fetch(url, { headers: fetchHeaders });
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error("Recipe DB cuisine error:", err);
    res.status(500).json({ error: "Recipe DB failed" });
  }
});
app.get("/api/recipe/diet/:diet", async (req, res) => {
  try {
    const url = `${BASE_URL}/recipe2-api/recipes_diet/${encodeURIComponent(req.params.diet)}`;
    const r = await fetch(url, { headers: fetchHeaders });
    res.json(await r.json());
  } catch (err) {
    console.error("Recipe DB diet error:", err);
    res.status(500).json({ error: "Recipe DB failed" });
  }
});
app.get("/api/recipe/calories", async (req, res) => {
  try {
    const { min, max } = req.query;
    const url = `${BASE_URL}/recipe2-api/recipes_calories?min=${encodeURIComponent(min ?? "")}&max=${encodeURIComponent(max ?? "")}`;
    const r = await fetch(url, { headers: fetchHeaders });
    res.json(await r.json());
  } catch (err) {
    console.error("Recipe DB calories error:", err);
    res.status(500).json({ error: "Recipe DB failed" });
  }
});
app.get("/api/recipe/protein", async (req, res) => {
  try {
    const { min, max } = req.query;
    const url = `${BASE_URL}/recipe2-api/recipes_protein?min=${encodeURIComponent(min ?? "")}&max=${encodeURIComponent(max ?? "")}`;
    const r = await fetch(url, { headers: fetchHeaders });
    res.json(await r.json());
  } catch (err) {
    console.error("Recipe DB protein error:", err);
    res.status(500).json({ error: "Recipe DB failed" });
  }
});
app.get("/api/recipe/nutrition/:id", async (req, res) => {
  try {
    const url = `${BASE_URL}/recipe2-api/recipe/nutrition/${encodeURIComponent(req.params.id)}`;
    const r = await fetch(url, { headers: fetchHeaders });
    res.json(await r.json());
  } catch (err) {
    console.error("Recipe DB nutrition error:", err);
    res.status(500).json({ error: "Recipe DB failed" });
  }
});

// 🌿 FLAVOR DB PROXY (for frontend flavor pairing / profile calls)
app.get("/api/flavor/foodpairing/ingredient/:ingredient", async (req, res) => {
  try {
    const url = `${FLAVOR_DB_BASE_URL}/foodpairing/ingredient/${encodeURIComponent(req.params.ingredient)}`;
    const r = await fetch(url, { headers: fetchHeaders });
    if (!r.ok) throw new Error(`FlavorDB ${r.status}`);
    res.json(await r.json());
  } catch (err) {
    console.error("FlavorDB foodpairing error:", err);
    res.status(500).json({ error: "FlavorDB failed" });
  }
});
app.get("/api/flavor/molecules/flavor-profile/:profile", async (req, res) => {
  try {
    const url = `${FLAVOR_DB_BASE_URL}/molecules/flavor-profile/${encodeURIComponent(req.params.profile)}`;
    const r = await fetch(url, { headers: fetchHeaders });
    if (!r.ok) throw new Error(`FlavorDB ${r.status}`);
    res.json(await r.json());
  } catch (err) {
    console.error("FlavorDB profile error:", err);
    res.status(500).json({ error: "FlavorDB failed" });
  }
});

app.get("/", (req, res) => {
  res.send("FlavourAI backend is running 🚀");
});

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
