import { useAuth } from "@/contexts/AuthContext";

interface PDFReportProps {
  displayName: string;
}

const PDFReport = ({ displayName }: PDFReportProps) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          FlavorAI™ Nutrition Intelligence Report
        </h1>
        <p className="text-sm text-gray-500">
          Generated for {displayName}
        </p>
        <p className="text-sm text-gray-500">
          Report Date: {currentDate}
        </p>
      </div>

      {/* SCORES */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <ScoreCard
          score={91}
          title="Health Score"
          description="Your nutrition profile strongly supports metabolic efficiency, cardiovascular stability, and long-term wellness."
          color="bg-orange-100"
          borderColor="border-orange-300"
        />
        <ScoreCard
          score={88}
          title="Taste Intelligence"
          description="FlavorAI has mapped your flavor psychology with high precision — enabling smarter, satisfaction-optimized meal recommendations."
          color="bg-orange-100"
          borderColor="border-orange-300"
        />
      </div>

      {/* MACRO DISTRIBUTION */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Macro Distribution
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Your macronutrient profile indicates a strong balance between sustained energy release,
          muscle recovery, and hormonal regulation.
        </p>
        <div className="space-y-2">
          <MacroItem color="bg-orange-500" label="Carbohydrates — 40%" />
          <MacroItem color="bg-green-500" label="Protein — 30%" />
          <MacroItem color="bg-sky-400" label="Fats — 30%" />
        </div>
      </div>

      {/* AI BEHAVIORAL SUMMARY */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          AI Behavioral Summary
        </h2>
        <div className="space-y-2">
          <BulletPoint
            color="bg-green-500"
            text="Strong weekday dietary consistency indicates structured eating behavior."
          />
          <BulletPoint
            color="bg-green-500"
            text="Protein intake improved by 18%, significantly enhancing metabolic efficiency."
          />
          <BulletPoint
            color="bg-yellow-500"
            text="Calorie variability remains low — a key predictor of appetite regulation."
          />
          <BulletPoint
            color="bg-yellow-500"
            text="Meal timing aligns well with circadian metabolic windows."
          />
        </div>
      </div>

      {/* KEY IMPROVEMENTS */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Key Improvements Recommended
        </h2>
        <div className="space-y-2">
          <RecommendationItem
            text="Increase daily fiber intake by 6–8g to enhance gut microbiome diversity."
          />
          <RecommendationItem
            text="Hydration is slightly below optimal — target 2.3–2.7L daily."
          />
          <RecommendationItem
            text="Reduce late-night eating to improve sleep-driven hormonal recovery."
          />
          <RecommendationItem
            text="Introduce more leafy greens to boost micronutrient density."
          />
        </div>
      </div>

      {/* PREDICTIVE OUTLOOK */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Predictive Health Outlook
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          If your current behavior pattern continues, FlavorAI predicts:
        </p>
        <div className="space-y-2 text-sm text-gray-700">
          <p>* +10% improvement in metabolic efficiency</p>
          <p>* Higher daily energy stability</p>
          <p>* Better glucose control</p>
          <p>* Reduced long-term inflammation markers</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>This report is AI-generated based on your logged nutrition data.</p>
        <p className="mt-1">© 2026 FlavorAI™ — Precision Nutrition Intelligence</p>
      </div>
    </div>
  );
};

export default PDFReport;

/* COMPONENTS */

const ScoreCard = ({ score, title, description, color, borderColor }: any) => (
  <div className={`${color} border-2 ${borderColor} rounded-2xl p-6`}>
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-orange-500">
        <span className="text-2xl font-bold text-gray-900">{score}</span>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-xs text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const MacroItem = ({ color, label }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-4 h-4 rounded ${color}`} />
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

const BulletPoint = ({ color, text }: any) => (
  <div className="flex items-start gap-3">
    <div className={`w-2 h-2 rounded-full ${color} mt-1.5 flex-shrink-0`} />
    <p className="text-sm text-gray-700">{text}</p>
  </div>
);

const RecommendationItem = ({ text }: any) => (
  <div className="flex items-start gap-3">
    <span className="text-orange-500 flex-shrink-0">👉</span>
    <p className="text-sm text-gray-700">{text}</p>
  </div>
);
