import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Bus, MapPin, Navigation } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const [activeBuses, setActiveBuses] = useState({});

  useEffect(() => {
    const SERVER_URL = import.meta.env.VITE_SOCKET_URL; 
    
    console.log(`🔌 Attempting to connect to: ${SERVER_URL}`);

    const socket = io(SERVER_URL, {
        transports: ['websocket', 'polling'], // Force standard methods
        reconnection: true,
    });

    // 1. Connection Success
    socket.on('connect', () => {
        console.log(`✅ CONNECTED! Socket ID: ${socket.id}`);
    });

    // 2. Connection Error (This is what we need to see)
    socket.on('connect_error', (err) => {
        console.error(`❌ CONNECTION FAILED:`, err.message);
    });

    // 3. Initial Fleet Data
    socket.on('initialFleetState', (busArray) => {
        console.log("📦 Received Initial Fleet:", busArray);
        const busMap = {};
        busArray.forEach(bus => { busMap[bus.busId] = bus; });
        setActiveBuses(prev => ({ ...prev, ...busMap }));
    });

    // 4. Live Updates
    socket.on('busUpdate', (data) => {
      console.log("📍 Bus Moved:", data.busPlate);
      setActiveBuses(prev => ({
        ...prev,
        [data.busId]: data
      }));
    });

    socket.on('busOffline', (data) => {
        console.log("🚫 Bus went offline:", data.busId);
        setActiveBuses(prev => {
            const newState = { ...prev };
            delete newState[data.busId]; // Delete the key
            return newState;
        });
    });

    return () => {
        console.log("🔌 Disconnecting...");
        socket.disconnect();
        socket.off('busOffline');
    };
  }, []);

  const buses = Object.values(activeBuses);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-brand text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Where to?</h1>
        <p className="text-blue-100 text-sm">Track your bus in real-time</p>

        {/* Fake Search Bar (Visual Only for now) */}
        <div className="mt-4 bg-white/20 backdrop-blur-md p-3 rounded-xl flex items-center gap-3">
          <Navigation className="text-white" size={20} />
          <input
            type="text"
            placeholder="Search route (e.g. 177)..."
            className="bg-transparent text-white placeholder-blue-200 outline-none w-full"
          />
        </div>
      </div>

      {/* Active List */}
      <div className="p-6">
        <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live Now ({buses.length})
        </h2>

        <div className="space-y-4">
          {buses.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <Bus className="mx-auto mb-2 opacity-20" size={48} />
              <p>No buses are running right now.</p>
            </div>
          ) : (
            buses.map((bus) => (
              <div
                key={bus.busId}
                onClick={() => navigate(`/track/${bus.busId}`, { state: { busData: bus } })}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:shadow-md transition-all active:scale-95"
              >
                <div className="flex items-center gap-4">
                  {/* Route Badge (Using 'Express' or parsed RouteNo) */}
                  <div className="bg-brand text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-md text-center leading-tight p-1">
                    {bus.routeNo || "Bus"}
                  </div>

                  <div>
                    {/* Destination is the big bold text */}
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">
                      {bus.destination || "Unknown"}
                    </h3>

                    {/* Origin and Plate below it */}
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      From: <span className="font-semibold">{bus.origin}</span>{" "}
                      • {bus.busPlate}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-mono font-bold text-brand">
                    {Math.round(bus.speed * 3.6)}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase">
                    km/h
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
