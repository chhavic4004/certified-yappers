interface Props {
  image: string;
  name: string;
  calories: number | string;
  protein: number | string;
  reason?: string[];
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

      <div className="rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition">
        <img src={image} className="w-48 h-48 object-cover" />
      </div>

      <h3 className="mt-4 font-semibold text-center">{name}</h3>

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

    </div>
  );
};

export default MealCard;
