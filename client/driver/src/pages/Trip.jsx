import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStopCircle, FaClock, FaSatelliteDish } from 'react-icons/fa';

const Trip = () => {
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tripId, setTripId] = useState(null);
  const [busPlate, setBusPlate] = useState('');

  useEffect(() => {
    const tId = localStorage.getItem('CURRENT_TRIP_ID');
    const bPlate = localStorage.getItem('MOUNTED_BUS_PLATE');
    const driverData = JSON.parse(localStorage.getItem('driverInfo'));

    if (!tId || !driverData) {
        navigate('/dashboard'); 
        return;
    }

    setTripId(tId);
    setBusPlate(bPlate);

    // Timer
    const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    
    // Format: HH:MM:SS if over an hour, otherwise MM:SS
    if (hours > 0) {
        return `${hours}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndTrip = async () => {
    if (!window.confirm("CONFIRM: End this trip?")) return;

    try {
        const driverData = JSON.parse(localStorage.getItem('driverInfo'));
        
        await axios.post('http://192.168.43.185:5000/api/trips/end', 
            { tripId }, 
            { headers: { Authorization: `Bearer ${driverData.token}` } }
        );

        localStorage.removeItem('CURRENT_TRIP_ID');
        navigate('/dashboard');

    } catch (error) {
        alert("Error ending trip. Check connection.");
        console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* === STATUS BAR === */}
      <div className="bg-[#1a1d21] p-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
            {/* Pulsing Recording Dot */}
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

      {/* === MAIN DISPLAY === */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        
        {/* BUS INFO */}
        <div>
            <h2 className="text-gray-600 font-bold uppercase tracking-widest text-sm mb-2">Vehicle ID</h2>
            <h1 className="text-4xl font-black text-white tracking-tighter">{busPlate}</h1>
        </div>

        {/* BIG TIMER */}
        <div className="w-full max-w-sm bg-[#121418] border border-gray-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            
            <div className="flex flex-col items-center">
                <FaClock className="text-4xl text-green-500 mb-4" />
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Elapsed Time</span>
                <span className="font-mono text-6xl font-black text-white tabular-nums tracking-tight">
                    {formatTime(elapsedTime)}
                </span>
            </div>
        </div>

      </div>

      {/* === FOOTER === */}
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