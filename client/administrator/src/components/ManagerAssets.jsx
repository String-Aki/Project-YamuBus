import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBus,
  FaIdCard,
  FaUserTie,
  FaTrash,
  FaFileAlt,
  FaEdit,
  FaBan,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaRoute,
} from "react-icons/fa";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const ManagerAssets = ({ managerId, onOpenDoc }) => {
  const [assets, setAssets] = useState({ buses: [], drivers: [] });
  const [loading, setLoading] = useState(true);

  const [editingBusId, setEditingBusId] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState([]);

  useEffect(() => {
    fetchAssets();
    fetchRoutes();
  }, [managerId]);

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `${API_URL}/admin/managers/${managerId}/assets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAssets(res.data);
    } catch (error) {
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/routes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableRoutes(res.data);
    } catch (error) {
      console.error("Failed to load routes");
    }
  };

  const handleEditClick = (bus) => {
    setEditingBusId(bus._id);
    setSelectedRoute(bus.route);
  };

  const handleSaveRoute = async (busId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const routeObj = availableRoutes.find(
        (r) => r.routeNumber === selectedRoute || r._id === selectedRoute,
      );
      const routeValue = routeObj
        ? `${routeObj.routeNumber} - ${routeObj.routeName}`
        : selectedRoute;

      await axios.patch(
        `${API_URL}/admin/buses/${busId}`,
        { route: routeValue },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Route updated");
      setEditingBusId(null);
      fetchAssets();
    } catch (error) {
      toast.error("Failed to update route");
    }
  };

  const handleBanBus = async (bus) => {
    const isBanned = bus.verificationStatus === "banned";
    const action = isBanned ? "Unban" : "Ban";

    if (!window.confirm(`Are you sure you want to ${action} this vehicle?`))
      return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${API_URL}/admin/buses/${bus._id}`,
        { verificationStatus: isBanned ? "verified" : "banned" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Vehicle ${isBanned ? "Restored" : "Banned"}`);
      fetchAssets();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm("Delete this bus permanently?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_URL}/admin/buses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bus deleted");
      setAssets((prev) => ({
        ...prev,
        buses: prev.buses.filter((b) => b._id !== id),
      }));
    } catch (error) {
      toast.error("Failed to delete bus");
    }
  };

  if (loading)
    return (
      <div className="text-center py-4 text-sm text-slate-400 font-bold">
        Loading Assets...
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FaBus /> Registered Buses ({assets.buses.length})
        </h4>

        {assets.buses.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No buses.</p>
        ) : (
          <div className="space-y-3">
            {assets.buses.map((bus) => (
              <div
                key={bus._id}
                className={`bg-white p-4 rounded-xl border transition-all group ${bus.verificationStatus === "banned" ? "border-red-200 bg-red-50/30" : "border-slate-200 hover:shadow-md"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg ${bus.verificationStatus === "banned" ? "bg-red-100 text-red-500" : "bg-blue-50 text-blue-500"}`}
                    >
                      <FaBus />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {bus.plateNumber}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          bus.verificationStatus === "verified"
                            ? "bg-green-100 text-green-700"
                            : bus.verificationStatus === "banned"
                              ? "bg-red-600 text-white"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {bus.verificationStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {editingBusId === bus._id ? (
                      <>
                        <button
                          onClick={() => handleSaveRoute(bus._id)}
                          className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                          title="Save"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => setEditingBusId(null)}
                          className="p-2 bg-slate-100 text-slate-500 rounded hover:bg-slate-200"
                          title="Cancel"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(bus)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Route"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleBanBus(bus)}
                          className={`p-2 rounded transition-colors ${bus.verificationStatus === "banned" ? "text-green-500 hover:bg-green-50" : "text-slate-400 hover:text-orange-500 hover:bg-orange-50"}`}
                          title={
                            bus.verificationStatus === "banned"
                              ? "Unban"
                              : "Ban Vehicle"
                          }
                        >
                          {bus.verificationStatus === "banned" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaBan />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteBus(bus._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-3 pl-[52px]">
                  {editingBusId === bus._id ? (
                    <select
                      value={selectedRoute}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                      className="w-full text-xs font-bold p-2 border border-blue-300 rounded bg-blue-50 focus:outline-none"
                    >
                      <option value={bus.route}>Keep: {bus.route}</option>
                      {availableRoutes.map((r) => (
                        <option
                          key={r._id}
                          value={`${r.routeNumber} - ${r.routeName}`}
                        >
                          {r.routeNumber} - {r.routeName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <FaRoute className="text-slate-300" /> {bus.route}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pl-[52px]">
                  <button
                    onClick={(e) =>
                      onOpenDoc(
                        e,
                        `${bus.plateNumber} Registration`,
                        bus.registrationCertificate,
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
                  >
                    <FaFileAlt /> Registration
                  </button>
                  <button
                    onClick={(e) =>
                      onOpenDoc(e, `${bus.plateNumber} Permit`, bus.routePermit)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold hover:bg-purple-100 transition-colors border border-purple-100"
                  >
                    <FaFileAlt /> Route Permit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FaIdCard /> Registered Drivers ({assets.drivers.length})
        </h4>
        {assets.drivers.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No drivers.</p>
        ) : (
          <div className="space-y-2">
            {assets.drivers.map((driver) => (
              <div
                key={driver._id}
                className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center text-xs">
                    <FaUserTie />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {driver.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {driver.licenseNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBus(driver._id)}
                  className="text-slate-300 hover:text-red-500 p-1"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerAssets;
