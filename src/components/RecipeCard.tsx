import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, Flame, Droplets, AlertCircle } from "lucide-react";

interface Ingredient {
  name: string;
  [key: string]: any;
}

interface Recipe {
  _id?: string;
  id?: string;
  Recipe_title?: string;
  name?: string;
  Calories?: string | number;
  calories?: string | number;
  "Energy (kcal)"?: string | number;
  cook_time?: string | number;
  prep_time?: string | number;
  servings?: string;
  Region?: string;
  region?: string;
  img_url?: string;
  ingredients?: Ingredient[];
  vegan?: string | number;
  pescetarian?: string | number;
  ovo_vegetarian?: string | number;
  lacto_vegetarian?: string | number;
  ovo_lacto_vegetarian?: string | number;
  reasons?: string[];
}

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Normalize fields (handle both naming conventions)
  const title = recipe.Recipe_title || recipe.name || "Unknown Recipe";
  const calories =
    recipe.Calories || recipe.calories || recipe["Energy (kcal)"] || "N/A";
  const cookTime = recipe.cook_time || "0";
  const prepTime = recipe.prep_time || "0";
  const region = recipe.Region || recipe.region || "International";
  const ingredients = recipe.ingredients || [];
  const imageUrl = recipe.img_url;

  // Check if vegan based on diet fields
  const isDietFriendly = {
    vegan: recipe.vegan === "1" || recipe.vegan === 1,
    vegetarian:
      recipe.lacto_vegetarian === "1" || recipe.lacto_vegetarian === 1,
    pescetarian: recipe.pescetarian === "1" || recipe.pescetarian === 1,
  };

  const totalTime = Number(prepTime) + Number(cookTime);
  const calorieValue = Number(String(calories).replace(/[^0-9.-]/g, ""));

  // Determine calorie level color
  const getCalorieColor = (cal: number) => {
    if (cal < 300) return "bg-green-50 border-green-200";
    if (cal < 500) return "bg-yellow-50 border-yellow-200";
    return "bg-orange-50 border-orange-200";
  };

  const calorieColor = getCalorieColor(calorieValue);

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <Card className="h-full cursor-pointer hover:shadow-2xl transition-all duration-300 hover:border-orange-400 hover:-translate-y-1 overflow-hidden flex flex-col group">
            {/* IMAGE */}
            <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
              {imageUrl && !imageError ? (
                <img
                  src={imageUrl}
                  alt={title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <Droplets className="w-16 h-16 text-white/80 mb-3" />
                  <p className="text-white font-bold text-sm line-clamp-3">{title}</p>
                </div>
              )}

              {/* CALORIES BADGE - Floating */}
              <div
                className={`absolute top-3 right-3 ${calorieColor} border rounded-lg p-2 shadow-lg backdrop-blur-sm`}
              >
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span className="font-bold text-orange-900 text-sm">
                    {calories}
                  </span>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <CardContent className="p-4 flex-1 flex flex-col space-y-3">
              {/* TITLE & REGION */}
              <div>
                <CardDescription className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  {region}
                </CardDescription>
                <h3 className="line-clamp-2 text-base font-bold text-gray-900">
                  {title}
                </h3>
              </div>

              {/* TIME INFO */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">
                  <span className="font-semibold">{totalTime}</span>
                  <span className="text-gray-500"> min</span>
                </span>
              </div>

              {/* DIET BADGES */}
              {(isDietFriendly.vegan ||
                isDietFriendly.vegetarian ||
                isDietFriendly.pescetarian) && (
                <div className="flex gap-2 flex-wrap">
                  {isDietFriendly.vegan && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 text-xs"
                    >
                      🌱 Vegan
                    </Badge>
                  )}
                  {isDietFriendly.vegetarian && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 text-xs"
                    >
                      🥬 Vegetarian
                    </Badge>
                  )}
                  {isDietFriendly.pescetarian && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 text-xs"
                    >
                      🐟 Pescetarian
                    </Badge>
                  )}
                </div>
              )}

              {/* REASONS if available */}
              {recipe.reasons && recipe.reasons.length > 0 && (
                <div className="text-xs text-gray-600 space-y-1 border-t pt-3">
                  {recipe.reasons.slice(0, 2).map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* HOVER HINT */}
              {ingredients.length > 0 && (
                <div className="text-xs text-orange-600 font-semibold pt-2">
                  ↑ Hover to see ingredients
                </div>
              )}
              
              {/* CLICK HINT */}
              <div className="text-xs text-center text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity pt-2 font-semibold">
                🖱️ Click to view full recipe
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>

        {/* TOOLTIP: INGREDIENTS */}
        {ingredients.length > 0 && (
          <TooltipContent className="w-72 max-h-96 overflow-y-auto bg-slate-900 border-orange-400">
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">📋 Ingredients:</h4>
              <ul className="space-y-2">
                {ingredients.map((ing, idx) => (
                  <li key={idx} className="text-sm text-gray-100 flex items-start gap-2">
                    <Droplets className="w-3 h-3 mt-1 flex-shrink-0 text-orange-400" />
                    <span className="capitalize">{ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
