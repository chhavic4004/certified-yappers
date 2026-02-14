import axios from "axios";

const BASE_URL = "http://cosylab.iiitd.edu.in:6969";
const API_KEY = "Bearer EakuMCplIpn3LWZuhhD9hN5PPZo4xaQ_EOAlgLS3bU8Fez7_";

const headers = {
  Authorization: API_KEY,
  "Content-Type": "application/json",
};

// 1️⃣ Cuisine
export const getRecipesByCuisine = (region: string, page = 1) =>
  axios.get(
    `${BASE_URL}/recipe2-api/recipes_cuisine/cuisine/${region}`,
    { params: { page, page_size: 10 }, headers }
  );

// 2️⃣ Diet
export const getRecipesByDiet = (diet: string) =>
  axios.get(
    `${BASE_URL}/recipe2-api/recipes_diet/${diet}`,
    { headers }
  );

// 3️⃣ Calories
export const getRecipesByCalories = (min: number, max: number) =>
  axios.get(
    `${BASE_URL}/recipe2-api/recipes_calories`,
    { params: { min, max }, headers }
  );

// 4️⃣ Protein
export const getRecipesByProtein = (min: number, max: number) =>
  axios.get(
    `${BASE_URL}/recipe2-api/recipes_protein`,
    { params: { min, max }, headers }
  );

// 5️⃣ Nutrition
export const getNutritionInfo = (id: string) =>
  axios.get(
    `${BASE_URL}/recipe2-api/recipe/nutrition/${id}`,
    { headers }
  );
