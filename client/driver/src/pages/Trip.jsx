import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {
  FaStopCircle,
  FaClock,
  FaSatelliteDish,
  FaTachometerAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const socket = io(import.meta.env.VITE_SOCKET_URL);
const API_URL = import.meta.env.VITE_API_URL;

const Trip = () => {
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tripId, setTripId] = useState(null);
  const [busPlate, setBusPlate] = useState("");

  const [telemetry, setTelemetry] = useState({
    lat: "Waiting...",
    lng: "...",
    speed: 0,
  });

  const watchId = useRef(null);

  useEffect(() => {
    const storedTripId = localStorage.getItem("CURRENT_TRIP_ID");
    const storedBusPlate = localStorage.getItem("MOUNTED_BUS_PLATE");
    const storedBusId = localStorage.getItem("MOUNTED_BUS_ID");
    const storedOperatorType = localStorage.getItem("MOUNTED_OPERATOR_TYPE") || "private";
    const driverData = JSON.parse(localStorage.getItem("driverInfo"));

    if (!storedTripId || !driverData) {
      navigate("/dashboard");
      return;
    }

    setTripId(storedTripId);
    setBusPlate(storedBusPlate);

    if ("geolocation" in navigator) {
      const geoOptions = {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 20000,
      };

      const geoSuccess = (position) => {
        const { latitude, longitude, speed, heading } = position.coords;
        const routeString =
          localStorage.getItem("MOUNTED_ROUTE_INFO") || "Unknown - Unknown";

        const parts = routeString.split(" - ");
        const originStr = parts[0] ? parts[0].trim() : "Unknown";
        const destStr = parts[1] ? parts[1].trim() : "Unknown";

        setTelemetry({
          lat: latitude.toFixed(5),
          lng: longitude.toFixed(5),
          speed: speed ? (speed * 3.6).toFixed(0) : 0,
        });

        socket.emit("driverLocation", {
          busId: storedBusId,
          busPlate: storedBusPlate,
          tripId: storedTripId,
          lat: latitude,
          lng: longitude,
          speed: speed || 0,
          heading: heading || 0,

          operatorType: storedOperatorType,
          origin: originStr,
          destination: destStr,
        });
      };

      const geoError = (error) => {
        console.error(`⚠️ GPS Error (${error.code}): ${error.message}`);
      };

      watchId.current = navigator.geolocation.watchPosition(
        geoSuccess,
        geoError,
        geoOptions,
      );
    } else {
      alert("GPS not supported on this device!");
    }

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (watchId.current !== null)
        navigator.geolocation.clearWatch(watchId.current);
    };
  }, [navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);

    if (hours > 0) {
      return `${hours}:${(mins % 60).toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndTrip = async () => {
    if (!window.confirm("CONFIRM: End this trip?")) return;

    try {
      const driverData = JSON.parse(localStorage.getItem("driverInfo"));
      const busId = localStorage.getItem("MOUNTED_BUS_ID");

      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }

      await axios.post(
        `${API_URL}/trips/end`,
        { tripId },
        { headers: { Authorization: `Bearer ${driverData.token}` } },
      );

      if (busId) {
        socket.emit("tripEnded", busId);
      }

      localStorage.removeItem("CURRENT_TRIP_ID");
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      navigate("/dashboard");
    } catch (error) {
      alert("Error ending trip. Check connection.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <div className="bg-[#1a1d21] p-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
          </span>
          <span className="font-mono text-red-500 font-bold tracking-[0.2em] uppercase text-sm">
            TRIP ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <FaSatelliteDish className="animate-pulse" />
          <span className="text-xs font-bold uppercase">GPS LIVE</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div>
          <h2 className="text-gray-600 font-bold uppercase tracking-widest text-sm mb-2">
            Vehicle ID
          </h2>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            {busPlate}
          </h1>
        </div>

        <div className="w-full max-w-sm bg-[#121418] border border-gray-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>

          <div className="flex flex-col items-center">
            <FaClock className="text-4xl text-green-500 mb-4" />
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
              Elapsed Time
            </span>
            <span className="font-mono text-6xl font-black text-white tabular-nums tracking-tight">
              {formatTime(elapsedTime)}
            </span>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <div className="bg-[#1a1d21] border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center">
            <FaTachometerAlt className="text-blue-500 text-xl mb-2" />
            <div className="text-3xl font-mono font-bold text-white">
              {telemetry.speed}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              km/h
            </div>
          </div>

          <div className="bg-[#1a1d21] border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center">
            <FaMapMarkerAlt className="text-purple-500 text-xl mb-2" />
            <div className="text-xs font-mono text-gray-300">
              <div className="mb-1">
                <span className="text-gray-600">LAT:</span> {telemetry.lat}
              </div>
              <div>
                <span className="text-gray-600">LNG:</span> {telemetry.lng}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-black pb-10">
        <button
          onClick={handleEndTrip}
          className="w-full bg-red-600/10 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white font-black text-xl py-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <FaStopCircle className="text-2xl" /> END CURRENT TRIP
        </button>
      </div>
    </div>
  );
};

export default Trip;
