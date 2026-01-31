import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Tracker from "./pages/Tracker";
import Onboarding from "./pages/Onboarding";

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");

    if (!hasSeenOnboarding && location.pathname !== "/onboarding") {
      navigate("/onboarding");
    }
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/track/:busId" element={<Tracker />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
