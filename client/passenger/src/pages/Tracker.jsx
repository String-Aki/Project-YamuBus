import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { ArrowLeft, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';

// Fix Icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const createBusIcon = (heading) => {
  return L.divIcon({
    className: 'bus-marker',
    html: `
      <div style="
        transform: rotate(${heading}deg); 
        transition: transform 0.5s ease;
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="white" stroke="#2563eb" stroke-width="3"/>
          <path d="M12 6L16 14H8L12 6Z" fill="#2563eb"/> 
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20] // Center of the icon
  });
};
// L.Marker.prototype.options.icon = DefaultIcon;

// Map Updater Component (Smooth Animation)
const MapEffect = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 16, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
};

const Tracker = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Start with data passed from Home Screen (Instant Load)
  const [bus, setBus] = useState(location.state?.busData || null);

  useEffect(() => {
    // Connect to Server
    // ⚠️ USE YOUR PUBLIC TUNNEL URL HERE IF USING PHONES
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL; 
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', () => console.log("✅ Tracker Connected"));

    // 2. Listen for Live Updates
    socket.on('busUpdate', (data) => {
      if (data.busId === busId) {
        setBus(data);
      }
    });

    // 3. Fallback: If we refreshed the page and have no state, ask for it
    if (!bus) {
        socket.on('initialFleetState', (fleet) => {
            const found = fleet.find(b => b.busId === busId);
            if (found) setBus(found);
        });
    }

    socket.on('busOffline', (data) => {
      if (data.busId === busId) {
        alert("Trip Completed! This bus has reached its destination.");
        navigate('/'); // Go back to home
      }
    });

    return () => socket.disconnect();
  }, [busId]);

  return (
    <div className="h-screen w-full relative flex flex-col bg-gray-100">
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-[1000]">
        <button 
          onClick={() => navigate('/')} 
          className="bg-white p-3 rounded-full shadow-xl text-gray-700 hover:scale-105 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* The Map */}
      {!bus ? (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Connecting to Bus...</p>
        </div>
      ) : (
        <MapContainer 
            center={[bus.lat, bus.lng]} 
            zoom={16} 
            className="flex-1 w-full h-full z-0" 
            zoomControl={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <Marker position={[bus.lat, bus.lng]} icon={createBusIcon(bus.heading || 0)}>
                <Popup className="font-bold">{bus.busPlate}</Popup>
            </Marker>

            <MapEffect center={[bus.lat, bus.lng]} />
        </MapContainer>
      )}

      {/* Bottom Card */}
      {bus && (
        <div className="bg-white p-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-[1000] relative">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                            {bus.routeNo || "BUS"}
                        </span>
                        <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            LIVE
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 leading-none mb-1">
                        {bus.destination || "Unknown"}
                    </h2>
                    <p className="text-gray-500 text-sm">From {bus.origin}</p>
                </div>

                <div className="text-right">
                    <p className="text-4xl font-black text-blue-600 tracking-tighter">
                        {Math.round(bus.speed * 3.6)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">km/h</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;