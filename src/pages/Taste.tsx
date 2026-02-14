import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

const tasteData = [
  { month: "Jan", score: 62 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 72 },
  { month: "Apr", score: 79 },
  { month: "May", score: 85 },
  { month: "Jun", score: 88 },
];

const flavorTraits = [
  { label: "Savory Preference", value: 90 },
  { label: "Spice Tolerance", value: 72 },
  { label: "Sweet Craving", value: 40 },
  { label: "Health Conscious", value: 84 },
  { label: "Protein Inclination", value: 88 },
];

const Taste = () => {
  const { user } = useAuth();
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "you";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex justify-center px-6 py-10">

      {/* PREMIUM ROUNDED CONTAINER */}
      <div className="w-full max-w-6xl bg-white rounded-3xl border border-orange-100 p-10 space-y-12">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Your FlavorAI Taste Intelligence 🍽️
          </h1>

          <p className="text-gray-500">
            See how your taste profile evolved as AI learned {displayName}'s preferences.
          </p>
        </div>

        {/* ⭐ SCORE CARD */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold mb-1">
              Current Taste Score
            </h2>

            <p className="text-orange-100">
              Derived from saved meals, ratings, and nutrition behavior.
            </p>
          </div>

          <div className="text-5xl font-bold">
            88
          </div>
        </div>

        {/* ⭐ GRAPH */}
        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Taste Evolution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tasteData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />
              <YAxis domain={[50, 100]} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#f97316"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-gray-400 mt-4">
            Your taste score improved by <b>+26%</b> as FlavorAI adapted to your eating behavior.
          </p>

        </div>

        {/* ⭐ FLAVOR TRAITS */}
        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Flavor Traits AI Identified
          </h2>

          <div className="space-y-5">

            {flavorTraits.map((trait, i) => (
              <div key={i}>

                <div className="flex justify-between mb-1">
                  <span className="font-medium">
                    {trait.label}
                  </span>

                  <span className="text-orange-500 font-semibold">
                    {trait.value}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full"
                    style={{ width: `${trait.value}%` }}
                  />
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* ⭐ AI INSIGHT */}
        <div className="bg-orange-50 border border-orange-200 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-2">
            AI Insight
          </h2>

          <p className="text-gray-600 max-w-2xl">
            Over the past few months, your meal selections shifted toward
            <b> high-protein savory dishes</b>.  
            This pattern correlates strongly with improved energy levels
            and better nutrition balance.
          </p>

        </div>

        {/* ⭐ TIMELINE */}
        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Your Taste Journey
          </h2>

          <div className="space-y-6">

            <Timeline
              title="Started exploring healthy meals"
              desc="AI began mapping your nutrition behavior."
            />

            <Timeline
              title="Shifted toward protein-rich foods"
              desc="Muscle recovery and satiety improved."
            />

            <Timeline
              title="Reduced sugar preference"
              desc="Metabolic health indicators improved."
            />

            <Timeline
              title="Optimized flavor-health balance"
              desc="You reached the top 15% of smart eaters."
            />

          </div>

        </div>

      </div>
    </div>
  );
};

export default Taste;



/* SMALL COMPONENT */

const Timeline = ({ title, desc }: any) => (
  <div className="flex gap-4 items-start">

    <div className="w-4 h-4 mt-1 rounded-full bg-orange-500" />

    <div>
      <p className="font-semibold">
        {title}
      </p>

      <p className="text-gray-500 text-sm">
        {desc}
      </p>
    </div>

  </div>
);
