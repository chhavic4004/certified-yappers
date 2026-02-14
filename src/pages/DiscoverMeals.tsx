import MealCard from "@/components/MealCard";
import meal1 from "@/assets/meal-1.jpg";
import meal2 from "@/assets/meal-2.jpg";
import meal4 from "@/assets/meal-4.jpg";

const trending = [
  { image: meal1, name: "Herb Chicken", calories: 410, protein: 30 },
  { image: meal2, name: "Vegan Bowl", calories: 320, protein: 14 },
  { image: meal4, name: "Tuna Plate", calories: 390, protein: 35 },
];

const DiscoverMeals = () => {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Trending Healthy Meals
      </h1>

      <div className="grid grid-cols-3 gap-10">
        {trending.map((m, i) => (
          <MealCard key={i} {...m} />
        ))}
      </div>

    </div>
  );
};

export default DiscoverMeals;
