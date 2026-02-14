import { useNavigate } from "react-router-dom";
import MealCard from "@/components/MealCard";
import { useEffect, useMemo, useState } from "react";
import { BACKEND_URL } from "@/services/api";
import { getFlavorPairings } from "@/services/flavorApi";
import mealPlaceholder from "@/assets/meal-1.jpg";

type Meal = {
  name: string;
  calories: number;
  protein: number;
  reasons?: string[];
};

type MealDetails = {
  image: string | null;
  ingredients: string[];
  steps: string[];
  loading: boolean;
};

const MealSuggestion = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsMap, setDetailsMap] = useState<Record<string, MealDetails>>({});

  const showFlavorInfo = async () => {
    const data: unknown = await getFlavorPairings("chicken");
    const pairsWith =
      typeof data === "object" && data !== null && "pairs_with" in data
        ? (data as { pairs_with?: unknown }).pairs_with
        : undefined;
    console.log(pairsWith);
  };

  const synonym = (name: string) => {
    const map: Record<string, string> = {
      "murgh makhani": "Butter Chicken",
      "butter chicken": "Butter Chicken",
      "chicken tikka masala": "Chicken Tikka Masala",
      "chicken korma": "Chicken Korma",
      "kadai chicken": "Chicken Handi",
      "kadhai chicken": "Chicken Handi",
      "chole": "Chana Masala",
      "chana masala": "Chana Masala",
      "saag paneer": "Palak Paneer",
      "palak paneer": "Palak Paneer",
      "mattar paneer": "Matar Paneer",
      "matar paneer": "Matar Paneer",
      "baingan bharta": "Baingan Bharta",
      "saag aloo": "Aloo Palak",
      "sag aloo": "Saag Aloo",
      "saag chicken": "Chicken Saag",
      "rajma masala": "Rajma",
    };
    const key = name.trim().toLowerCase();
    return map[key] || name;
  };

  const ensureDetails = async (name: string) => {
    if (detailsMap[name]?.loading === true || detailsMap[name]?.steps?.length) return;
    setDetailsMap((m) => ({
      ...m,
      [name]: { image: m[name]?.image ?? null, ingredients: [], steps: [], loading: true },
    }));
    try {
      const primaryQuery = synonym(name);
      const r = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(primaryQuery)}`,
      );
      if (!r.ok) {
        throw new Error("details fetch failed");
      }
      let j = (await r.json()) as { meals?: unknown[] };
      let first = Array.isArray(j.meals) ? (j.meals?.[0] as Record<string, unknown>) : null;

      if (!first) {
        const fallbackQuery = name.split(" ").slice(0, 2).join(" ");
        const r2 = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(fallbackQuery)}`,
        );
        if (r2.ok) {
          j = (await r2.json()) as { meals?: unknown[] };
          first = Array.isArray(j.meals) ? (j.meals?.[0] as Record<string, unknown>) : null;
        }
      }

      if (!first) {
        const guessMain = (n: string) => {
          const t = n.toLowerCase();
          if (t.includes("chicken")) return ["chicken"];
          if (t.includes("paneer") || t.includes("saag paneer")) return ["paneer", "cheese"];
          if (t.includes("aloo") || t.includes("potato")) return ["potato"];
          if (t.includes("rajma")) return ["kidney beans"];
          if (t.includes("chana") || t.includes("chickpea")) return ["chickpeas", "chickpea"];
          if (t.includes("fish")) return ["fish"];
          if (t.includes("lamb") || t.includes("mutton")) return ["lamb"];
          if (t.includes("egg")) return ["egg"];
          return ["chicken"];
        };
        const candidates = guessMain(name);
        let picked: { idMeal?: string; strMealThumb?: string } | null = null;
        // try filter by ingredient then lookup
        for (const ing of candidates) {
          try {
            const rf = await fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ing)}`,
            );
            if (!rf.ok) continue;
            const jf = (await rf.json()) as { meals?: unknown[] };
            const oneList = Array.isArray(jf.meals) ? (jf.meals as Record<string, unknown>[]) : [];
            // pick the first whose title roughly matches some token in requested name
            const tokens = name.toLowerCase().split(/\s+/).filter(Boolean);
            const scored = oneList
              .map((o) => {
                const title = String(o?.strMeal || "").toLowerCase();
                const score = tokens.reduce((s, t) => (title.includes(t) ? s + 1 : s), 0);
                return { o, score };
              })
              .sort((a, b) => b.score - a.score);
            const one = (scored[0]?.score || 0) > 0 ? (scored[0].o as Record<string, unknown>) : null;
            if (one && typeof one.idMeal === "string") {
              picked = { idMeal: one.idMeal as string, strMealThumb: String(one.strMealThumb ?? "") };
              break;
            }
          } catch {
            // ignore
          }
        }
        if (picked?.idMeal) {
          try {
            const rl = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
                picked.idMeal,
              )}`,
            );
            if (rl.ok) {
              const jl = (await rl.json()) as { meals?: unknown[] };
              first = Array.isArray(jl.meals)
                ? (jl.meals?.[0] as Record<string, unknown>)
                : null;
              if (first && picked.strMealThumb && !first.strMealThumb) {
                (first as Record<string, unknown>).strMealThumb = picked.strMealThumb;
              }
            }
          } catch {
            // ignore
          }
        }
      }

      const foundImage = first?.strMealThumb || null;
      const ingredients: string[] = [];
      if (first) {
        for (let i = 1; i <= 20; i++) {
          const ing = first[`strIngredient${i}` as keyof typeof first] as string | undefined;
          const meas = first[`strMeasure${i}` as keyof typeof first] as string | undefined;
          const line = [meas?.trim(), ing?.trim()].filter(Boolean).join(" ");
          if (line) ingredients.push(line);
        }
      }
      const instructionsRaw: string =
        typeof first?.strInstructions === "string" ? first.strInstructions : "";
      const steps = instructionsRaw
        .split(/\r?\n|\.\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

    } catch {
      setDetailsMap((m) => ({
        ...m,
        [name]: { image: m[name]?.image ?? null, ingredients: [], steps: [], loading: false },
      }));
    }
  };

  const mealCards = useMemo(
    () =>
      meals.map((meal) => {
        const d = detailsMap[meal.name];
        const img =
          d?.image ||
          `https://picsum.photos/seed/${encodeURIComponent(meal.name)}/480/480`;
        return { ...meal, img };
      }),
    [meals, detailsMap],
  );

  useEffect(() => {
    if (meals.length > 0) {
      meals.forEach((m) => ensureDetails(m.name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meals]);
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawPrefs =
          localStorage.getItem("flavourai.preferences") ||
          localStorage.getItem("preferences") ||
          "{}";
        const prefs = JSON.parse(rawPrefs);

        // Build request body from preferences
        const reqBody = {
          cuisine: prefs.cuisine?.[0] || "Indian",
          diet: prefs.diet?.[0],
          goals: prefs.goals,
        };

        console.log("Sending meal request to backend:", reqBody);

        const res = await fetch(`${BACKEND_URL}/api/meals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        });

        if (!res.ok) {
          throw new Error(`Backend error: ${res.status}`);
        }

        const data = await res.json();
        console.log("FULL API RESPONSE 👉", data);

        if (!data?.meals || data.meals.length === 0) {
          console.warn("No meals returned from backend");
          setMeals([]);
          setLoading(false);
          return;
        }

        setMeals(
          (Array.isArray(data.meals) ? data.meals : []).map((item: unknown) => {
            const obj = item as Record<string, unknown>;
            const nameRaw = obj.name ?? obj.title;
            const caloriesRaw = obj.calories;
            const proteinRaw = obj.protein;
            const reasonsArr = Array.isArray(obj.reasons) ? (obj.reasons as unknown[]).filter((x) => typeof x === "string") as string[] : [];
            return {
              name: typeof nameRaw === "string" && nameRaw.trim() ? nameRaw : "Untitled",
              calories: Number.isFinite(Number(caloriesRaw)) ? Number(caloriesRaw) : 0,
              protein: Number.isFinite(Number(proteinRaw)) ? Number(proteinRaw) : 0,
              reasons: reasonsArr,
            };
          }),
        );

      } catch (err) {
        console.error("API Error", err);
        setError(err instanceof Error ? err.message : "Request failed");
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex justify-center px-6 py-10">

      {/* ROUNDED CONTAINER */}
      <div className="w-full max-w-7xl bg-white rounded-3xl border border-orange-100 p-10">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">

          <div>
            <h1 className="text-4xl font-bold mb-2">
              Meals Crafted For You 🍽️
            </h1>

            <p className="text-gray-500">
              AI-personalized meals based on your health & taste profile.
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Nutrition verified via <span className="font-semibold">RecipeDB</span>
              {" • "}
              Flavor optimized using <span className="font-semibold">FlavorDB</span>
            </p>
          </div>

          <button
            onClick={() => navigate("/preferences")}
            className="
              px-5 py-3
              rounded-xl
              border border-orange-300
              text-orange-600
              font-semibold
              hover:bg-orange-50
              transition
            "
          >
            Change Preferences
          </button>

        </div>

        {/* MEALS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Generating meals…</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-3">Meals load nahi ho paaye.</p>
              <p className="text-sm text-gray-400 mb-6">
                {error}
              </p>
              <button
                onClick={() => navigate("/preferences")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Update Preferences
              </button>
            </div>
          ) : meals.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No meals found matching your preferences.</p>
              <button
                onClick={() => navigate("/preferences")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Update Preferences
              </button>
            </div>
          ) : (
            mealCards.map((meal, i) => {
              const reason = (meal as Meal)?.reasons && (meal as Meal).reasons!.length ? (meal as Meal).reasons! : ["AI Suggested", "Preference Matched"];
              return (
                <div
                  key={i}
                  className="group relative transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                  onMouseEnter={() => ensureDetails(meal.name)}
                >
                  <MealCard
                    image={meal.img}
                    name={meal.name}
                    calories={meal.calories}
                    protein={meal.protein}
                    reason={reason}
                  />

                  {/* ✅ PREMIUM WHITE HOVER */}
                  <div
                    className="
                      absolute inset-0
                      bg-white/95
                      backdrop-blur-md
                      rounded-2xl
                      opacity-0
                      group-hover:opacity-100
                      transition
                      p-5
                      flex flex-col justify-between
                    "
                  >
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg">{meal.name}</h3>
                      <div className="text-xs text-gray-500">🔥 {meal.calories} cal • 💪 {meal.protein}g</div>
                      <div className="flex flex-wrap gap-2">
                        {reason.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-semibold">Ingredients</div>
                          <div className="max-h-28 overflow-auto pr-1">
                            {detailsMap[meal.name]?.loading ? (
                              <div className="text-xs text-gray-400">Loading…</div>
                            ) : (detailsMap[meal.name]?.ingredients?.length ?? 0) > 0 ? (
                              <ul className="text-xs text-gray-700 list-disc pl-4 space-y-1">
                                {detailsMap[meal.name]?.ingredients.slice(0, 10).map((ing, idx2) => (
                                  <li key={idx2}>{ing}</li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-xs text-gray-400">Ingredients unavailable</div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-semibold">Recipe</div>
                          <div className="max-h-28 overflow-auto pr-1">
                            {detailsMap[meal.name]?.loading ? (
                              <div className="text-xs text-gray-400">Loading…</div>
                            ) : (detailsMap[meal.name]?.steps?.length ?? 0) > 0 ? (
                              <ol className="text-xs text-gray-700 list-decimal pl-4 space-y-1">
                                {detailsMap[meal.name]?.steps.slice(0, 6).map((st, idx3) => (
                                  <li key={idx3}>{st}</li>
                                ))}
                              </ol>
                            ) : (
                              <div className="text-xs text-gray-400">Recipe steps unavailable</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="
                        mt-4
                        py-2
                        rounded-lg
                        bg-gradient-to-r
                        from-orange-400
                        to-orange-600
                        text-white
                        font-semibold
                        hover:scale-[1.03]
                        transition
                      "
                    >
                      Add To My Meal
                    </button>

                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* CTA */}
        <div className="flex justify-center mt-14">
          <button
            onClick={() => navigate("/dashboard")}
            className="
              px-10 py-4
              rounded-xl
              font-semibold
              text-white
              bg-gradient-to-r
              from-orange-400
              to-orange-600
              hover:from-orange-500
              hover:to-orange-700
              transition
              hover:scale-[1.05]
            "
          >
            Continue to Dashboard →
          </button>
        </div>

      </div>
    </div>
  );
};

export default MealSuggestion;
