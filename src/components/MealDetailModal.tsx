import { useState } from "react";
import { X, Flame, Beef, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MealDetailModalProps {
  meal: {
    _id?: string;
    Recipe_title?: string;
    name?: string;
    img_url?: string;
    image?: string;
    Calories?: string | number;
    calories?: string | number;
    "Energy (kcal)"?: string | number;
    "Protein (g)"?: string | number;
    "Total lipid (fat) (g)"?: string | number;
    "Carbohydrate, by difference (g)"?: string | number;
    protein?: number | string;
    ingredients?: Array<{ name: string }>;
    instructions?: string;
    Region?: string;
    vegan?: string | number;
    vegetarian?: string | number;
    pescetarian?: string | number;
    reasons?: string[];
    [key: string]: any;
  };
  onClose: () => void;
  onAddToMeal?: () => void;
}

export const MealDetailModal = ({ meal, onClose, onAddToMeal }: MealDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("ingredients");
  const [imageError, setImageError] = useState(false);

  const title = meal.Recipe_title || meal.name || "Recipe";
  const imageUrl = meal.img_url || meal.image;
  const caloriesVal = meal.Calories || meal.calories || meal["Energy (kcal)"] || 0;
  const proteinVal =
    meal["Protein (g)"] || meal.protein || 0;
  const fatVal = meal["Total lipid (fat) (g)"] || 0;
  const carbsVal = meal["Carbohydrate, by difference (g)"] || 0;

  const calorieNum = Number(String(caloriesVal).replace(/[^0-9.-]/g, ""));
  const proteinNum = Number(String(proteinVal).replace(/[^0-9.-]/g, ""));
  const fatNum = Number(String(fatVal).replace(/[^0-9.-]/g, ""));
  const carbsNum = Number(String(carbsVal).replace(/[^0-9.-]/g, ""));

  const getCalorieColor = (cal: number) => {
    if (cal < 300) return "bg-green-100 border-green-300 text-green-900";
    if (cal < 500) return "bg-yellow-100 border-yellow-300 text-yellow-900";
    return "bg-orange-100 border-orange-300 text-orange-900";
  };

  const getDietBadges = () => {
    const badges = [];
    const checkDiet = (value: any) => value === "1" || value === "1.0" || value === 1 || parseFloat(value) === 1.0;
    
    if (checkDiet(meal.vegan))
      badges.push(
        <Badge key="vegan" className="bg-green-600 hover:bg-green-700 text-white">
          🌱 Vegan
        </Badge>
      );
    if (checkDiet(meal.ovo_lacto_vegetarian) || checkDiet(meal.vegetarian))
      badges.push(
        <Badge key="veg" className="bg-green-600 hover:bg-green-700 text-white">
          🥬 Vegetarian
        </Badge>
      );
    if (checkDiet(meal.pescetarian))
      badges.push(
        <Badge key="pesc" className="bg-blue-600 hover:bg-blue-700 text-white">
          🐟 Pescetarian
        </Badge>
      );
    return badges;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* HEADER WITH CLOSE */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-white border-b border-orange-100 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            {meal.Region && <p className="text-sm text-gray-500 mt-1">🥘 {meal.Region}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* IMAGE - ALWAYS SHOW */}
          <div className="rounded-2xl overflow-hidden h-64 relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="text-8xl mb-4">🍽️</div>
                <h3 className="text-white text-2xl font-bold">{title}</h3>
              </div>
            )}
          </div>

          {/* DIET BADGES - PROMINENT */}
          <div className="flex gap-2 flex-wrap">
            {getDietBadges().length > 0 ? getDietBadges() : (
              <span className="text-sm text-gray-500">No diet preferences matched</span>
            )}
          </div>

          {/* QUICK INFO SECTION */}
          <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl">
            <div className="text-center">
              <p className="text-xs text-gray-600 font-semibold mb-1">SERVINGS</p>
              <p className="text-lg font-bold text-gray-900">1</p>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <p className="text-xs text-gray-600 font-semibold mb-1">DIFFICULTY</p>
              <p className="text-lg font-bold text-gray-900">Easy</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 font-semibold mb-1">PREP TIME</p>
              <p className="text-lg font-bold text-gray-900">Quick</p>
            </div>
          </div>

          {/* NUTRITION GRID */}
          <div className="grid grid-cols-2 gap-4">
            {/* CALORIES with color coding */}
            <div
              className={`p-4 rounded-xl border-2 ${getCalorieColor(
                calorieNum
              )}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5" />
                <span className="text-sm font-semibold text-gray-700">Calories</span>
              </div>
              <p className="text-3xl font-bold">{calorieNum}</p>
              <p className="text-xs mt-2 opacity-70 font-medium">
                {calorieNum < 300
                  ? "Low Calorie"
                  : calorieNum < 500
                    ? "Moderate"
                    : "High Calorie"}
              </p>
            </div>

            {/* PROTEIN */}
            <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <Beef className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-red-900">Protein</span>
              </div>
              {proteinNum > 0 ? (
                <>
                  <p className="text-3xl font-bold text-red-900">{proteinNum}g</p>
                  <p className="text-xs mt-2 opacity-70 font-medium text-red-800">
                    {proteinNum < 15 ? "Low" : proteinNum < 30 ? "Good" : "High"}
                  </p>
                </>
              ) : (
                <p className="text-lg text-red-700 italic">Data unavailable</p>
              )}
            </div>

            {/* CARBS - only show if > 0 */}
            {carbsNum > 0 && (
              <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                <span className="text-sm font-semibold text-blue-900">Carbs</span>
                <p className="text-3xl font-bold text-blue-900 mt-1">{carbsNum}g</p>
              </div>
            )}

            {/* FAT - only show if > 0 */}
            {fatNum > 0 && (
              <div className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50">
                <span className="text-sm font-semibold text-purple-900">Fat</span>
                <p className="text-3xl font-bold text-purple-900 mt-1">{fatNum}g</p>
              </div>
            )}
          </div>

          {/* NUTRITIONAL BREAKDOWN */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <p className="font-bold text-blue-900 mb-3">Nutritional Breakdown</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-blue-900">Calories</span>
                  <span className="text-sm font-bold text-blue-900">{calorieNum} kcal</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(calorieNum / 10, 100)}%` }}
                  />
                </div>
              </div>
              {proteinNum > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-red-900">Protein</span>
                    <span className="text-sm font-bold text-red-900">{proteinNum}g</span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${Math.min(proteinNum / 0.3, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {carbsNum > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-amber-900">Carbs</span>
                    <span className="text-sm font-bold text-amber-900">{carbsNum}g</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full"
                      style={{ width: `${Math.min(carbsNum / 2, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {fatNum > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-purple-900">Fat</span>
                    <span className="text-sm font-bold text-purple-900">{fatNum}g</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min(fatNum / 0.5, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="ingredients" className="rounded font-semibold">📋 Ingredients</TabsTrigger>
              <TabsTrigger value="recipe" className="rounded font-semibold">👨‍🍳 Recipe</TabsTrigger>
            </TabsList>

            {/* INGREDIENTS TAB */}
            <TabsContent value="ingredients" className="space-y-3 mt-4">
              {meal.ingredients && meal.ingredients.length > 0 ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🛒</span>
                    <h3 className="font-bold text-green-900 text-lg">Shopping List</h3>
                    <Badge variant="secondary" className="ml-auto bg-green-600 text-white">
                      {meal.ingredients.length} items
                    </Badge>
                  </div>
                  <ul className="space-y-3">
                    {meal.ingredients.map((ing: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg hover:bg-white/90 transition">
                        <span className="text-green-600 font-bold text-lg mt-0.5">✓</span>
                        <span className="capitalize text-gray-800 font-medium flex-1">
                          {ing.name || ing}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{idx + 1}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="py-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-6xl mb-4">🥘</div>
                  <p className="text-gray-500 font-semibold mb-2">📌 Ingredient details coming soon</p>
                  <p className="text-gray-400 text-sm">Check the Recipe tab for cooking instructions</p>
                </div>
              )}
            </TabsContent>

            {/* RECIPE TAB */}
            <TabsContent value="recipe" className="space-y-3 mt-4">
              {meal.instructions ? (
                <div className="space-y-4 bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">👨‍🍳</span>
                    <h3 className="text-lg font-bold text-orange-900">Step-by-Step Instructions</h3>
                  </div>
                  {meal.instructions.split(/\|\||\n|\./g).filter(Boolean).map((step: string, idx: number) => {
                    const trimmed = step.trim();
                    return trimmed ? (
                      <div key={idx} className="flex gap-4 p-4 bg-white/80 rounded-lg hover:bg-white transition pb-4 last:pb-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-bold flex items-center justify-center shadow-md">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-gray-800 leading-relaxed pt-2 font-medium flex-1">
                          {trimmed.charAt(0).toUpperCase() + trimmed.slice(1)}
                        </p>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="py-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-500 font-semibold">Recipe instructions coming soon</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* REASONS - ENHANCED */}
          {meal.reasons && meal.reasons.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Info className="w-6 h-6 text-orange-600 mt-0.5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-orange-900 mb-3 text-base">
                    Why This Meal?
                  </p>
                  <ul className="space-y-2">
                    {meal.reasons.map((reason: string, idx: number) => (
                      <li key={idx} className="text-orange-900 text-sm font-medium flex items-start gap-2">
                        <span className="text-orange-600 font-bold mt-0.5">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTON */}
          <Button
            onClick={onAddToMeal}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold py-3 rounded-xl text-lg"
          >
            Add To My Meal
          </Button>
        </div>
      </div>
    </div>
  );
};
