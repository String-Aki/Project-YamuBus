import React from "react";
import { FaIdCard, FaUsers, FaBus, FaRoute } from "react-icons/fa";

const StatsOverview = ({ stats, setActiveTab }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
      <div className="flex flex-col gap-6">
        <div
          className="flex-1 bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-100 rounded-3xl p-8 relative overflow-hidden shadow-sm group hover:shadow-md transition-all cursor-pointer"
          onClick={() => setActiveTab("approvals")}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <FaIdCard size={120} />
          </div>
          <h3 className="text-orange-900/60 font-bold uppercase tracking-wider text-xs mb-2">
            Requires Action
          </h3>
          <p className="text-5xl font-black text-orange-600 mb-2">
            {stats.pendingManagers}
          </p>
          <p className="text-lg font-bold text-slate-700">
            Pending Manager Applications
          </p>
        </div>

        <div
          className="flex-1 bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-3xl p-8 relative overflow-hidden shadow-sm group hover:shadow-md transition-all cursor-pointer"
          onClick={() => setActiveTab("approvals")}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <FaBus size={120} />
          </div>
          <h3 className="text-red-900/60 font-bold uppercase tracking-wider text-xs mb-2">
            Requires Action
          </h3>
          <p className="text-5xl font-black text-red-600 mb-2">
            {stats.pendingBuses}
          </p>
          <p className="text-lg font-bold text-slate-700">
            Buses Awaiting Verification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          label="Active Managers"
          value={stats.totalManagers}
          icon={<FaUsers className="text-blue-500" />}
        />

        <StatCard
          label="Total Fleet Size"
          value={stats.totalBuses}
          icon={<FaBus className="text-purple-500" />}
        />

        <StatCard
          className="sm:col-span-2 sm:justify-self-center sm:w-[calc(60%-0.75rem)] w-full"
          label="Total Routes"
          value={stats.totalRoutes}
          icon={<FaRoute className="text-emerald-500" />}
        />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, className = "" }) => (
  <div
    className={`bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between h-full group hover:shadow-md transition-all ${className}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl text-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    <div>
      <p className="text-4xl font-black text-slate-800 mb-1">{value}</p>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
        {label}
      </p>
    </div>
  </div>
);

export default StatsOverview;
