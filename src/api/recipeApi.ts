import axios from "axios";
import { BACKEND_URL } from "@/services/api";

// Uses deployed backend proxy - avoids CORS, works in production
const BASE_URL = `${BACKEND_URL}/api/recipe`;

// 1️⃣ Cuisine
export const getRecipesByCuisine = (region: string, page = 1) =>
  axios.get(`${BASE_URL}/cuisine/${encodeURIComponent(region)}`, {
    params: { page, page_size: 10 },
  });

// 2️⃣ Diet
export const getRecipesByDiet = (diet: string) =>
  axios.get(`${BASE_URL}/diet/${encodeURIComponent(diet)}`);

// 3️⃣ Calories
export const getRecipesByCalories = (min: number, max: number) =>
  axios.get(`${BASE_URL}/calories`, { params: { min, max } });

// 4️⃣ Protein
export const getRecipesByProtein = (min: number, max: number) =>
  axios.get(`${BASE_URL}/protein`, { params: { min, max } });

// 5️⃣ Nutrition
export const getNutritionInfo = (id: string) =>
  axios.get(`${BASE_URL}/nutrition/${encodeURIComponent(id)}`);
