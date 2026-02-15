import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

/* ---------------- TYPES ---------------- */

type Meal = {
  Recipe_title: string;
  Calories: string;
  cook_time: string;
  prep_time: string;
  servings: string;
  Region: string;
  Sub_region?: string;
};

/* ---------------- COMPONENT ---------------- */

const DiscoverMeals = () => {
  const { user } = useAuth();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ✅ Load Preferences safely */
  const preferences = JSON.parse(
    localStorage.getItem("flavourai.preferences") || "{}"
  );

  // fallback cuisine
  const cuisine = preferences?.cuisine?.[0] || "Indian";

  /* ---------------- FETCH ---------------- */

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError("");

      const url = `https://api.foodoscope.com/recipe2-api/recipes_cuisine/cuisine/${cuisine}?page=1&page_size=12`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_FOODOSCOPE_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();

      // ⭐ MOST IMPORTANT LINE
      setMeals(data?.data || []);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch personalized meals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            Discover Meals 🍽️
          </h1>

          <p className="text-gray-500 mt-2">
            Personalized recipes based on your cuisine preference:
            <span className="font-semibold text-orange-500 ml-1">
              {cuisine}
            </span>
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"/>
            <p className="mt-4 text-gray-500">
              Finding delicious meals for you...
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && meals.length === 0 && !error && (
          <div className="text-center text-gray-500 py-20">
            No meals found for this cuisine.
          </div>
        )}

        {/* MEALS GRID */}
        {!loading && !error && meals.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {meals.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverMeals;

/* ---------------- CARD ---------------- */

const MealCard = ({ meal }: { meal: Meal }) => (
  <div className="
    bg-white
    border
    rounded-3xl
    p-6
    hover:shadow-xl
    transition
    cursor-pointer
  ">
    <h2 className="text-xl font-bold mb-2">
      {meal.Recipe_title}
    </h2>

    <p className="text-sm text-gray-400 mb-4">
      {meal.Region} {meal.Sub_region && `• ${meal.Sub_region}`}
    </p>

    <div className="grid grid-cols-2 gap-3 text-sm">

      <Stat label="Calories" value={`${meal.Calories} kcal`} />
      <Stat label="Cook Time" value={`${meal.cook_time} min`} />
      <Stat label="Prep Time" value={`${meal.prep_time} min`} />
      <Stat label="Servings" value={meal.servings} />

    </div>

    <button className="
      mt-6
      w-full
      bg-orange-500
      hover:bg-orange-600
      text-white
      py-2
      rounded-xl
      font-semibold
      transition
    ">
      View Recipe
    </button>
  </div>
);

/* ---------------- SMALL STAT ---------------- */

const Stat = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="bg-orange-50 rounded-xl p-3">
    <p className="text-gray-400 text-xs">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);
