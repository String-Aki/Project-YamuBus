import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPowerOff,
  FaBus,
  FaMapMarkerAlt,
  FaWifi,
  FaExclamationTriangle,
} from "react-icons/fa";

const Dashboard = () => {
  const [driver, setDriver] = useState(null);
  const [busId, setBusId] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [routeInfo, setRouteInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const driverData = JSON.parse(localStorage.getItem("driverInfo"));
    const savedBusId = localStorage.getItem("MOUNTED_BUS_PLATE");
    const savedRoute = localStorage.getItem("MOUNTED_ROUTE_INFO");

    if (!driverData) {
      navigate("/login");
      return;
    }

    setDriver(driverData);
    setBusId(savedBusId || "UNKNOWN BUS");
    setRouteInfo(savedRoute || "No Route");

    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, [navigate]);

  const handleStartTrip = async () => {
    const token = driver.token;
    const busId = localStorage.getItem("MOUNTED_BUS_ID");

    if (!busId) {
      alert("Critical Error: Bus ID not found. Please re-bind device.");
      return;
    }

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/trips/start",
        { busId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      localStorage.setItem("CURRENT_TRIP_ID", data._id);
      navigate("/trip");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to start trip";
      alert(msg);
    }
  };

  const handleLogout = () => {
    if (window.confirm("End Shift and Logout?")) {
      localStorage.removeItem("driverInfo");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#121418] text-white flex flex-col font-sans">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-10 animate-fade-in-up">
          <h2 className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] mb-2">
            Vehicle ID
          </h2>
          <h1 className="text-6xl font-black text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            {busId}
          </h1>

          {routeInfo && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[#1a1d21] border border-gray-700 rounded-full px-4 py-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-300 tracking-wide uppercase">
                {routeInfo}
              </span>
            </div>
          )}
        </div>

        <div className="bg-[#1a1d21] rounded-2xl p-6 w-full max-w-sm border border-gray-800 mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
            {driver?.name?.charAt(0) || "D"}
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-400 uppercase">Current Operator</p>
            <p className="text-xl font-bold text-white">{driver?.name}</p>
          </div>
        </div>

        <button
          onClick={handleStartTrip}
          className="group relative w-full max-w-xs aspect-square rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-[0_0_50px_rgba(34,197,94,0.3)] hover:shadow-[0_0_80px_rgba(34,197,94,0.5)] transition-all active:scale-95 flex flex-col items-center justify-center border-4 border-[#121418] outline outline-4 outline-green-900/30"
        >
          <FaBus className="text-6xl mb-2 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
          <span className="text-2xl font-black tracking-widest text-white drop-shadow-md">
            START TRIP
          </span>
          <span className="text-xs text-green-200 mt-1 font-medium">
            TAP TO BEGIN ROUTE
          </span>

          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20"></div>
        </button>
      </div>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="relative z-50 w-full bg-[#1a1d21] border border-gray-700 text-gray-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all"
        >
          <FaPowerOff /> END SHIFT & LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
