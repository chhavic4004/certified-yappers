import React from "react";

/* ---------------- DATA ---------------- */

// 12 weeks style heatmap
const heatmap = Array.from({ length: 84 });

const calories = [1800, 2100, 1750, 1950, 2200, 2000, 1850];
const protein = [70, 82, 90, 76, 88, 92, 85];

/* ---------------- COMPONENT ---------------- */

const MealTracker = () => {

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
        <div>
          <h1 className="text-4xl font-bold">
            Nutrition Intelligence 📊
          </h1>

          <p className="text-gray-500 mt-2 max-w-2xl">
            A deep look into your eating consistency, macro balance,
            and behavioral nutrition patterns. These insights help
            FlavorAI optimize your long-term metabolic health.
          </p>
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

const Metric = ({ title, value, desc }: { title: string; value: string | number; desc: string }) => (
  <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
    <p className="text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
    <p className="text-xs text-gray-500 mt-2">{desc}</p>
  </div>
);

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-3">
    <div className={`w-4 h-4 rounded ${color}`} />
    {label}
  </div>
);

const Insight = ({ text }: { text: string }) => (
  <p className="text-gray-600">{text}</p>
);
