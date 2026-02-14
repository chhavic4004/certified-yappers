import { useState } from "react";

const ChefAI = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">

        {/* RIPPLE RINGS */}
        <span className="absolute inset-0 rounded-full bg-orange-400 opacity-30 animate-ping"></span>
        <span className="absolute inset-0 rounded-full bg-orange-300 opacity-20 animate-pulse"></span>

        {/* BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="
            relative
            flex
            items-center
            gap-3
            px-7
            py-4
            rounded-full
            text-white
            font-semibold
            text-lg
            bg-gradient-to-r
            from-orange-500
            to-orange-600
            shadow-2xl
            hover:scale-110
            hover:shadow-orange-300/60
            transition
            duration-300
          "
        >
          🤖 Ask ChefAI
        </button>
      </div>


      {/* AI CHAT WINDOW */}
      {open && (
        <div className="
          fixed
          bottom-28
          right-8
          w-[380px]
          bg-white
          rounded-3xl
          shadow-2xl
          border
          p-6
          z-50
          animate-[fadeIn_.25s_ease]
        ">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">
              ChefAI Assistant 🍳
            </h2>

            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>


          {/* MESSAGE */}
          <div className="bg-orange-50 p-4 rounded-2xl text-gray-700 mb-4">
            👋 Hi! I’m your smart nutrition assistant.

            <br /><br />

            Try asking:

            <ul className="mt-2 space-y-1 text-gray-600 text-sm">
              <li>🔥 Suggest high protein meals</li>
              <li>🥑 Reduce sugar intake</li>
              <li>⚡ Improve my health score</li>
              <li>💪 Muscle gain foods</li>
            </ul>
          </div>


          {/* QUICK CHIPS */}
          <div className="flex flex-wrap gap-2 mb-4">

            {[
              "High Protein",
              "Low Carb",
              "Fat Loss",
              "Energy Foods"
            ].map((chip) => (
              <button
                key={chip}
                className="
                  text-xs
                  bg-gray-100
                  px-3
                  py-2
                  rounded-full
                  hover:bg-orange-100
                  transition
                "
              >
                {chip}
              </button>
            ))}

          </div>


          {/* INPUT */}
          <input
            placeholder="Ask ChefAI anything..."
            className="
              w-full
              border
              rounded-xl
              px-4
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-orange-400
            "
          />

        </div>
      )}
    </>
  );
};

export default ChefAI;
