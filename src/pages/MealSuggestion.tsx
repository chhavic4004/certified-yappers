import { useNavigate } from "react-router-dom";
import MealCard from "@/components/MealCard";
import { MealDetailModal } from "@/components/MealDetailModal";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/services/api";
import { ChefHat, AlertCircle, Loader2, Check } from "lucide-react";

type Recipe = {
  _id?: string;
  Recipe_title?: string;
  name?: string;
  Calories?: string | number;
  "Energy (kcal)"?: string | number;
  "Protein (g)"?: string | number;
  protein?: number | string;
  img_url?: string;
  ingredients?: Array<{ name: string }>;
  instructions?: string;
  Region?: string;
  vegan?: string | number;
  vegetarian?: string | number;
  pescetarian?: string | number;
  reasons?: string[];
};

const MealSuggestion = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log("🚀 MealSuggestion component mounted");
    
    // Ensure we have some default preferences for testing
    const testPrefs = localStorage.getItem("flavourai.preferences");
    if (!testPrefs) {
      console.log("⚠️ No preferences found, setting defaults...");
      localStorage.setItem("flavourai.preferences", JSON.stringify({
        cuisine: ["Indian"],
        diet: ["Vegan"],
        goals: [],
        allergies: [],
        health: []
      }));
    }
    
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const rawPrefs =
        localStorage.getItem("flavourai.preferences") ||
        localStorage.getItem("preferences") ||
        "{}";
      const prefs = JSON.parse(rawPrefs);

      const toNumberOrUndefined = (value: unknown) => {
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string" && value.trim() !== "") {
          const parsed = Number(value);
          return Number.isFinite(parsed) ? parsed : undefined;
        }
        return undefined;
      };

      const reqBody = {
        cuisine: prefs.cuisine?.[0] || "Indian",
        diet: prefs.diet?.[0],
        goals: prefs.goals,
        caloriesMin: toNumberOrUndefined(prefs.caloriesMin),
        caloriesMax: toNumberOrUndefined(prefs.caloriesMax),
        proteinMin: toNumberOrUndefined(prefs.proteinMin),
        proteinMax: toNumberOrUndefined(prefs.proteinMax),
        allergies: prefs.allergies,
        health: prefs.health,
      };

      console.log("🔍 Fetching meals from:", `${BACKEND_URL}/api/meals`);
      console.log("📦 Request body:", reqBody);

      const res = await fetch(`${BACKEND_URL}/api/meals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      console.log("📡 Response status:", res.status, res.statusText);

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log("✅ API Response:", data);
      console.log("📊 Meals count:", data?.meals?.length);

      if (!data?.meals || data.meals.length === 0) {
        console.warn("⚠️ No meals returned from backend");
        setRecipes([]);
        setError("No meals found. Try adjusting your preferences.");
        return;
      }

      // Convert meals to recipe format with images
      const mealRecipes: Recipe[] = data.meals.map((meal: any, index: number) => {
        const title = meal.Recipe_title || meal.name || "Untitled";
        
        // Generate fallback image from Unsplash if no image URL provided
        const getFallbackImage = (mealTitle: string) => {
          const foodKeyword = encodeURIComponent(mealTitle.split(' ')[0] || 'food');
          return `https://source.unsplash.com/400x300/?${foodKeyword},food,cuisine`;
        };
        
        const rawImage = meal.img_url || getFallbackImage(title);
        const backendBase = (BACKEND_URL || "").replace(/\/$/, "");
        const imageUrl = backendBase
          ? `${backendBase}/api/image-proxy?url=${encodeURIComponent(rawImage)}`
          : rawImage;
        
        return {
          _id: meal._id,
          name: title,
          Recipe_title: title,
          Calories: meal.Calories ?? meal.calories ?? 0,
          "Energy (kcal)": meal["Energy (kcal)"] ?? meal.Calories ?? meal.calories ?? 0,
          "Protein (g)": meal["Protein (g)"] ?? meal.protein ?? 0,
          protein: meal["Protein (g)"] ?? meal.protein ?? 0,
          ingredients: meal.ingredients || [],
          instructions: meal.instructions || "",
          Region: meal.Region || prefs.cuisine?.[0] || "Indian",
          vegan: meal.vegan,
          vegetarian: meal.vegetarian,
          pescetarian: meal.pescetarian,
          reasons: meal.reasons || [],
          img_url: imageUrl,
        };
      });

      console.log("📋 Processed recipes:", mealRecipes);
      console.log("📋 Recipe count:", mealRecipes.length);
      console.log("📋 First recipe:", mealRecipes[0]);
      setRecipes(mealRecipes);
      console.log("✅ Recipes stored in state");
    } catch (err) {
      console.error("❌ Error fetching meals:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch meals"
      );
      setRecipes([]);
    } finally {
      setLoading(false);
      console.log("⏹️ Loading complete");
    }
  };

  const handleAddToMeal = (recipe: Recipe) => {
    // Save to meal tracker
    const savedMeals = localStorage.getItem("flavourai.savedMeals");
    let meals = [];
    
    try {
      meals = savedMeals ? JSON.parse(savedMeals) : [];
    } catch {
      meals = [];
    }
    
    // Get diet tags from recipe
    const tags = [];
    const checkDiet = (value: any) => value === "1" || value === "1.0" || value === 1 || parseFloat(value) === 1.0;
    
    if (checkDiet(recipe.vegan)) tags.push("Vegan");
    if (checkDiet(recipe.vegetarian)) tags.push("Vegetarian");
    if (checkDiet(recipe.pescetarian)) tags.push("Pescetarian");
    if (recipe.reasons && recipe.reasons.length > 0) {
      tags.push(...recipe.reasons.slice(0, 2));
    }
    
    // Add region tag
    if (recipe.Region) tags.push(recipe.Region);
    
    const newMeal = {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      meal: recipe.Recipe_title || recipe.name || "Meal",
      calories: Number(recipe.Calories) || 0,
      note: "Added from Meal Suggestions",
      tags: tags.slice(0, 3),
    };
    
    // Add to beginning of array
    meals.unshift(newMeal);
    
    // Keep only last 10 meals
    meals = meals.slice(0, 10);
    
    localStorage.setItem("flavourai.savedMeals", JSON.stringify(meals));
    
    console.log("✅ Meal added to tracker:", newMeal);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    setSelectedRecipe(null);
  };

  // Debug current state
  console.log("🎨 MealSuggestion render - Loading:", loading, "| Recipes:", recipes.length, "| Error:", error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* SUCCESS NOTIFICATION */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Meal added to tracker!</span>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-8 h-8 text-orange-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              Your Personalized Meals
            </h1>
            <ChefHat className="w-8 h-8 text-orange-600" />
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover delicious recipes tailored to your preferences. Click any
            recipe to see full details, ingredients, and cooking instructions.
          </p>

          <div className="text-sm text-gray-500 pt-2">
            Powered by{" "}
            <span className="font-semibold text-orange-600">RecipeDB</span> •
            AI-curated for your health goals
          </div>

          <button
            onClick={() => navigate("/preferences")}
            className="mt-4 px-6 py-2 rounded-xl border border-orange-300 text-orange-600 font-semibold hover:bg-orange-50 transition"
          >
            Update Preferences
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
            <p className="text-gray-600 font-medium">
              Generating personalized meals...
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="flex items-center justify-center mb-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md w-full text-center">
              <div className="flex justify-center mb-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-900 font-semibold mb-2">No Meals Found</p>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <button
                onClick={() => navigate("/preferences")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                Update Preferences
              </button>
            </div>
          </div>
        )}

        {/* RECIPES GRID */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {recipes.map((recipe) => (
              <div
                key={recipe._id || recipe.Recipe_title}
                onClick={() => setSelectedRecipe(recipe)}
                className="cursor-pointer"
              >
                <MealCard
                  image={recipe.img_url}
                  name={recipe.Recipe_title || recipe.name || "Unknown"}
                  calories={recipe.Calories || 0}
                  protein={recipe["Protein (g)"] || recipe.protein || 0}
                />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && recipes.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <ChefHat className="w-12 h-12 text-gray-400" />
            <p className="text-gray-600 font-medium">
              No meals match your current preferences
            </p>
            <button
              onClick={() => navigate("/preferences")}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
            >
              Adjust Preferences
            </button>
          </div>
        )}

        {/* CTA */}
        {!loading && recipes.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-10 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 transition hover:scale-105 text-lg"
            >
              Continue to Dashboard →
            </button>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedRecipe && (
        <MealDetailModal
          meal={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToMeal={() => handleAddToMeal(selectedRecipe)}
        />
      )}
    </div>
  );
};

export default MealSuggestion;
