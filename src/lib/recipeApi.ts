const BASE_URL = "https://api.foodoscope.com/recipe2-api";

export const fetchRecipesByIngredients = async (ingredients: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/byingredients?ingredients=${ingredients}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_RECIPE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch recipes");
    }

    return await res.json();
  } catch (err) {
    console.error("Recipe API Error:", err);
    return [];
  }
};
