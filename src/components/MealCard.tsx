interface Props {
  image: string;
  name: string;
  calories: number | string;
  protein: number | string;
  reason?: string[];
}

const MealCard = ({ image, name, calories, protein }: Props) => {
  return (
    <div className="group cursor-pointer">

      <div className="rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition">
        <img src={image} className="w-48 h-48 object-cover" />
      </div>

      <h3 className="mt-4 font-semibold text-center">{name}</h3>

      <p className="text-sm text-gray-500 text-center">
        🔥 {calories} cal • 💪 {protein}g
      </p>

      {/* Hover */}
      <button className="opacity-0 group-hover:opacity-100 transition mt-3 w-full bg-orange-500 text-white py-2 rounded-xl">
        Add to Meal
      </button>

    </div>
  );
};

export default MealCard;
