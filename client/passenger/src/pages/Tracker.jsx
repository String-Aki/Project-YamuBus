import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import io from "socket.io-client";
import axios from "axios";
import { ArrowLeft, Navigation, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { handleError, handleSuccess } from "../utils/toastUtils";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

const stopIcon = new L.DivIcon({
  className: "bg-transparent",
  html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
};

const getCardinalDirection = (angle) => {
  if (angle === null || angle === undefined) return "Stationary";

  const directions = [
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West",
  ];
  const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
  return directions[index];
};

const Tracker = () => {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [busData, setBusData] = useState(location.state?.busData || null);
  const [isConnected, setIsConnected] = useState(false);
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await axios.get(`${API_URL}/buses/${busId}`);

        if (res.data && res.data.routeId) {
          setRouteData(res.data.routeId);
        }
      } catch (error) {
        console.error("Failed to load route path:", error);
      }
    };

    if (busId) {
      fetchRoute();
    }
  }, [busId]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => setIsConnected(true));

    socket.on("busUpdate", (data) => {
      if (data.busId === busId) {
        setBusData(data);
      }
    });

    socket.on("busOffline", (data) => {
      if (data.busId === busId) {
        toast.error("Trip Ended: Bus went offline");
        navigate("/");
      }
    });

    return () => socket.disconnect();
  }, [busId, navigate]);

  if (!busData)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Locating Bus...</p>
      </div>
    );

  const handleShare = async () => {
    const shareData = {
      title: `Track Bus ${busData.routeNo}`,
      text: `I am tracking the ${busData.routeNo} bus to ${busData.destination}. Watch it live here:`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        handleSuccess("Tracking link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      toast.error("Could not share link");
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-200 active:scale-90 transition-all"
      >
        <ArrowLeft size={24} className="text-gray-700" />
      </button>

      <MapContainer
        center={[busData.lat, busData.lng]}
        zoom={15}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {routeData && routeData.path && (
          <Polyline
            positions={routeData.path}
            color="#3b82f6"
            weight={6}
            opacity={0.8}
          />
        )}

        {routeData &&
          routeData.stops &&
          routeData.stops.map((stop, index) => (
            <Marker
              key={index}
              position={[stop.location.lat, stop.location.lng]}
              icon={stopIcon}
            >
              <Popup offset={[0, -5]}>
                <span className="font-bold text-xs">{stop.name}</span>
              </Popup>
            </Marker>
          ))}

        <Marker position={[busData.lat, busData.lng]} icon={busIcon}>
          <Popup className="font-semibold text-center">
            Route {busData.routeNo} <br /> {busData.busPlate}
          </Popup>
        </Marker>

        <RecenterMap lat={busData.lat} lng={busData.lng} />
      </MapContainer>

      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-[30px] shadow-[0_-5px_30px_rgba(0,0,0,0.1)] pb-6">
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">

                <span className={`text-xs font-bold px-2 py-1 rounded-lg shadow-sm ${
                    busData.operatorType === 'sltb' 
                    ? "bg-red-600 text-white" 
                    : "bg-blue-600 text-white"
                }`}>
                   {busData.operatorType === 'sltb' ? "SLTB" : "PVT"}
                </span>

                <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-lg border border-yellow-500 shadow-sm">
                  {busData.busPlate}
                </span>
              </div>
              <h1 className="text-2xl font-black text-gray-800 leading-none">
                {busData.destination}
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-1">
                From: {busData.origin}
              </p>
            </div>

            <div className="text-right pl-4">
              <div className="text-3xl font-black text-blue-600 leading-none">
                {Math.round(busData.speed * 3.6)}
              </div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                km/h
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Navigation
                  size={20}
                  style={{ transform: `rotate(${busData.heading || 0}deg)` }}
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Heading
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {getCardinalDirection(busData.heading)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Status
                </p>
                <p className="text-sm font-semibold text-gray-700">Active</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <MapPin size={20} />
              </div>
            </div>
          </div>

          <button
            className="w-full mt-6 bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            onClick={handleShare}
          >
            Share Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
