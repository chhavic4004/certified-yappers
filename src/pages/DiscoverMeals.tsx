import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Meal = {
  Recipe_title: string;
  Calories: string;
  cook_time: string;
  prep_time: string;
  servings: string;
  Region: string;
  Sub_region?: string;
};

const DiscoverMeals = () => {
  const { user } = useAuth();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ✅ Load Preferences */
  const preferences = JSON.parse(
    localStorage.getItem("flavourai.preferences") || "{}"
  );

  const cuisine = preferences?.cuisine?.[0] || "Indian";

  const fetchMeals = async () => {
  try {
    const res = await fetch(
      "https://api.foodoscope.com/recipe2-api/byutensils/utensils?utensils=pan&page=1&limit=10",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_FOODOSCOPE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    console.log("API DATA:", data);

  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    fetchMeals();
  }, []);

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
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
            {error}
          </div>
        )}

        {/* MEALS GRID */}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-8">
            {meals.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
  console.log(import.meta.env.VITE_FOODOSCOPE_KEY);

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

      <Stat label="Calories" value={meal.Calories} />
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
