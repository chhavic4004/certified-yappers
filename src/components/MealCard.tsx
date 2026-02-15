import React, { useEffect, useState } from "react";
import { Flame, Beef, Droplets } from "lucide-react";

interface Props {
  image?: string;
  name: string;
  calories: number | string;
  protein: number | string;
  reason?: string[];
<<<<<<< HEAD
  ingredients?: string[] | string;
  recipe?: string;
}

const MealCard = ({ image, name, calories, protein, ingredients }: Props) => {
  // Parse ingredients if it's a string
  const ingredientList = Array.isArray(ingredients)
    ? ingredients
    : typeof ingredients === "string"
    ? ingredients.split(",").map((i) => i.trim())
    : [];

  return (
    <div className="group cursor-pointer">
=======
}

const MealCard = ({ image, name, calories, protein }: Props) => {
  const [imageError, setImageError] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const calorieNum = Number(String(calories).replace(/[^0-9.-]/g, ""));
>>>>>>> origin/main

  const getCalorieColor = (cal: number) => {
    if (cal < 300) return "bg-green-50 border-green-200";
    if (cal < 500) return "bg-yellow-50 border-yellow-200";
    return "bg-orange-50 border-orange-200";
  };

  useEffect(() => {
    setImageError(false);
    setLoadedSrc(null);
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      setLoadedSrc(image);
      setImageError(false);
    };
    img.onerror = () => {
      setLoadedSrc(null);
      setImageError(true);
    };
    img.src = image;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [image]);

  return (
    <div className="group cursor-pointer h-full flex flex-col transform transition-all duration-300 hover:scale-105">
      {/* IMAGE CONTAINER - Rounded Square */}
      <div className="relative rounded-3xl overflow-hidden shadow-md group-hover:shadow-xl transition h-48 w-full flex-shrink-0">
        {loadedSrc && !imageError ? (
          <img
            src={loadedSrc}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center p-4">
            <div className="text-center">
              <Droplets className="w-16 h-16 text-white/80 mx-auto mb-2" />
              <p className="text-white font-bold text-sm line-clamp-2">{name}</p>
            </div>
          </div>
        )}
        
        {/* CALORIE BADGE - Top right overlay */}
        <div className={`absolute top-3 right-3 ${getCalorieColor(calorieNum)} border rounded-lg px-3 py-1 shadow-lg backdrop-blur-sm`}>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="font-bold text-orange-900 text-sm">{calories}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4 space-y-2 flex-1 flex flex-col">
        <h3 className="font-bold text-center text-base line-clamp-2 group-hover:text-orange-600 transition">{name}</h3>

<<<<<<< HEAD
      <p className="text-sm text-gray-500 text-center">
        🔥 {calories} cal • 💪 {protein}g
      </p>

      {/* Ingredients */}
      {ingredientList.length > 0 && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-600 font-medium">
            {ingredientList.slice(0, 3).join(", ")}
            {ingredientList.length > 3 && "..."}
          </p>
        </div>
      )}

      {/* Hover */}
      <button className="opacity-0 group-hover:opacity-100 transition mt-3 w-full bg-orange-500 text-white py-2 rounded-xl">
        Add to Meal
      </button>
=======
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Beef className="w-4 h-4 text-red-500" />
            <span className="font-semibold">{protein}g</span>
          </div>
        </div>
>>>>>>> origin/main

        {/* Hover Button */}
        <button className="opacity-0 group-hover:opacity-100 transition-all mt-auto w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-2 rounded-xl text-sm font-semibold hover:scale-[1.02] shadow-lg">
          View Recipe →
        </button>
      </div>
    </div>
  );
};

export default MealCard;
