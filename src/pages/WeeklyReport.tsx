import { useRef, type ReactNode } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/contexts/AuthContext";

const WeeklyReport = () => {
  const { user } = useAuth();
  const reportRef = useRef<HTMLDivElement>(null);

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "User";

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  /* ================= PDF ================= */

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 3, // ultra sharp
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const pageHeight = 297;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`FlavorAI_Report_${displayName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center py-10 px-6">

      {/* BUTTON */}
      <button
        onClick={downloadPDF}
        className="
          mb-6
          px-7 py-3
          bg-orange-500
          text-white
          rounded-xl
          font-semibold
          hover:scale-105
          transition
          shadow-md
        "
      >
        Download PDF
      </button>

      {/* REPORT */}
      <div
        ref={reportRef}
        className="w-full max-w-5xl bg-white rounded-3xl p-12 space-y-10"
      >

        {/* HEADER */}
        <Header displayName={displayName} today={today} />

        {/* SCORES */}
        <Scores />

        {/* MACRO */}
        <Macro />

        {/* AI SUMMARY */}
        <AISummary />

        {/* IMPROVEMENTS */}
        <Improvements />

        {/* FUTURE */}
        <Predictions />

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
};

export default WeeklyReport;

/* ================= COMPONENTS ================= */

const Header = ({ displayName, today }: { displayName: string; today: string }) => (
  <div className="border-b pb-6">
    <h1 className="text-4xl font-bold text-gray-900">
      FlavorAI™ Nutrition Intelligence Report
    </h1>

    <p className="text-gray-500 mt-2">
      Generated for <b>{displayName}</b>
    </p>

    <p className="text-gray-400 text-sm">
      Report Date: {today}
    </p>
  </div>
);

/* ---------- SCORES ---------- */

const Scores = () => (
  <div className="grid grid-cols-2 gap-6">

    <ScoreCard
      title="Health Score"
      score="91"
      desc="Your nutritional behavior strongly supports metabolic efficiency, cardiovascular stability, and long-term wellness."
    />

    <ScoreCard
      title="Taste Intelligence"
      score="88"
      desc="FlavorAI has mapped your flavor psychology with high precision — enabling smarter, satisfaction-optimized meal recommendations."
    />

  </div>
);

const ScoreCard = ({
  title,
  score,
  desc,
}: {
  title: string;
  score: string | number;
  desc: string;
}) => (
  <div className="border rounded-2xl p-6 flex gap-6 items-center">
    <div className="w-24 h-24 rounded-full border-8 border-orange-400 flex items-center justify-center text-2xl font-bold">
      {score}
    </div>

    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600 mt-1">{desc}</p>
    </div>
  </div>
);

/* ---------- MACRO ---------- */

const Macro = () => (
  <Section title="Macro Distribution">

    <p className="text-gray-600 max-w-2xl">
      Your macronutrient profile indicates a strong balance between
      sustained energy release, muscle recovery, and hormonal regulation.
    </p>

    <div className="flex items-center gap-10 mt-6">

      <div
        className="w-40 h-40 rounded-full"
        style={{
          background:
            "conic-gradient(#f97316 0% 40%, #22c55e 40% 70%, #38bdf8 70% 100%)",
        }}
      />

      <div className="space-y-2 text-gray-700">
        <Legend color="bg-orange-500" text="Carbohydrates — 40%" />
        <Legend color="bg-green-500" text="Protein — 30%" />
        <Legend color="bg-sky-400" text="Fats — 30%" />
      </div>

    </div>

  </Section>
);

/* ---------- AI SUMMARY ---------- */

const AISummary = () => (
  <Section title="AI Behavioral Summary">

    <Insight text="✅ Strong weekday dietary consistency indicates structured eating behavior." />
    <Insight text="🔥 Protein intake improved by 18%, significantly enhancing metabolic response." />
    <Insight text="⚖️ Calorie variability remains low — a key predictor of appetite regulation." />
    <Insight text="🧠 Meal timing aligns well with circadian metabolic windows." />

  </Section>
);

/* ---------- IMPROVEMENTS ---------- */

const Improvements = () => (
  <Section title="Key Improvements Recommended">

    <Improve text="Increase daily fiber intake by 6–8g to enhance gut microbiome diversity." />
    <Improve text="Hydration is slightly below optimal — target 2.3–2.7L daily." />
    <Improve text="Reduce late-night eating to improve sleep-driven hormonal recovery." />
    <Improve text="Introduce more leafy greens to boost micronutrient density." />

  </Section>
);

/* ---------- FUTURE ---------- */

const Predictions = () => (
  <Section title="Predictive Health Outlook">

    <p className="text-gray-700">
      If your current behavior pattern continues, FlavorAI predicts:
    </p>

    <ul className="list-disc ml-6 mt-3 text-gray-700 space-y-1">
      <li>7–10% improvement in metabolic efficiency</li>
      <li>Higher daily energy stability</li>
      <li>Better glucose control</li>
      <li>Reduced long-term inflammation markers</li>
    </ul>

  </Section>
);

/* ---------- FOOTER ---------- */

const Footer = () => (
  <div className="border-t pt-6 text-sm text-gray-400">
    This report was automatically generated by FlavorAI™
    and is intended for wellness insights only.
    It should not replace professional medical advice.
  </div>
);

/* ---------- SMALL ---------- */

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {children}
  </div>
);

const Legend = ({ color, text }: { color: string; text: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded ${color}`} />
    {text}
  </div>
);

const Insight = ({ text }: { text: string }) => (
  <p className="text-gray-700 mb-2">{text}</p>
);

const Improve = ({ text }: { text: string }) => (
  <p className="text-gray-700 mb-2">👉 {text}</p>
);
