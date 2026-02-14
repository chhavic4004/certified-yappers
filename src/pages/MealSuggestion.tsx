import { useNavigate } from "react-router-dom";
import MealCard from "@/components/MealCard";

import meal1 from "@/assets/meal-1.jpg";
import meal2 from "@/assets/meal-2.jpg";
import meal3 from "@/assets/meal-3.jpg";
import meal4 from "@/assets/meal-4.jpg";

const meals = [
  {
    image: meal1,
    name: "Grilled Salmon Bowl",
    calories: 420,
    protein: 32,
    reason: ["Low Sugar", "Heart Friendly", "Omega-3 Rich"],
  },
  {
    image: meal2,
    name: "Buddha Power Bowl",
    calories: 380,
    protein: 18,
    reason: ["High Fiber", "Gut Friendly", "Plant Protein"],
  },
  {
    image: meal3,
    name: "Mediterranean Salad",
    calories: 350,
    protein: 28,
    reason: ["Low Carb", "Anti-Inflammatory", "Fresh Ingredients"],
  },
  {
    image: meal4,
    name: "Tuna Poke Bowl",
    calories: 390,
    protein: 35,
    reason: ["High Protein", "Low Fat", "Muscle Recovery"],
  },
  {
    image: meal1,
    name: "Herb Chicken Plate",
    calories: 410,
    protein: 30,
    reason: ["Lean Protein", "Low Sodium"],
  },
  {
    image: meal3,
    name: "Greek Veg Wrap",
    calories: 320,
    protein: 16,
    reason: ["Light Meal", "Low Sugar"],
  },
  {
    image: meal2,
    name: "Protein Quinoa Bowl",
    calories: 360,
    protein: 26,
    reason: ["Complete Protein", "Energy Boosting"],
  },
  {
    image: meal4,
    name: "Teriyaki Fish Plate",
    calories: 395,
    protein: 31,
    reason: ["Balanced Macros", "Flavor Optimized"],
  },
  {
    image: meal3,
    name: "Avocado Super Salad",
    calories: 340,
    protein: 14,
    reason: ["Healthy Fats", "Skin Friendly"],
  },
  {
    image: meal1,
    name: "Garlic Shrimp Bowl",
    calories: 370,
    protein: 29,
    reason: ["Low Carb", "High Protein"],
  },
  {
    image: meal2,
    name: "Vegan Energy Plate",
    calories: 360,
    protein: 20,
    reason: ["Plant Based", "High Fiber"],
  },
  {
    image: meal4,
    name: "Seared Chicken & Greens",
    calories: 405,
    protein: 33,
    reason: ["Muscle Growth", "Low Sugar"],
  },
];

const MealSuggestion = () => {
  const navigate = useNavigate();

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

          {meals.map((meal, i) => (
            <div
              key={i}
              className="group relative transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
            >
              <MealCard {...meal} />

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
                    {meal.reason.map((tag, idx) => (
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
          ))}

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
