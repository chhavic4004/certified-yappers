import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

/* ---------------- DATA ---------------- */

// 12 weeks style heatmap
const heatmap = Array.from({ length: 84 });

const calories = [1800, 2100, 1750, 1950, 2200, 2000, 1850];
const protein = [70, 82, 90, 76, 88, 92, 85];

/* ---------------- COMPONENT ---------------- */

const MealTracker = () => {
  const { user } = useAuth();
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "you";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const [preferences, setPreferences] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("flavourai.preferences");
    if (!stored) {
      setPreferences(null);
      return;
    }

    try {
      setPreferences(JSON.parse(stored));
    } catch (error) {
      setPreferences(null);
    }
  }, []);

  const preferenceTags = useMemo(() => {
    if (!preferences) return [] as string[];

    const tags: string[] = [];
    if (preferences.diet?.length) tags.push(...preferences.diet);
    if (preferences.goals?.length) tags.push(...preferences.goals);
    if (preferences.cuisine?.length) tags.push(...preferences.cuisine);
    if (preferences.health?.length) tags.push(...preferences.health);
    if (preferences.activity) tags.push(`Activity: ${preferences.activity}`);
    if (preferences.allergies) tags.push(`Allergy: ${preferences.allergies}`);

    return tags.slice(0, 10);
  }, [preferences]);

  const mealHistory = useMemo(
    () => [
      {
        date: "Feb 12",
        meal: "Grilled Salmon Bowl",
        calories: 420,
        note: "Post-workout recovery",
        tags: ["High Protein", "Omega-3", "Low Sugar"],
      },
      {
        date: "Feb 10",
        meal: "Mediterranean Salad",
        calories: 350,
        note: "Light dinner",
        tags: ["Low Carb", "Fresh Ingredients", "Anti-Inflammatory"],
      },
      {
        date: "Feb 08",
        meal: "Buddha Power Bowl",
        calories: 380,
        note: "High fiber lunch",
        tags: ["Plant Protein", "Gut Friendly", "High Fiber"],
      },
    ],
    []
  );

  const getColor = () => {
    const colors = [
      "bg-green-100",
      "bg-green-300",
      "bg-green-500",
      "bg-green-700"
    ];
    return colors[Math.floor(Math.random() * 4)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex justify-center px-6 py-10">

      {/* MAIN PREMIUM BOX */}
      <div className="w-full max-w-7xl bg-white rounded-3xl border border-orange-100 p-10 space-y-12">


        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold">
              Nutrition Intelligence 📊
            </h1>

            <p className="text-gray-500 mt-2 max-w-2xl">
              A deep look into your eating consistency, macro balance,
              and behavioral nutrition patterns for {displayName}. These insights help
              FlavorAI optimize your long-term metabolic health.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white border rounded-2xl px-4 py-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
                {avatarInitial}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="font-semibold text-gray-800 break-words max-w-[220px]">
                {user?.email || displayName}
              </p>
            </div>
          </div>
        </div>



        {/* ================= METRICS ================= */}
        <div className="grid md:grid-cols-4 gap-6">

          <Metric
            title="Avg Calories"
            value="1,920 kcal"
            desc="Very close to your ideal range — excellent dietary control."
          />

          <Metric
            title="Protein Avg"
            value="86g"
            desc="Above recommended intake. Supports muscle recovery."
          />

          <Metric
            title="Meals Logged"
            value="142"
            desc="High logging frequency improves AI accuracy."
          />

          <Metric
            title="Consistency"
            value="89%"
            desc="You're building strong nutrition habits."
          />

        </div>



        {/* ================= DETAILED ANALYSIS ================= */}
        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-xl font-bold mb-2">
            Detailed Nutrition Analysis
          </h2>

          <p className="text-gray-500 mb-6 max-w-2xl">
            Granular insights based on your latest meals, macros, and timing patterns.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <AnalysisCard
              title="Protein Timing"
              value="72%"
              desc="Most protein consumed at lunch and dinner, aligning with recovery windows."
            />

            <AnalysisCard
              title="Carb Quality"
              value="A-"
              desc="Whole grains and complex carbs dominate 4 days of the week."
            />

            <AnalysisCard
              title="Hydration"
              value="1.9L"
              desc="Below the optimal 2.5L target. Adding 2 glasses/day helps."
            />

            <AnalysisCard
              title="Late Eating"
              value="2 nights"
              desc="Late dinners on weekends slightly reduce sleep quality."
            />

            <AnalysisCard
              title="Micronutrient"
              value="82%"
              desc="Vegetable diversity is solid; add leafy greens twice/week."
            />

            <AnalysisCard
              title="Streak"
              value="11 days"
              desc="Consistent logging improves AI recommendations and accuracy."
            />
          </div>

        </div>



        {/* ================= HEATMAP ================= */}
        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-xl font-bold mb-2">
            Meal Consistency Heatmap
          </h2>

          <p className="text-gray-500 mb-6 max-w-2xl">
            Each square represents a day.  
            Darker greens indicate stronger adherence to your
            nutrition targets.
          </p>

          {/* KEY */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            Less Active
            <div className="w-4 h-4 bg-green-100 rounded"/>
            <div className="w-4 h-4 bg-green-300 rounded"/>
            <div className="w-4 h-4 bg-green-500 rounded"/>
            <div className="w-4 h-4 bg-green-700 rounded"/>
            Highly Consistent
          </div>

          {/* GitHub-style layout */}
          <div className="overflow-x-auto pb-2">
            <div className="grid grid-rows-7 grid-flow-col gap-[4px] w-max">
              {heatmap.map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm ${getColor()}`}
                />
              ))}
            </div>
          </div>

        </div>



        {/* ================= BAR CHART ================= */}
        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-xl font-bold mb-2">
            Weekly Calorie Trend
          </h2>

          <p className="text-gray-500 mb-6 max-w-2xl">
            This chart highlights how your calorie intake fluctuates
            week-to-week. Stable patterns usually correlate with
            improved metabolic efficiency.
          </p>

          <div className="flex items-end gap-5 h-48">

            {calories.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-2">

                <div
                  className="w-12 bg-orange-500 rounded-xl hover:bg-orange-600 transition"
                  style={{ height: `${c / 12}px` }}
                />

                <span className="text-xs text-gray-400">
                  W{i+1}
                </span>

              </div>
            ))}

          </div>

        </div>



        {/* ================= PREVIOUS MEALS ================= */}
        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-xl font-bold mb-2">
            Previous Meals & Preferences
          </h2>

          <p className="text-gray-500 mb-6 max-w-2xl">
            Each entry shows the meal you selected at the time, with the preferences used.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {mealHistory.map((entry) => (
              <MealHistoryCard
                key={entry.date + entry.meal}
                date={entry.date}
                meal={entry.meal}
                calories={entry.calories}
                note={entry.note}
                tags={entry.tags}
                preferences={preferenceTags}
              />
            ))}
          </div>

          {!preferenceTags.length && (
            <p className="text-sm text-gray-400 mt-4">
              Complete preferences to personalize this history.
            </p>
          )}

        </div>



        {/* ================= PIE ================= */}
        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-xl font-bold mb-2">
            Macro Distribution
          </h2>

          <p className="text-gray-500 mb-6 max-w-2xl">
            Your macronutrient ratio is balanced toward
            sustained energy release and muscle support.
          </p>

          <div className="flex items-center gap-12 flex-wrap">

            {/* PIE */}
            <div
              className="w-44 h-44 rounded-full"
              style={{
                background:
                  "conic-gradient(#f97316 0% 40%, #22c55e 40% 70%, #38bdf8 70% 100%)"
              }}
            />

            {/* LEGEND */}
            <div className="space-y-3 text-gray-600">

              <Legend color="bg-orange-500" label="Carbs — 40% (Primary energy source)" />
              <Legend color="bg-green-500" label="Protein — 30% (Muscle repair & metabolism)" />
              <Legend color="bg-sky-400" label="Fats — 30% (Hormonal balance)" />

            </div>

          </div>

        </div>



        {/* ================= AI ANALYSIS ================= */}
        <div className="bg-white border rounded-3xl p-8 space-y-4">

          <h2 className="text-xl font-bold">
            AI Behavioral Analysis
          </h2>

          <Insight text="✅ You are most consistent with lunch logging — indicating structured daytime eating habits." />

          <Insight text="⚠️ Dinner calories trend higher on weekends. Reducing portion size slightly could elevate your health score." />

          <Insight text="🔥 Protein intake improved by 18% this month — a major contributor to your rising nutrition score." />

          <Insight text="💡 Increasing fiber by 6–8g daily may improve gut health and stabilize glucose levels." />

        </div>



        {/* ================= ORANGE REPORT BOX ================= */}
        <div className="
          rounded-3xl
          p-10
          bg-gradient-to-r
          from-orange-500
          to-orange-600
          text-white
          flex
          justify-between
          items-center
        ">

          <div>
            <h2 className="text-2xl font-bold mb-2">
              Download Your Full Health Report 🚀
            </h2>

            <p className="text-orange-100 max-w-xl">
              Access a comprehensive PDF containing macro analysis,
              behavioral trends, AI predictions, and tailored
              nutrition recommendations.
            </p>

            <button className="
              mt-5
              px-6
              py-3
              rounded-xl
              bg-yellow-300
              text-black
              font-semibold
              hover:scale-105
              transition
            ">
              Download Report
            </button>
          </div>

          <div className="hidden md:flex w-32 h-32 rounded-full bg-white/30 items-center justify-center text-3xl font-bold">
            PDF
          </div>

        </div>


      </div>
    </div>
  );
};

export default MealTracker;



/* ---------------- SMALL COMPONENTS ---------------- */

const Metric = ({ title, value, desc }: any) => (
  <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
    <p className="text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
    <p className="text-xs text-gray-500 mt-2">{desc}</p>
  </div>
);

const Legend = ({ color, label }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-4 h-4 rounded ${color}`} />
    {label}
  </div>
);

const Insight = ({ text }: any) => (
  <p className="text-gray-600">{text}</p>
);

const AnalysisCard = ({ title, value, desc }: any) => (
  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
    <p className="text-sm text-orange-500 font-semibold">{title}</p>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    <p className="text-sm text-gray-600 mt-2">{desc}</p>
  </div>
);

const MealHistoryCard = ({ date, meal, calories, note, tags, preferences }: any) => (
  <div className="border rounded-2xl p-5 bg-white">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-400">{date}</p>
      <p className="text-sm text-orange-500 font-semibold">{calories} kcal</p>
    </div>

    <h3 className="text-lg font-bold mt-2">{meal}</h3>
    <p className="text-sm text-gray-500 mt-1">{note}</p>

    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag: string) => (
        <span
          key={`${meal}-${tag}`}
          className="text-xs px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-semibold"
        >
          {tag}
        </span>
      ))}
    </div>

    <div className="mt-4">
      <p className="text-xs text-gray-400 mb-2">Preferences at the time</p>
      <div className="flex flex-wrap gap-2">
        {preferences.length ? (
          preferences.map((pref: string) => (
            <span
              key={`${meal}-${pref}`}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
            >
              {pref}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">No preferences saved.</span>
        )}
      </div>
    </div>
  </div>
);
