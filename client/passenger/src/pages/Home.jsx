import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { getDistance } from "geolib";
import { Bus, Search, Map, Navigation } from "lucide-react";
import BusCard from "../components/BusCard";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const [activeBuses, setActiveBuses] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const SERVER_URL = import.meta.env.VITE_SOCKET_URL;

    console.log(`🔌 Attempting to connect to: ${SERVER_URL}`);

    const socket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log(`✅ CONNECTED! Socket ID: ${socket.id}`);
    });

    socket.on("connect_error", (err) => {
      console.error(`❌ CONNECTION FAILED:`, err.message);
    });

    socket.on("initialFleetState", (busArray) => {
      console.log("📦 Received Initial Fleet:", busArray);
      const busMap = {};
      busArray.forEach((bus) => {
        busMap[bus.busId] = bus;
      });
      setActiveBuses((prev) => ({ ...prev, ...busMap }));
    });

    socket.on("busUpdate", (data) => {
      console.log("📍 Bus Moved:", data.busPlate);
      setActiveBuses((prev) => ({
        ...prev,
        [data.busId]: data,
      }));
    });

    socket.on("busOffline", (data) => {
      console.log("🚫 Bus went offline:", data.busId);
      setActiveBuses((prev) => {
        const newState = { ...prev };
        delete newState[data.busId];
        return newState;
      });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude, 
          });
        },
        (error) => console.log("Location error:", error),
        { enableHighAccuracy: true },
      );
    }

    return () => {
      console.log("🔌 Disconnecting...");
      socket.disconnect();
      socket.off("busOffline");
    };
  }, []);

  const buses = Object.values(activeBuses).map((bus) => {
    let distInMeters = null;

    if (userLocation && bus.lat && bus.lng) {
      distInMeters = getDistance(
        userLocation,
        { latitude: bus.lat, longitude: bus.lng },
      );
    }

    return { ...bus, distance: distInMeters };
  });

  const filteredBuses = buses
    .filter((bus) => {
      const term = searchTerm.toLowerCase();
      return (
        (bus.routeNo || "").toLowerCase().includes(term) ||
        (bus.destination || "").toLowerCase().includes(term) ||
        (bus.origin || "").toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-blue-700 pt-12 pb-24 px-6 rounded-b-[40px] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full -mr-16 -mt-16 opacity-50"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-1">
            Find your bus.
          </h1>
          <p className="text-blue-100 mb-6">Real-time tracking for Sri Lanka</p>

          <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search Route (e.g. 177, Kandy)..."
              className="flex-1 bg-transparent outline-none text-gray-700 font-medium placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-6 -mt-16 relative z-20">
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="font-bold text-gray-800 text-lg">
            Live Now{" "}
            <span className="text-gray-400 text-sm font-normal">
              ({filteredBuses.length})
            </span>
          </h2>
        </div>

        <div className="space-y-1">
          {filteredBuses.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="animate-pulse mb-2">📡</div>
              <p className="text-gray-400">No active buses found.</p>
            </div>
          ) : (
            filteredBuses.map((bus) => (
              <BusCard
                key={bus.busId}
                bus={bus}
                onClick={() =>
                  navigate(`/track/${bus.busId}`, { state: { busData: bus } })
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
