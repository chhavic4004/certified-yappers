import axios from "axios";
import { BACKEND_URL } from "@/services/api";

// 🔥 MAIN: Get meals based on preferences
export const getMealSuggestions = (preferences: {
  cuisine?: string;
  diet?: string;
  caloriesMin?: number;
  caloriesMax?: number;
  proteinMin?: number;
  proteinMax?: number;
  goals?: string[];
  health?: string[];
  allergies?: string[];
}) =>
  axios.post(`${BACKEND_URL}/api/meals`, preferences);

// 1️⃣ Cuisine
export const getRecipesByCuisine = (region: string) =>
  axios.get(
    `${BACKEND_URL}/api/recipes/cuisine/${encodeURIComponent(region)}`
  );

// 2️⃣ Diet + Region
export const getRecipesByDiet = (diet: string, region?: string) =>
  axios.get(
    `${BACKEND_URL}/api/recipes/diet/${encodeURIComponent(diet)}`,
    { params: region ? { region } : {} }
  );

// 3️⃣ Search by Title
export const getRecipesByTitle = (title: string) =>
  axios.get(
    `${BACKEND_URL}/api/recipes/title`,
    { params: { title } }
  );

// 4️⃣ Recipe Instructions
export const getRecipeInstructions = (recipeId: string) =>
  axios.get(
    `${BACKEND_URL}/api/recipes/instructions/${encodeURIComponent(recipeId)}`
  );

// 5️⃣ Recipe of the Day
export const getRecipeOfDay = () =>
  axios.get(`${BACKEND_URL}/api/recipes/recipeofday`);

// 6️⃣ Recipe of the Day with Exclusions
export const getRecipeOfDayWithExclusions = (
  excludeIngredients?: string[],
  excludeCategories?: string[]
) =>
  axios.get(
    `${BACKEND_URL}/api/recipes/recipeofday/with-ingredients-categories`,
    { 
      params: {
        excludeIngredients: excludeIngredients?.join(","),
        excludeCategories: excludeCategories?.join(","),
      }
    }
  );
