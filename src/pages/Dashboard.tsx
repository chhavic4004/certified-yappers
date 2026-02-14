import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    age: 24,
    email: "alex@email.com",
    activity: "Moderately Active", // NOT editable
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e: any) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-10">

      {/* GREETING */}
      <div>
        <h1 className="text-4xl font-bold">
          Welcome back, {profile.name.split(" ")[0]} 👋
        </h1>

        <p className="text-gray-500 mt-1">
          Your AI-powered nutrition command center.
        </p>
      </div>


      {/* 🔥 PREMIUM PROFILE CARD */}
      <div className="bg-white rounded-3xl border p-8 flex gap-8 items-center">

        {/* Avatar */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
          {profile.name.charAt(0)}
        </div>

        {/* Info */}
        <div className="flex-1 grid md:grid-cols-4 gap-6">

          <ProfileField
            label="Full Name"
            name="name"
            value={profile.name}
            editing={editing}
            onChange={handleChange}
          />

          <ProfileField
            label="Age"
            name="age"
            value={profile.age}
            editing={editing}
            onChange={handleChange}
          />

          <ProfileField
            label="Email"
            name="email"
            value={profile.email}
            editing={editing}
            onChange={handleChange}
          />

          {/* NOT EDITABLE */}
          <div>
            <p className="text-gray-400 mb-1">Activity Intelligence</p>
            <p className="font-semibold text-lg">
              {profile.activity}
            </p>
            <p className="text-xs text-gray-400">
              Determined automatically from your usage.
            </p>
          </div>

        </div>

        {/* Edit */}
        <button
          onClick={() => setEditing(!editing)}
          className="px-6 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
        >
          {editing ? "Save" : "Edit"}
        </button>

      </div>


      {/* SCORES */}
      <div className="grid md:grid-cols-2 gap-8">

        <ScoreCard
          title="Health Score"
          score={91}
          color="green"
          desc="Your nutrition is extremely aligned with your metabolic needs."
        />

        <ScoreCard
          title="Taste Intelligence"
          score={88}
          color="orange"
          desc="FlavorAI understands your palate with high precision."
        />

      </div>



      {/* 🚀 NEXT GEN FLAVOR AI BOX */}
      <div
        onClick={() => navigate("/taste")}
        className="
          cursor-pointer
          rounded-3xl
          p-10
          text-white
          bg-gradient-to-r
          from-orange-500
          to-orange-600
          flex
          justify-between
          items-center
          hover:scale-[1.01]
          transition
        "
      >

        <div>
          <h2 className="text-2xl font-bold mb-2">
            FlavorAI Deep Insight 🚀
          </h2>

          <p className="max-w-xl text-orange-100">
            Your meal score improved by <b>12%</b> this week.
            Discover what drove the change and how to optimize it further.
          </p>

          <div className="mt-5 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold w-fit">
            See What Changed →
          </div>
        </div>

        {/* animated orb */}
        <div className="hidden md:flex relative">
          <div className="w-32 h-32 rounded-full bg-white/20 animate-ping absolute"></div>

          <div className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold">
            AI
          </div>
        </div>

      </div>



      {/* LOGOUT */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/")}

          className="
            bg-red-500
            hover:bg-red-600
            text-white
            px-8
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Dashboard;



/* ---------- Components ---------- */

const ProfileField = ({ label, name, value, editing, onChange }: any) => (
  <div>
    <p className="text-gray-400 mb-1">{label}</p>

    {editing ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-lg px-3 py-2 w-full"
      />
    ) : (
      <p className="font-semibold text-lg">{value}</p>
    )}
  </div>
);


const ScoreCard = ({ title, score, color, desc }: any) => {
  const colorMap: any = {
    green: "text-green-600 border-green-200",
    orange: "text-orange-600 border-orange-200",
  };

  return (
    <div className="bg-white rounded-3xl border p-8 flex items-center gap-8">

      <div
        className={`
          w-28 h-28
          rounded-full
          border-[8px]
          flex
          items-center
          justify-center
          text-3xl
          font-bold
          ${colorMap[color]}
        `}
      >
        {score}
      </div>

      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500 mt-2 max-w-sm">{desc}</p>
      </div>

    </div>
  );
};
