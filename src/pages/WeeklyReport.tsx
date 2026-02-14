import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const healthScoreData = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 78 },
  { day: "Wed", score: 65 },
  { day: "Thu", score: 82 },
  { day: "Fri", score: 88 },
  { day: "Sat", score: 74 },
  { day: "Sun", score: 85 },
];

const macroData = [
  { name: "Protein", value: 30, color: "hsl(28, 90%, 55%)" },
  { name: "Carbs", value: 45, color: "hsl(142, 60%, 45%)" },
  { name: "Fats", value: 25, color: "hsl(200, 70%, 50%)" },
];

const microGaps = [
  { nutrient: "Vitamin D", status: "low", percent: 45 },
  { nutrient: "Iron", status: "moderate", percent: 68 },
  { nutrient: "Calcium", status: "good", percent: 85 },
  { nutrient: "B12", status: "good", percent: 92 },
  { nutrient: "Zinc", status: "low", percent: 38 },
];

// Heatmap data — 4 weeks x 7 days
const heatmapData = [
  [3, 2, 3, 1, 3, 2, 0],
  [3, 3, 2, 3, 1, 2, 3],
  [2, 1, 3, 3, 3, 0, 2],
  [3, 3, 2, 3, 3, 2, 1],
];
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getHeatColor = (val: number) => {
  if (val === 3) return "bg-accent";
  if (val === 2) return "bg-health-yellow";
  if (val === 1) return "bg-health-red";
  return "bg-secondary";
};

const WeeklyReport = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Weekly Health Report</h1>
        <p className="text-muted-foreground mt-1">Your nutrition analytics at a glance.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Score Trend */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Health Score Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={healthScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(20, 8%, 50%)" }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: "hsl(20, 8%, 50%)" }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="hsl(28, 90%, 55%)" strokeWidth={2.5} dot={{ fill: "hsl(28, 90%, 55%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Macro Breakdown */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
          <h2 className="font-display font-semibold text-foreground mb-4">Macro Breakdown</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={macroData} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {macroData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {macroData.map((m) => (
                <div key={m.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-foreground font-medium">{m.name}</span>
                  <span className="text-muted-foreground">{m.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Micronutrient Gaps */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-health-yellow" />
          <h2 className="font-display font-semibold text-foreground">Micronutrient Gaps</h2>
        </div>
        <div className="space-y-3">
          {microGaps.map((item) => (
            <div key={item.nutrient} className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground w-24">{item.nutrient}</span>
              <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${
                    item.percent >= 80 ? "bg-accent" : item.percent >= 60 ? "bg-health-yellow" : "bg-health-red"
                  }`}
                />
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
        <h2 className="font-display font-semibold text-foreground mb-4">Your Eating Consistency</h2>
        <div className="space-y-2">
          {/* Day labels */}
          <div className="flex gap-2 ml-16">
            {dayLabels.map((d) => (
              <span key={d} className="w-8 text-center text-xs text-muted-foreground">{d}</span>
            ))}
          </div>
          {heatmapData.map((week, wi) => (
            <div key={wi} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-14 text-right">Week {wi + 1}</span>
              {week.map((val, di) => (
                <div key={di} className={`w-8 h-8 rounded-md ${getHeatColor(val)} transition-colors`} title={`${val}/3 meals`} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-accent" /> Optimal</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-health-yellow" /> Moderate</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-health-red" /> Poor</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-secondary" /> Missed</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
