import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const resolvedName =
    user?.displayName || user?.email?.split("@")[0] || "User";
  const resolvedEmail = user?.email || "";

  const [profile, setProfile] = useState({
    name: resolvedName,
    age: 24,
    email: resolvedEmail,
    activity: "Moderately Active",
  });

  const [editing, setEditing] = useState(false);

  const [healthOpen, setHealthOpen] = useState(false);
  const [tasteOpen, setTasteOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      name: resolvedName,
      email: resolvedEmail,
    }));
  }, [resolvedName, resolvedEmail]);

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


      {/* PROFILE CARD */}
      <div
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName !== "BUTTON") {
            setProfileOpen(true);
          }
        }}
        className="bg-white rounded-3xl border p-8 flex gap-8 items-center cursor-pointer hover:shadow-xl transition"
      >

        {/* Avatar */}
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={profile.name}
            className="w-28 h-28 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            {profile.name.charAt(0)}
          </div>
        )}

        {/* RESPONSIVE GRID */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

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

          <div className="min-w-0">
            <p className="text-gray-400 mb-1">Activity Intelligence</p>
            <p className="font-semibold text-lg break-words">
              {profile.activity}
            </p>
          </div>

        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditing(!editing);
          }}
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
          onClick={() => setHealthOpen(true)}
        />

        <ScoreCard
          title="Taste Intelligence"
          score={88}
          color="orange"
          desc="FlavorAI understands your palate with high precision."
          onClick={() => setTasteOpen(true)}
        />

      </div>


      {/* FLAVOR AI BOX */}
      <div
        onClick={() => navigate("/taste")}
        className="cursor-pointer rounded-3xl p-10 text-white bg-gradient-to-r from-orange-500 to-orange-600 flex justify-between items-center hover:scale-[1.02] transition"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">
            FlavorAI Deep Insight 🚀
          </h2>

          <p className="max-w-xl text-orange-100">
            Your meal score improved by <b>12%</b> this week.
          </p>

          <div className="mt-5 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold w-fit">
            See What Changed →
          </div>
        </div>

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
          onClick={async () => {
            await signOut(auth);
            navigate("/");
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </div>


      {/* ================= POPUPS ================= */}

      {healthOpen && (
        <Popup title="Health Intelligence Report" onClose={() => setHealthOpen(false)}>
          <ScoreRing score={91} color="green" />

          <MetricsGrid>
            <Metric label="Protein Adequacy" value="Optimal" color="green"/>
            <Metric label="Micronutrient Density" value="High" color="green"/>
            <Metric label="Inflammation Risk" value="Low" color="orange"/>
            <Metric label="Fiber Coverage" value="Needs Boost" color="orange"/>
          </MetricsGrid>

          <AIBox color="green">
            Increasing daily fiber intake by ~8g could significantly
            enhance gut microbiome health and metabolic efficiency.
          </AIBox>
        </Popup>
      )}

      {tasteOpen && (
        <Popup title="Taste Intelligence Profile" onClose={() => setTasteOpen(false)}>
          <ScoreRing score={88} color="orange" />

          <MetricsGrid>
            <Metric label="Spice Preference" value="Medium–High" color="orange"/>
            <Metric label="Texture Bias" value="Crunch Friendly" color="green"/>
            <Metric label="Flavor Curiosity" value="Exploratory" color="green"/>
            <Metric label="Sweet Tolerance" value="Moderate" color="orange"/>
          </MetricsGrid>

          <AIBox color="orange">
            You respond positively to contrast-heavy meals —
            combining acidity, spice, and texture can elevate satisfaction
            without increasing calories.
          </AIBox>
        </Popup>
      )}

      {profileOpen && (
        <Popup title="Personal Intelligence Profile" onClose={() => setProfileOpen(false)}>
          <DetailRow label="Full Name" value={profile.name}/>
          <DetailRow label="Email Identity" value={profile.email}/>
          <DetailRow label="Age Band" value={`${profile.age} years`}/>
          <DetailRow label="Activity Classification" value={profile.activity}/>
        </Popup>
      )}

    </div>
  );
};

export default Dashboard;

/* ================= COMPONENTS ================= */

const ProfileField = ({ label, name, value, editing, onChange }: any) => (
  <div className="min-w-0">
    <p className="text-gray-400 mb-1">{label}</p>

    {editing ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-lg px-3 py-2 w-full"
      />
    ) : (
      <p className="font-semibold text-lg break-words">
        {value}
      </p>
    )}
  </div>
);

const ScoreCard = ({ title, score, color, desc, onClick }: any) => {
  const colors:any = {
    green:"border-green-200 text-green-600",
    orange:"border-orange-200 text-orange-600"
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border p-8 flex items-center gap-8 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition"
    >
      <div className={`w-28 h-28 rounded-full border-[8px] flex items-center justify-center text-3xl font-bold ${colors[color]}`}>
        {score}
      </div>

      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500 mt-2 max-w-sm">{desc}</p>
      </div>
    </div>
  );
};

/* ===== PREMIUM POPUP ===== */

const Popup = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl p-12 max-w-2xl w-full relative shadow-[0_25px_80px_rgba(0,0,0,0.35)] animate-scaleUp">

      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200"
      >
        ✕
      </button>

      <h2 className="text-4xl font-bold mb-8">
        {title}
      </h2>

      <div className="space-y-8">
        {children}
      </div>

    </div>
  </div>
);

/* ===== SMALL UI COMPONENTS ===== */

const ScoreRing = ({score,color}:any)=>{
  const map:any={
    green:"border-green-500 text-green-600",
    orange:"border-orange-500 text-orange-600"
  };

  return(
    <div className={`w-32 h-32 mx-auto rounded-full border-[10px] flex items-center justify-center text-4xl font-bold ${map[color]}`}>
      {score}
    </div>
  );
};

const MetricsGrid = ({children}:any)=>(
  <div className="grid grid-cols-2 gap-6">
    {children}
  </div>
);

const Metric = ({label,value,color}:any)=>{
  const map:any={
    green:"text-green-600",
    orange:"text-orange-600"
  };

  return(
    <div className="border rounded-2xl p-5">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-lg font-bold ${map[color]}`}>{value}</p>
    </div>
  );
};

const AIBox = ({children,color}:any)=>{
  const map:any={
    green:"bg-green-50 border-green-200",
    orange:"bg-orange-50 border-orange-200"
  };

  return(
    <div className={`border rounded-2xl p-6 ${map[color]}`}>
      <p className="font-semibold mb-2">🤖 FlavorAI Recommendation</p>
      <p className="text-gray-600">{children}</p>
    </div>
  );
};

const DetailRow = ({label,value}:any)=>(
  <div className="flex justify-between border-b pb-3">
    <span className="text-gray-400">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
