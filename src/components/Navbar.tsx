import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const location = useLocation();

  const nav = [
    { name: "Find Preferences", path: "/preferences" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Discover Meals", path: "/discover" },
    { name: "Your Tracker", path: "/tracker" },
    
  ];

  return (
    <div className="flex justify-center px-6 pt-6">
      <div className="w-full max-w-7xl bg-white rounded-2xl border border-orange-100 px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src={logo} className="w-9 h-9 rounded-lg" />
          <span className="text-xl font-bold">
            Flavour<span className="text-orange-500">AI</span>
          </span>
        </Link>

        {/* NAV */}
        <div className="flex gap-6">
          {nav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-medium transition ${
                location.pathname === item.path
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Navbar;
