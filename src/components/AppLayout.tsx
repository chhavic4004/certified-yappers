import Navbar from "./Navbar";
import ChefAIChatbot from "./ChefAIChatbot";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">

      {/* NAVBAR */}
      <Navbar />

      {/* ROUNDED MAIN CONTAINER */}
      <div className="flex justify-center px-6 py-10">
        <div className="w-full max-w-7xl bg-white rounded-3xl border border-orange-100 p-8">

          {/* THIS RENDERS ALL PAGES */}
          <Outlet />

        </div>
      </div>

      {/* FLOATING AI */}
      <ChefAIChatbot />

    </div>
  );
};

export default AppLayout;
