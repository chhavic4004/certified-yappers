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
import ProtectedRoute from "./components/ProtectedRoute";

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

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/discover" element={<DiscoverMeals />} />

          <Route
            path="/tracker"
            element={
              <ProtectedRoute>
                <MealTracker />
              </ProtectedRoute>
            }
          />

          <Route path="/taste" element={<Taste />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
