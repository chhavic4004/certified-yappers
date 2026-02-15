<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getMealSuggestions, getRecipesByDiet } from "@/api/recipeApi";
import { RecipeCard } from "@/components/RecipeCard";
import { MealDetailModal } from "@/components/MealDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, Check } from "lucide-react";

interface Recipe {
  _id?: string;
  id?: string;
  Recipe_title?: string;
  name?: string;
  Calories?: string | number;
  calories?: string | number;
  cook_time?: string | number;
  prep_time?: string | number;
  servings?: string;
  Region?: string;
  region?: string;
  ingredients?: { name: string }[];
  reasons?: string[];
  [key: string]: any;
}

interface Preferences {
  cuisine?: string[];
  diet?: string[];
  caloriesMin?: number;
  caloriesMax?: number;
  proteinMin?: number;
  proteinMax?: number;
  goals?: string[];
  health?: string[];
  allergies?: string[];
}

const DiscoverMeals = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "diet">("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Ensure we have default preferences
  useEffect(() => {
    const testPrefs = localStorage.getItem("flavourai.preferences");
    if (!testPrefs) {
      console.log("⚠️ No preferences found in DiscoverMeals, setting defaults...");
      localStorage.setItem("flavourai.preferences", JSON.stringify({
        cuisine: ["Indian"],
        diet: ["Vegan"],
        goals: [],
        allergies: [],
        health: []
      }));
    }
  }, []);

  // Load preferences from storage
  const preferences: Preferences = JSON.parse(
    localStorage.getItem("flavourai.preferences") || "{}"
  );

  const cuisine = preferences?.cuisine?.[0] || "Indian";
  const diet = preferences?.diet?.[0] || null;

  const fetchRecipes = async () => {
>>>>>>> origin/main
    try {
      setLoading(true);
      setError("");

<<<<<<< HEAD
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
=======
      console.log("🔍DiscoverMeals - Fetching recipes...");
      console.log("📦 Preferences:", preferences);
      console.log("🏷️ Filter Mode:", filterMode);
      console.log("🍽️ Dataset:", diet || "All");

      let response;

      if (filterMode === "diet" && diet) {
        // Use diet filter with region
        console.log(`🔎 Calling getRecipesByDiet("${diet}", "${cuisine}")`);
        response = await getRecipesByDiet(diet, cuisine);
      } else {
        // Use meal suggestions endpoint with all preferences
        console.log("🔎 Calling getMealSuggestions with full preferences");
        response = await getMealSuggestions({
          cuisine,
          diet: diet || undefined,
          caloriesMin: preferences.caloriesMin,
          caloriesMax: preferences.caloriesMax,
          proteinMin: preferences.proteinMin,
          proteinMax: preferences.proteinMax,
          goals: preferences.goals,
          health: preferences.health,
          allergies: preferences.allergies,
        });
      }

      console.log("✅ API Response:", response.data);
      const data = response.data;
      const recipeList = (data?.data || data?.meals || data?.results || []) as Recipe[];
      
      console.log("📊 Recipe count:", recipeList.length);
      console.log("📝 First recipe:", recipeList[0]);

      setRecipes(recipeList.slice(0, 12)); // Limit to 12 for clean grid
      console.log("✅ Recipes set in state");
    } catch (err) {
      console.error("❌ Recipe fetch error:", err);
      setError("Failed to load recipes. Please try again.");
    } finally {
      setLoading(false);
      console.log("⏹️ Loading complete");
>>>>>>> origin/main
    }
  };

  useEffect(() => {
<<<<<<< HEAD
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
=======
    fetchRecipes();
  }, [filterMode]);

  console.log("🎨 DiscoverMeals RENDER - Loading:", loading, "| Recipes:", recipes.length, "| Error:", error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* SUCCESS NOTIFICATION */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Meal added to tracker!</span>
          </div>
        )}
        
        {/* HEADER */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">Discover Recipes 🍽️</h1>
          <p className="text-lg text-gray-600">
            Browse delicious recipes tailored to your preferences. Hover over any recipe to see its ingredients!
          </p>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-3 items-center pt-4">
            <span className="text-sm font-semibold text-gray-700">Filters:</span>
            
            <Badge variant={filterMode === "all" ? "default" : "outline"} 
              className="cursor-pointer" 
              onClick={() => setFilterMode("all")}>
              All Recipes
            </Badge>
            
            {diet && (
              <Badge variant={filterMode === "diet" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterMode("diet")}>
                {diet} Only
              </Badge>
            )}

            <Badge variant="secondary" className="ml-auto">
              {cuisine} Cuisine
            </Badge>
          </div>
>>>>>>> origin/main
        </div>

        {/* LOADING */}
        {loading && (
<<<<<<< HEAD
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"/>
            <p className="mt-4 text-gray-500">
              Finding delicious meals for you...
            </p>
=======
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
            <p className="text-gray-600 font-medium">Finding delicious recipes...</p>
>>>>>>> origin/main
          </div>
        )}

        {/* ERROR */}
        {error && (
<<<<<<< HEAD
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
=======
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-6 rounded-2xl text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Failed to load recipes</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={fetchRecipes}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && recipes.length === 0 && !error && (
          <div className="text-center py-20 space-y-4">
            <p className="text-xl text-gray-600">No recipes match your filters</p>
            <Button onClick={() => setFilterMode("all")} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* RECIPES GRID */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe._id || recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        {!loading && recipes.length > 0 && (
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              Showing {recipes.length} recipes • 
              <button 
                onClick={fetchRecipes} 
                className="text-orange-600 hover:text-orange-700 font-semibold ml-2"
              >
                Refresh
              </button>
            </p>
          </div>
        )}
      </div>

      {/* MEAL DETAIL MODAL */}
      {selectedRecipe && (
        <MealDetailModal
          meal={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToMeal={() => {
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
            
            if (checkDiet(selectedRecipe.vegan)) tags.push("Vegan");
            if (checkDiet(selectedRecipe.vegetarian)) tags.push("Vegetarian");
            if (checkDiet(selectedRecipe.pescetarian)) tags.push("Pescetarian");
            if (selectedRecipe.reasons && selectedRecipe.reasons.length > 0) {
              tags.push(...selectedRecipe.reasons.slice(0, 2));
            }
            
            // Add region tag
            if (selectedRecipe.Region || selectedRecipe.region) {
              tags.push(selectedRecipe.Region || selectedRecipe.region);
            }
            
            const newMeal = {
              date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              meal: selectedRecipe.Recipe_title || selectedRecipe.name || "Meal",
              calories: Number(selectedRecipe.Calories || selectedRecipe.calories) || 0,
              note: "Added from Discover Meals",
              tags: tags.slice(0, 3),
            };
            
            // Add to beginning of array
            meals.unshift(newMeal);
            
            // Keep only last 10 meals
            meals = meals.slice(0, 10);
            
            localStorage.setItem("flavourai.savedMeals", JSON.stringify(meals));
            
            console.log("✅ Meal added to tracker:", newMeal);
            
            // Show success notification
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
            setSelectedRecipe(null);
          }}
        />
      )}
>>>>>>> origin/main
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
