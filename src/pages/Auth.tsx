import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/foodlog.webp";
import logo from "../assets/favicon.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = () => {
    // Later replace with real auth
    navigate("/preferences"); // onboarding page
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      
      {/* WRAPPER — SAME STYLE AS LANDING */}
      <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-orange-100">

        {/* BACKGROUND IMAGE */}
        <img
          src={bgImage}
          alt="Food"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />

        {/* 🔥 BRAND BOX (LOGO + NAME + TAGLINE INSIDE) */}
        <div className="
          absolute
          top-10
          left-1/2
          -translate-x-1/2
          bg-white
          px-8
          py-5
          rounded-2xl
          shadow-xl
          flex
          flex-col
          items-center
          z-20
        ">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="FlavourAI"
              className="w-12 h-12 rounded-lg shadow-sm"
            />

            <h1 className="text-3xl font-bold tracking-tight">
              Flavour<span className="text-orange-500">AI</span>
            </h1>
          </div>

          {/* TAGLINE — FIXED VISIBILITY */}
          <p className="text-gray-600 text-sm font-medium tracking-wide mt-1">
            Where Health Meets Taste
          </p>
        </div>

        {/* AUTH CARD */}
        <div className="relative z-10 min-h-[680px] flex items-center justify-center p-6">

          <div className="
            w-full
            max-w-md
            bg-white/95
            backdrop-blur-md
            rounded-3xl
            shadow-2xl
            p-8
            mt-20
          ">

            <h2 className="text-2xl font-bold mb-1">
              {isLogin ? "Welcome Back 👋" : "Create Account"}
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              {isLogin
                ? "Login to continue your smart food journey."
                : "Start your personalized nutrition journey."}
            </p>

            {/* FORM */}
            <div className="space-y-4">

              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-300 outline-none"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-300 outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-300 outline-none"
              />

              {/* CTA BUTTON */}
              <button
                onClick={handleAuth}
                className="
                  w-full
                  bg-gradient-to-r
                  from-[#F6B76F]
                  to-[#FFA94D]
                  hover:from-[#EAA355]
                  hover:to-[#ff9b2f]
                  py-3
                  rounded-xl
                  font-semibold
                  shadow-lg
                  transition
                  hover:scale-[1.02]
                "
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>

              {/* GOOGLE */}
              <button
                onClick={handleAuth}
                className="
                  w-full
                  py-3
                  border
                  border-gray-200
                  rounded-xl
                  hover:bg-gray-50
                  transition
                "
              >
                Continue with Google
              </button>
            </div>

            {/* TOGGLE */}
            <p className="text-center mt-6 text-sm">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-orange-500 font-semibold hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
