import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- OPTIONS ---------- */

const health = [
  "Diabetes",
  "PCOS",
  "Hypertension",
  "Thyroid",
  "Cholesterol",
  "Heart Health",
  "None",
];

const diet = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "High Protein",
  "Low Carb",
  "Mediterranean",
];

const goals = [
  "Lose Weight",
  "Gain Muscle",
  "Eat Clean",
  "Boost Energy",
  "Improve Digestion",
  "Balance Hormones",
];

const cuisine = [
  "Indian",
  "Asian",
  "Mediterranean",
  "Mexican",
  "Italian",
  "Continental",
];

/* ---------- COMPONENT ---------- */

const PreferenceSetup = () => {
  const navigate = useNavigate();

  const storageKey = "flavourai.preferences";

  const [selected, setSelected] = useState({
    health: [] as string[],
    diet: [] as string[],
    goals: [] as string[],
    cuisine: [] as string[],
    allergies: "",
    activity: "",
    age: "",
    caloriesMin: "",
    caloriesMax: "",
    proteinMin: "",
    proteinMax: "",
  });

  /* ---------- TOGGLE ---------- */

  const toggle = (category: keyof typeof selected, value: string) => {
    if (!Array.isArray(selected[category])) return;

    setSelected((prev) => {
      const arr = prev[category] as string[];
      const exists = arr.includes(value);

      if (category === "cuisine" || category === "diet") {
        return {
          ...prev,
          [category]: exists ? [] : [value],
        };
      }

      return {
        ...prev,
        [category]: exists ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  /* ---------- PROGRESS ---------- */

  const sections = [
    selected.health.length,
    selected.diet.length,
    selected.goals.length,
    selected.cuisine.length,
    selected.age,
    selected.activity,
  ];

  const progress =
    (sections.filter(Boolean).length / sections.length) * 100;

  const handleGenerate = () => {
    const payload = {
      ...selected,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));
    navigate("/suggestions");
  };

  /* ---------- PREMIUM TOGGLE CARD ---------- */

  const ToggleCard = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`
        cursor-pointer
        p-5
        rounded-2xl
        border
        transition-all duration-300
        
        ${
          active
            ? "border-orange-500 bg-orange-50 shadow-lg scale-[1.03]"
            : "border-gray-200 hover:border-orange-300 hover:shadow-md hover:scale-[1.02]"
        }
      `}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">
          {label}
        </span>

        <div
          className={`
            w-6 h-6 flex items-center justify-center
            rounded-full text-sm font-bold
            ${
              active
                ? "bg-orange-500 text-white"
                : "border border-gray-300"
            }
          `}
        >
          {active && "✓"}
        </div>
      </div>
    </div>
  );

  /* ---------- SECTION ---------- */

  const Section = ({
    title,
    items,
    category,
  }: {
    title: string;
    items: string[];
    category: keyof typeof selected;
  }) => (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
      <h3 className="font-semibold mb-4 text-lg">{title}</h3>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <ToggleCard
            key={item}
            label={item}
            active={(selected[category] as string[]).includes(item)}
            onClick={() => toggle(category, item)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-10">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">
          Personalize Your FlavorAI Experience
        </h1>

        <p className="text-gray-500 mb-8">
          The more we know, the smarter your meals become.
        </p>

        {/* PROGRESS */}
        <div className="mb-10">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-600">
              Profile Completion
            </span>

            <span className="font-semibold text-orange-500">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 h-3 rounded-full">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          <Section title="Health Condition" items={health} category="health" />
          <Section title="Diet Preference" items={diet} category="diet" />
          <Section title="Your Goal" items={goals} category="goals" />
          <Section title="Cuisine Preference" items={cuisine} category="cuisine" />

        </div>

        {/* DROPDOWNS — PREMIUM TOUCH */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <select
            className="p-4 border rounded-xl"
            onChange={(e) =>
              setSelected({ ...selected, age: e.target.value })
            }
          >
            <option value="">Select Age Group</option>
            <option>18-25</option>
            <option>26-35</option>
            <option>36-50</option>
            <option>50+</option>
          </select>

          <select
            className="p-4 border rounded-xl"
            onChange={(e) =>
              setSelected({ ...selected, activity: e.target.value })
            }
          >
            <option value="">Activity Level</option>
            <option>Sedentary</option>
            <option>Moderate</option>
            <option>Active</option>
            <option>Athlete</option>
          </select>

          <input
            placeholder="Allergies (optional)"
            className="p-4 border rounded-xl"
            onChange={(e) =>
              setSelected({ ...selected, allergies: e.target.value })
            }
          />

        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-6">
          <input
            type="number"
            min={0}
            placeholder="Min Calories"
            className="p-4 border rounded-xl"
            onChange={(e) =>
              setSelected({ ...selected, caloriesMin: e.target.value })
            }
          />
          <input
            type="number"
            min={0}
            placeholder="Max Calories"
            className="p-4 border rounded-xl"
            onChange={(e) =>
              setSelected({ ...selected, caloriesMax: e.target.value })
            }
          />
          <input
            type="number"
            min={0}
            placeholder="Min Protein (g)"
            className="p-4 border rounded-xl"
            onChange={(e) =>
              setSelected({ ...selected, proteinMin: e.target.value })
            }
          />
          <input
            type="number"
            min={0}
            placeholder="Max Protein (g)"
            className="p-4 border rounded-xl"
            onChange={(e) =>
              setSelected({ ...selected, proteinMax: e.target.value })
            }
          />
        </div>

        {/* CTA */}
        <button
          disabled={progress < 80}
          onClick={handleGenerate}
          className="
            mt-12
            w-full
            py-4
            rounded-xl
            font-semibold
            text-white
            bg-gradient-to-r from-orange-400 to-orange-600
            hover:from-orange-500 hover:to-orange-700
            shadow-lg
            transition
            hover:scale-[1.02]
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          Generate My Smart Meals →
        </button>

      </div>
    </div>
  );
};

export default PreferenceSetup;
