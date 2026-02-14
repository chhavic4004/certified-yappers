import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

/* ---------------- COMPONENT ---------------- */

const MealTracker = () => {
  const { user } = useAuth();

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "you";

  const avatarInitial = displayName.charAt(0).toUpperCase();

  const [preferences, setPreferences] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("flavourai.preferences");
    if (!stored) return;

    try {
      setPreferences(JSON.parse(stored));
    } catch {}
  }, []);

  /* ✅ STABLE HEATMAP */
  const heatmap = useMemo(() => {
    const levels = [
      {
        color: "bg-green-100",
        label: "Low adherence day",
        score: "Nutrition targets were missed",
      },
      {
        color: "bg-green-300",
        label: "Moderate day",
        score: "Partial macro alignment",
      },
      {
        color: "bg-green-500",
        label: "Strong day",
        score: "Very close to nutrition targets",
      },
      {
        color: "bg-green-700",
        label: "Elite day",
        score: "Optimal intake & timing",
      },
    ];

    return Array.from({ length: 84 }, () =>
      levels[Math.floor(Math.random() * levels.length)]
    );
  }, []);

  /* ✅ WEEKLY CALORIES WITH DATES */
  const calories = [
    { value: 1800, date: "Feb 3" },
    { value: 2100, date: "Feb 10" },
    { value: 1750, date: "Feb 17" },
    { value: 1950, date: "Feb 24" },
    { value: 2200, date: "Mar 3" },
    { value: 2000, date: "Mar 10" },
    { value: 1850, date: "Mar 17" },
  ];

  const preferenceTags = useMemo(() => {
    if (!preferences) return [];

    const tags: string[] = [];

    if (preferences.diet?.length) tags.push(...preferences.diet);
    if (preferences.goals?.length) tags.push(...preferences.goals);
    if (preferences.cuisine?.length) tags.push(...preferences.cuisine);
    if (preferences.health?.length) tags.push(...preferences.health);
    if (preferences.activity) tags.push(`Activity: ${preferences.activity}`);
    if (preferences.allergies) tags.push(`Allergy: ${preferences.allergies}`);

    return tags.slice(0, 10);
  }, [preferences]);

  const mealHistory = [
    {
      date: "Feb 12, 2026",
      meal: "Grilled Salmon Bowl",
      calories: 420,
      note: "Post-workout recovery",
      tags: ["High Protein", "Omega-3", "Low Sugar"],
    },
    {
      date: "Feb 10, 2026",
      meal: "Mediterranean Salad",
      calories: 350,
      note: "Light dinner",
      tags: ["Low Carb", "Fresh Ingredients", "Anti-Inflammatory"],
    },
    {
      date: "Feb 08, 2026",
      meal: "Buddha Power Bowl",
      calories: 380,
      note: "High fiber lunch",
      tags: ["Plant Protein", "Gut Friendly", "High Fiber"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex justify-center px-6 py-10">
      <div className="w-full max-w-7xl bg-white rounded-3xl border border-orange-100 p-10 space-y-12">

        {/* HEADER */}
        <Header user={user} displayName={displayName} avatarInitial={avatarInitial} />

        {/* METRICS */}
        <Metrics />

        {/* ANALYSIS */}
        <DetailedAnalysis />

        {/* HEATMAP */}
        <HeatmapSection heatmap={heatmap} />

        {/* BAR GRAPH */}
        <CaloriesSection calories={calories} />

        {/* MEALS */}
        <PreviousMeals mealHistory={mealHistory} preferenceTags={preferenceTags} />

        {/* MACRO */}
        <MacroSection />

        {/* AI */}
        <AIAnalysis />

        {/* REPORT */}
        <DownloadReport />
      </div>
    </div>
  );
};

export default MealTracker;


/* ---------------- SECTIONS ---------------- */

const Header = ({ user, displayName, avatarInitial }: any) => (
  <div className="flex flex-wrap items-center justify-between gap-6">
    <div>
      <h1 className="text-4xl font-bold">Nutrition Intelligence</h1>
      <p className="text-gray-500 mt-2 max-w-2xl">
        A deep look into your eating consistency and behavioral nutrition
        patterns for {displayName}.
      </p>
    </div>

    <div className="flex items-center gap-4 border rounded-2xl px-4 py-3">
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

      <div>
        <p className="text-xs text-gray-400">Signed in as</p>
        <p className="font-semibold text-gray-800">
          {user?.email || displayName}
        </p>
      </div>
    </div>
  </div>
);

/* ---------------- METRICS ---------------- */

const Metrics = () => (
  <div className="grid md:grid-cols-4 gap-6">
    <Metric title="Avg Calories" value="1,920 kcal" desc="Excellent dietary control." />
    <Metric title="Protein Avg" value="86g" desc="Supports muscle recovery." />
    <Metric title="Meals Logged" value="142" desc="Improves AI accuracy." />
    <Metric title="Consistency" value="89%" desc="Strong nutrition habits." />
  </div>
);

/* ---------------- ANALYSIS ---------------- */

const DetailedAnalysis = () => (
  <div className="bg-white border rounded-3xl p-8">
    <h2 className="text-xl font-bold mb-6">Detailed Nutrition Analysis</h2>

    <div className="grid md:grid-cols-3 gap-6">
      <AnalysisCard title="Protein Timing" value="72%" desc="Aligned with recovery windows." />
      <AnalysisCard title="Carb Quality" value="A-" desc="Whole grains dominate." />
      <AnalysisCard title="Hydration" value="1.9L" desc="Increase water intake." />
      <AnalysisCard title="Late Eating" value="2 nights" desc="May reduce sleep quality." />
      <AnalysisCard title="Micronutrient" value="82%" desc="Add leafy greens." />
      <AnalysisCard title="Streak" value="11 days" desc="Boosts AI accuracy." />
    </div>
  </div>
);

/* ---------------- HEATMAP ---------------- */

const HeatmapSection = ({ heatmap }: any) => (
  <div className="bg-white border rounded-3xl p-8">
    <div className="grid md:grid-cols-2 gap-10">

      <div>
        <h2 className="text-xl font-bold mb-4">
          Meal Consistency Heatmap
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          Low
          <ColorBox color="bg-green-100"/>
          <ColorBox color="bg-green-300"/>
          <ColorBox color="bg-green-500"/>
          <ColorBox color="bg-green-700"/>
          Elite
        </div>

        <div className="grid grid-rows-7 grid-flow-col gap-[5px] w-max">
          {heatmap.map((level:any, i:number) => (
            <div key={i} className="relative group">
              <div className={`w-4 h-4 rounded-sm ${level.color} hover:scale-125 transition`} />

              <Tooltip label={level.label} score={level.score}/>
            </div>
          ))}
        </div>
      </div>

      <AIBox />
    </div>
  </div>
);

/* ---------------- CALORIES ---------------- */

const CaloriesSection = ({ calories }: any) => (
  <div className="bg-white border rounded-3xl p-8">
    <div className="grid md:grid-cols-2 gap-10">

      <div>
        <h2 className="text-xl font-bold mb-4">
          Weekly Calorie Trend
        </h2>

        <div className="flex items-end gap-6 h-52">
          {calories.map((week:any, i:number) => (
            <div key={i} className="relative group flex flex-col items-center">

              <div
                className="w-12 bg-orange-500 rounded-xl hover:bg-orange-600 hover:scale-110 transition"
                style={{ height: `${week.value / 12}px` }}
              />

              <Tooltip
                label={`${week.value} kcal`}
                score={
                  week.value > 2100
                    ? "Slight surplus"
                    : week.value < 1800
                    ? "Aggressive deficit"
                    : "Optimal range"
                }
              />

              <span className="text-xs text-gray-400 mt-2">
                {week.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      <CaloriesAI />
    </div>
  </div>
);

/* ---------------- MEALS ---------------- */

const PreviousMeals = ({ mealHistory, preferenceTags }: any) => (
  <div className="bg-white border rounded-3xl p-8">
    <h2 className="text-xl font-bold mb-6">
      Previous Meals & Preferences
    </h2>

    <div className="grid md:grid-cols-3 gap-6">
      {mealHistory.map((entry:any) => (
        <MealHistoryCard key={entry.date} {...entry} preferences={preferenceTags}/>
      ))}
    </div>
  </div>
);

/* ---------------- MACRO ---------------- */

const MacroSection = () => (
  <div className="bg-white border rounded-3xl p-8">
    <h2 className="text-xl font-bold mb-6">Macro Distribution</h2>

    <div className="flex items-center gap-12 flex-wrap">

      <div
        className="w-44 h-44 rounded-full"
        style={{
          background:
            "conic-gradient(#f97316 0% 40%, #22c55e 40% 70%, #38bdf8 70% 100%)"
        }}
      />

      <div className="space-y-3 text-gray-600">
        <Legend color="bg-orange-500" label="Carbs — 40%" />
        <Legend color="bg-green-500" label="Protein — 30%" />
        <Legend color="bg-sky-400" label="Fats — 30%" />
      </div>

    </div>
  </div>
);

/* ---------------- AI ---------------- */

const AIAnalysis = () => (
  <div className="bg-white border rounded-3xl p-8 space-y-3">
    <h2 className="text-xl font-bold">AI Behavioral Analysis</h2>

    <Insight text="✅ Strong lunch consistency." />
    <Insight text="⚠️ Weekend dinners trend higher." />
    <Insight text="🔥 Protein intake improved by 18%." />
    <Insight text="💡 Increase fiber by 6–8g daily." />
  </div>
);

/* ---------------- REPORT ---------------- */

const DownloadReport = () => (
  <div className="rounded-3xl p-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex justify-between items-center">
    <div>
      <h2 className="text-2xl font-bold mb-2">
        Download Your Full Health Report 🚀
      </h2>

      <button className="mt-5 px-6 py-3 rounded-xl bg-yellow-300 text-black font-semibold hover:scale-105 transition">
        Download Report
      </button>
    </div>

    <div className="hidden md:flex w-32 h-32 rounded-full bg-white/30 items-center justify-center text-3xl font-bold">
      PDF
    </div>
  </div>
);

/* ---------------- SMALL COMPONENTS ---------------- */

const Metric = ({ title, value, desc }: any) => (
  <div className="border rounded-2xl p-6 hover:shadow-md transition">
    <p className="text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
    <p className="text-xs text-gray-500 mt-2">{desc}</p>
  </div>
);

const AnalysisCard = ({ title, value, desc }: any) => (
  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
    <p className="text-sm text-orange-500 font-semibold">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
    <p className="text-sm text-gray-600 mt-2">{desc}</p>
  </div>
);

const Insight = ({ text }: any) => (
  <p className="text-gray-600">{text}</p>
);

const Legend = ({ color, label }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-4 h-4 rounded ${color}`} />
    {label}
  </div>
);

const ColorBox = ({ color }: any) => (
  <div className={`w-4 h-4 rounded ${color}`} />
);

const Tooltip = ({ label, score }: any) => (
  <div className="
    absolute bottom-7 left-1/2 -translate-x-1/2
    opacity-0 group-hover:opacity-100
    bg-gray-900 text-white text-xs
    px-3 py-2 rounded-lg whitespace-nowrap
    shadow-xl transition z-50
  ">
    <p className="font-semibold">{label}</p>
    <p className="text-gray-300">{score}</p>
  </div>
);

const AIBox = () => (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-3">
    <h3 className="font-bold text-green-700">
      🤖 AI Consistency Insight
    </h3>

    <p className="text-gray-700">
      Strong weekday discipline with minor weekend variation.
    </p>

    <p className="text-sm">🔥 Consistency Score: <b>89%</b></p>
    <p className="text-sm">📈 Health score may improve by <b>6–9%</b>.</p>
    <p className="text-sm">⚡ Logging meals early boosts AI accuracy.</p>
  </div>
);

const CaloriesAI = () => (
  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
    <h3 className="font-bold text-orange-700">
      🔥 AI Calorie Analysis
    </h3>

    <p className="text-gray-700 mt-2">
      Controlled fluctuation — a hallmark of flexible dieting.
    </p>

    <p className="text-sm mt-3">📊 Avg Intake: <b>1,920 kcal</b></p>
    <p className="text-sm">⚖️ Variability: <b>Low</b></p>
    <p className="text-sm">🚀 Efficiency may improve by <b>5–8%</b>.</p>
  </div>
);

const MealHistoryCard = ({ date, meal, calories, note, tags, preferences }: any) => (
  <div className="border rounded-2xl p-5 hover:shadow-md transition">
    <div className="flex justify-between">
      <p className="text-sm text-gray-400 font-medium">📅 {date}</p>
      <p className="text-sm text-orange-500 font-semibold">{calories} kcal</p>
    </div>

    <h3 className="text-lg font-bold mt-2">{meal}</h3>
    <p className="text-sm text-gray-500">{note}</p>

    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag:string) => (
        <span key={tag} className="text-xs px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-semibold">
          {tag}
        </span>
      ))}
    </div>

    <div className="mt-4">
      <p className="text-xs text-gray-400 mb-2">Preferences at the time</p>

      <div className="flex flex-wrap gap-2">
        {preferences.length
          ? preferences.map((pref:string) => (
              <span key={pref} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                {pref}
              </span>
            ))
          : <span className="text-xs text-gray-400">No preferences saved.</span>}
      </div>
    </div>
  </div>
);
