import { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PDFReport from "@/components/PDFReport";
import type { User } from "firebase/auth";

type Preferences = {
  diet?: string[];
  goals?: string[];
  cuisine?: string[];
  health?: string[];
  activity?: string;
  allergies?: string;
};

type HeatmapLevel = {
  color: string;
  label: string;
  score: string;
};

type CaloriesWeek = {
  value: number;
  date: string;
};

type MealHistoryEntry = {
  date: string;
  meal: string;
  calories: number;
  note: string;
  tags: string[];
};

/* ---------------- COMPONENT ---------------- */

const MealTracker = () => {
  const { user } = useAuth();
  const pdfRef = useRef<HTMLDivElement>(null);

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "you";

  const avatarInitial = displayName.charAt(0).toUpperCase();

  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("flavourai.preferences");
    if (!stored) return;

    try {
      setPreferences(JSON.parse(stored) as Preferences);
    } catch {
      setPreferences(null);
    }
  }, []);

  /* ✅ STABLE HEATMAP */
  const heatmap = useMemo<HeatmapLevel[]>(() => {
    const levels: HeatmapLevel[] = [
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
  const calories: CaloriesWeek[] = [
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

  const mealHistory: MealHistoryEntry[] = [
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

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`FlavorAI-Report-${displayName}-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      {/* HIDDEN PDF REPORT */}
      <div className="fixed -left-[9999px] top-0">
        <div ref={pdfRef}>
          <PDFReport displayName={displayName} />
        </div>
      </div>

      {/* MAIN TRACKER PAGE */}
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
        <DownloadReport onDownload={handleDownloadPDF} />
        </div>
      </div>
    </>
  );
};

export default MealTracker;


/* ---------------- SECTIONS ---------------- */

const Header = ({
  user,
  displayName,
  avatarInitial,
}: {
  user: User | null;
  displayName: string;
  avatarInitial: string;
}) => (
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

const HeatmapSection = ({ heatmap }: { heatmap: HeatmapLevel[] }) => (
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
          {heatmap.map((level, i) => (
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

const CaloriesSection = ({ calories }: { calories: CaloriesWeek[] }) => (
  <div className="bg-white border rounded-3xl p-8">
    <div className="grid md:grid-cols-2 gap-10">

      <div>
        <h2 className="text-xl font-bold mb-4">
          Weekly Calorie Trend
        </h2>

        <div className="flex items-end gap-6 h-52">
          {calories.map((week, i) => (
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

const PreviousMeals = ({
  mealHistory,
  preferenceTags,
}: {
  mealHistory: MealHistoryEntry[];
  preferenceTags: string[];
}) => (
  <div className="bg-white border rounded-3xl p-8">
    <h2 className="text-xl font-bold mb-6">
      Previous Meals & Preferences
    </h2>

    <div className="grid md:grid-cols-3 gap-6">
      {mealHistory.map((entry) => (
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

const DownloadReport = ({ onDownload }: { onDownload: () => void }) => (
  <div className="rounded-3xl p-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex justify-between items-center">
    <div>
      <h2 className="text-2xl font-bold mb-2">
        Download Your Full Health Report 🚀
      </h2>

      <button onClick={onDownload} className="mt-5 px-6 py-3 rounded-xl bg-yellow-300 text-black font-semibold hover:scale-105 transition">
        Download Report
      </button>
    </div>

    <div className="hidden md:flex relative w-32 h-32">
      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
      <div className="relative w-32 h-32 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold">
        PDF
      </div>
    </div>
  </div>
);

/* ---------------- SMALL COMPONENTS ---------------- */
<<<<<<< HEAD
const Metric = ({ title, value, desc }: { title: string; value: string | number; desc: string }) => (
  <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
=======

const Metric = ({ title, value, desc }: any) => (
  <div className="border rounded-2xl p-6 hover:shadow-md transition">
>>>>>>> 6db257cb85218e004a187af17c654fb80750cac5
    <p className="text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
    <p className="text-xs text-gray-500 mt-2">{desc}</p>
  </div>
);

<<<<<<< HEAD
const AnalysisCard = ({ title, value, desc }: { title: string; value: string | number; desc: string }) => (
=======
const AnalysisCard = ({ title, value, desc }: any) => (
>>>>>>> 6db257cb85218e004a187af17c654fb80750cac5
  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
    <p className="text-sm text-orange-500 font-semibold">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
    <p className="text-sm text-gray-600 mt-2">{desc}</p>
  </div>
);

const Insight = ({ text }: { text: string }) => <p className="text-gray-600">{text}</p>;

<<<<<<< HEAD
const Legend = ({ color, label }: { color: string; label: string }) => (
=======
const Legend = ({ color, label }: any) => (
>>>>>>> 6db257cb85218e004a187af17c654fb80750cac5
  <div className="flex items-center gap-3">
    <div className={`w-4 h-4 rounded ${color}`} />
    {label}
  </div>
);

<<<<<<< HEAD
const ColorBox = ({ color }: { color: string }) => <div className={`w-4 h-4 rounded ${color}`} />;
=======
const ColorBox = ({ color }: any) => (
  <div className={`w-4 h-4 rounded ${color}`} />
);
>>>>>>> 6db257cb85218e004a187af17c654fb80750cac5

const Tooltip = ({ label, score }: { label: string; score: string }) => (
  <div
    className="
      absolute bottom-7 left-1/2 -translate-x-1/2
      opacity-0 group-hover:opacity-100
      bg-gray-900 text-white text-xs
      px-3 py-2 rounded-lg whitespace-nowrap
      shadow-xl transition z-50
    "
  >
    <p className="font-semibold">{label}</p>
    <p className="text-gray-300">{score}</p>
  </div>
);

const AIBox = () => (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-3">
    <h3 className="font-bold text-green-700">🤖 AI Consistency Insight</h3>

    <p className="text-gray-700">Strong weekday discipline with minor weekend variation.</p>

    <p className="text-sm">
      🔥 Consistency Score: <b>89%</b>
    </p>
    <p className="text-sm">
      📈 Health score may improve by <b>6–9%</b>.
    </p>
    <p className="text-sm">⚡ Logging meals early boosts AI accuracy.</p>
  </div>
);

const CaloriesAI = () => (
  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
    <h3 className="font-bold text-orange-700">🔥 AI Calorie Analysis</h3>

    <p className="text-gray-700 mt-2">Controlled fluctuation — a hallmark of flexible dieting.</p>

    <p className="text-sm mt-3">
      📊 Avg Intake: <b>1,920 kcal</b>
    </p>
    <p className="text-sm">
      ⚖️ Variability: <b>Low</b>
    </p>
    <p className="text-sm">
      🚀 Efficiency may improve by <b>5–8%</b>.
    </p>
  </div>
);

const MealHistoryCard = ({
  date,
  meal,
  calories,
  note,
  tags,
  preferences,
}: {
  date: string;
  meal: string;
  calories: string | number;
  note: string;
  tags: string[];
  preferences: string[];
}) => (
  <div className="border rounded-2xl p-5 hover:shadow-md transition">
    <div className="flex justify-between">
      <p className="text-sm text-gray-400 font-medium">📅 {date}</p>
      <p className="text-sm text-orange-500 font-semibold">{calories} kcal</p>
    </div>

    <h3 className="text-lg font-bold mt-2">{meal}</h3>
    <p className="text-sm text-gray-500">{note}</p>

    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag) => (
        <span key={tag} className="text-xs px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-semibold">
          {tag}
        </span>
      ))}
    </div>

    <div className="mt-4">
      <p className="text-xs text-gray-400 mb-2">Preferences at the time</p>

      <div className="flex flex-wrap gap-2">
        {preferences.length ? (
          preferences.map((pref) => (
            <span key={pref} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
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
