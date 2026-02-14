import { useNavigate } from "react-router-dom";
import MealCard from "@/components/MealCard";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/services/api";
import meal1 from "@/assets/meal-1.jpg";

type Meal = {
  name: string;
  calories: number;
  protein: number;
};

const MealSuggestion = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const prefs = JSON.parse(localStorage.getItem("preferences") || "{}");

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
            return {
              name: typeof nameRaw === "string" && nameRaw.trim() ? nameRaw : "Untitled",
              calories: Number.isFinite(Number(caloriesRaw)) ? Number(caloriesRaw) : 0,
              protein: Number.isFinite(Number(proteinRaw)) ? Number(proteinRaw) : 0,
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
            meals.map((meal, i) => {
              const reason = ["AI Suggested", "Preference Matched"];
              return (
                <div
                  key={i}
                  className="group relative transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                >
                  <MealCard
                    image={meal1}
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
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        AI Recommendation
                      </h3>

                      <p className="text-gray-600 text-sm mb-4">
                        Optimized for your health profile and flavor compatibility.
                      </p>

                      {/* TAGS */}
                      <div className="flex flex-wrap gap-2">
                        {reason.map((tag, idx) => (
                          <span
                            key={idx}
                            className="
                              text-xs
                              px-3 py-1
                              bg-orange-100
                              text-orange-600
                              rounded-full
                              font-semibold
                            "
                          >
                            {tag}
                          </span>
                        ))}
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
