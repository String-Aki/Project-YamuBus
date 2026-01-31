import React from 'react';
import { Navigation, MapPin } from 'lucide-react';

const BusCard = ({ bus, onClick }) => {
  
  const renderOperatorBadge = () => {
    const isSLTB = bus.operatorType === 'sltb';
    
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
        isSLTB 
          ? "bg-red-600 text-white" 
          : "bg-blue-600 text-white"
      }`}>
        {isSLTB ? "SLTB" : "PVT"}
      </span>
    );
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 relative overflow-hidden"
    >
      <div className="absolute top-5 right-5 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-xs font-bold text-green-600 tracking-wider">LIVE</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 pr-8"> 
          <div className="flex items-center gap-2 mb-1">
                {renderOperatorBadge()}
            </div>
            <h3 className="text-xl font-bold text-gray-800 leading-tight">
                {bus.destination || "Unknown"}
            </h3>
            
            <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm font-medium">
                 {bus.distance !== null && bus.distance !== undefined ? (
                    <span className="text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded text-xs font-bold">
                        <MapPin size={10} />
                        {bus.distance < 1000 
                            ? `${Math.round(bus.distance)} m away`
                            : `${(bus.distance / 1000).toFixed(1)} km away`
                        }
                    </span>
                 ) : (
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                        From: {bus.origin}
                    </span>
                 )}
            </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wide">
            <Navigation size={14} />
            <span>Moving Now</span>
        </div>
        
        <div className="flex items-center gap-1 text-blue-600 font-bold">
            <span className="text-lg">{Math.round(bus.speed * 3.6)}</span>
            <span className="text-xs mt-1">km/h</span>
        </div>
      </div>
    </div>
  );
};

export default BusCard;