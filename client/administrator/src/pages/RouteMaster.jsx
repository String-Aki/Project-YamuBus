import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { FaTrash, FaSave, FaRoute, FaUndo, FaEraser, FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";

const API_URL = import.meta.env.VITE_API_URL;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const ghostIcon = new L.DivIcon({
  html: renderToStaticMarkup(<FaCircle className="text-blue-500 text-xs drop-shadow-md opacity-80" />),
  className: "bg-transparent",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const stopIcon = new L.DivIcon({
  html: renderToStaticMarkup(<FaMapMarkerAlt className="text-red-600 text-3xl drop-shadow-xl" />),
  className: "bg-transparent",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const RouteMaster = () => {
  const [routeNumber, setRouteNumber] = useState("");
  const [routeName, setRouteName] = useState("");
  
  const [waypoints, setWaypoints] = useState([]); 
  const [generatedPath, setGeneratedPath] = useState([]); 
  const [existingRoutes, setExistingRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/routes`, { headers: { Authorization: `Bearer ${token}` } });
      setExistingRoutes(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setWaypoints((prev) => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng, isStop: false }]);
      },
    });
    return null;
  };

  const toggleStopStatus = (index) => {
    setWaypoints(prev => prev.map((wp, i) => {
        if (i === index) return { ...wp, isStop: !wp.isStop };
        return wp;
    }));
  };

  const handleUndo = () => {
    if (waypoints.length > 0) setWaypoints((prev) => prev.slice(0, -1));
  };

  const handleRemoveSpecificPoint = (index) => {
    setWaypoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGeneratePath = async () => {
    if (waypoints.length < 2) return toast.error("Need at least 2 points.");
    setLoading(true);
    
    const coordinatesString = waypoints.map(pt => `${pt.lng},${pt.lat}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

    try {
      const res = await axios.get(url);
      const data = res.data.routes[0];
      const flippedCoordinates = data.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setGeneratedPath(flippedCoordinates);
      toast.success("Path generated!");
    } catch (error) {
      console.error(error);
      toast.error("Mapbox Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    if (!generatedPath.length) return toast.error("Generate path first.");

    const realStops = waypoints
        .filter(wp => wp.isStop)
        .map((wp, i) => ({ name: `Stop ${i+1}`, location: wp }));

    if(realStops.length < 2) {
        if(!window.confirm("Warning: You selected less than 2 'Real Stops'. Continue?")) return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(`${API_URL}/routes`, {
        routeNumber,
        routeName,
        path: generatedPath,
        stops: realStops
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Route Saved!");
      setWaypoints([]); setGeneratedPath([]); setRouteNumber(""); setRouteName("");
      fetchRoutes();
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete route?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_URL}/routes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchRoutes();
      toast.success("Deleted");
    } catch(e) { toast.error("Error deleting"); }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex bg-slate-50 font-sans text-slate-800 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      
      <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><FaRoute className="text-blue-500"/> Route Master</h2>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Shape the path, then pick stops</p>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
                <input type="text" value={routeNumber} onChange={e => setRouteNumber(e.target.value)} placeholder="Route Number (e.g. 177)" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"/>
                <input type="text" value={routeName} onChange={e => setRouteName(e.target.value)} placeholder="Route Name (e.g. Kaduwela - Col)" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 text-xs uppercase mb-2">How to Plot:</h4>
                <ol className="text-xs text-blue-600 space-y-1 list-decimal ml-4 font-medium">
                    <li>Click map to add <strong>Path Points</strong> (Blue Dots) to shape the road.</li>
                    <li><strong>Click a Blue Dot</strong> to turn it into a <strong>Real Stop</strong> (Red Marker).</li>
                    <li>Right-click any point to remove it.</li>
                </ol>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <button onClick={handleGeneratePath} disabled={loading} className="col-span-2 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-900 shadow-lg">{loading ? "Calculating..." : "1. Generate Path"}</button>
                <button onClick={handleUndo} className="bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 flex justify-center items-center gap-2"><FaUndo/> Undo</button>
                <button onClick={() => { setWaypoints([]); setGeneratedPath([]); }} className="bg-white border border-red-100 text-red-500 py-3 rounded-xl font-bold text-sm hover:bg-red-50 flex justify-center items-center gap-2"><FaEraser/> Reset</button>
                <button onClick={handleSaveRoute} className="col-span-2 bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg flex justify-center items-center gap-2"><FaSave/> 2. Save Route</button>
            </div>

            <hr className="border-slate-100 my-2"/>
            <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Saved Routes</h3>
                <div className="space-y-2">
                    {existingRoutes.map(r => (
                        <div key={r._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 group">
                            <div><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold mr-2">{r.routeNumber}</span><span className="text-xs font-bold text-slate-600">{r.routeName}</span></div>
                            <button onClick={() => handleDelete(r._id)} className="text-slate-300 hover:text-red-500"><FaTrash size={12}/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="w-2/3 h-full relative">
        <MapContainer center={[6.9271, 79.8612]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
          <MapClickHandler />
          
          {waypoints.map((wp, idx) => (
            <Marker 
                key={`${wp.lat}-${wp.lng}-${idx}`} 
                position={[wp.lat, wp.lng]}
                icon={wp.isStop ? stopIcon : ghostIcon}
                eventHandlers={{
                    click: () => toggleStopStatus(idx),
                    contextmenu: () => handleRemoveSpecificPoint(idx),
                }}
            >
                <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                    <span className="font-bold text-xs">
                        {wp.isStop ? "🛑 BUS STOP" : "🔹 Path Point"} <br/> 
                        (Click to Toggle)
                    </span>
                </Tooltip>
            </Marker>
          ))}

          {generatedPath.length > 0 && <Polyline positions={generatedPath} color="#3b82f6" weight={5} opacity={0.8} />}
        </MapContainer>
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-xl z-[400] border border-slate-200">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <FaCircle className="text-blue-500"/> {waypoints.filter(w => !w.isStop).length} Path Points
                <span className="text-slate-300">|</span>
                <FaMapMarkerAlt className="text-red-500"/> {waypoints.filter(w => w.isStop).length} Real Stops
            </span>
        </div>
      </div>
    </div>
  );
};

export default RouteMaster;