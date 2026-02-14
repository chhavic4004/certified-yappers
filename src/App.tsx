import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import PreferenceSetup from "./pages/PreferenceSetup";
import Taste from "./pages/Taste";

import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import DiscoverMeals from "./pages/DiscoverMeals";
import MealTracker from "./pages/MealTracker";
import MealSuggestion from "./pages/MealSuggestion";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/preferences" element={<PreferenceSetup />} />

        {/* APP LAYOUT */}
        <Route element={<AppLayout />}>

          <Route path="/suggestions" element={<MealSuggestion />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discover" element={<DiscoverMeals />} />
          <Route path="/tracker" element={<MealTracker />} />
         
          <Route path="/taste" element={<Taste />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
