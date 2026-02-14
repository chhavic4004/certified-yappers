import { Link } from "react-router-dom";
import trackerImage from "../assets/Tracker.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">

      {/* Image Container */}
      <div className="
relative 
w-full 
max-w-6xl 
rounded-3xl 
overflow-hidden 
border border-orange-100
shadow-2xl
">


        {/* Landing Image */}
        <img
          src={trackerImage}
          alt="FlavourAI Landing"
          className="w-full h-auto object-contain"
        />

        {/* Button locked to bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <Link to="/auth">
            <button
              className="
                bg-[#F4D28C]
                hover:bg-[#e6c06f]
                text-black
                font-semibold
                px-12 py-3
                rounded-full
                border-2 border-black
                shadow-lg
                transition
                hover:scale-105
              "
            >
              Get Started
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Landing;
console.log(import.meta.env.VITE_RECIPE_API_KEY);

