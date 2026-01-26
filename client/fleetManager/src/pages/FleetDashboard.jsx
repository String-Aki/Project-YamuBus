import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaChevronRight,
  FaUserCircle,
  FaCircle,
  FaUserTie,
  FaBus,
  FaSignOutAlt,
  FaIdCard,
  FaExclamationTriangle,
  FaTrash,
  FaBuilding,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase.js";
import { signOut } from "firebase/auth";
import axios from "axios";

import AddBusModal from "../components/buses/AddBusModal.jsx";
import BusDetailsModal from "../components/buses/BusDetailsModal.jsx";
import AddDriverModal from "../components/drivers/AddDriverModal.jsx";
import DriverDetailsModal from "../components/drivers/DriverDetailsModal.jsx";

const FleetDashboard = () => {
  const [user, setUser] = useState(null);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("buses");
  const [selectedBus, setSelectedBus] = useState(null);
  const [isAddBusOpen, setIsAddBusOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return;

        const token = await firebaseUser.getIdToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const userRes = await axios.get(`${API_URL}/fleetmanagers/me`, config);
        setUser(userRes.data);

        if (userRes.data.status === "approved") {
          const busRes = await axios.get(
            `${API_URL}/fleetmanagers/buses`,
            config,
          );
          if (Array.isArray(busRes.data)) {
            const sortedBuses = busRes.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
            setBuses(sortedBuses);
          }

          const driverRes = await axios.get(
            `${API_URL}/fleetmanagers/drivers`,
            config,
          );
          if (Array.isArray(driverRes.data)) {
            setDrivers(
              driverRes.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
              ),
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      await signOut(auth);
      navigate("/login");
    }
  };

  const handleBusAdded = (newBus) => {
    setBuses([newBus, ...buses]);
  };

  const handleBusUpdated = (updatedBus) => {
    setBuses(buses.map((b) => (b._id === updatedBus._id ? updatedBus : b)));
  };

  const handleBusDeleted = (busId) => {
    setBuses(buses.filter((b) => b._id !== busId));
  };

  const handleDriverAdded = (newDriver) => {
    setDrivers([newDriver, ...drivers]);
  };

  const handleDriverUpdated = (updatedDriver) => {
    setDrivers(
      drivers.map((d) => (d._id === updatedDriver._id ? updatedDriver : d)),
    );
  };

  const handleDriverDeleted = (driverId) => {
    setDrivers(drivers.filter((d) => d._id !== driverId));
    setSelectedDriver(null);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-brand-brown text-white font-bold">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col h-[100dvh] bg-brand-brown relative">
      <div className="bg-brand-dark text-white rounded-b-[2.5rem] shadow-xl flex-none z-20 overflow-hidden">
        <div className="flex justify-between items-center p-6 pb-2">
          <div className="flex items-center gap-3">
            {user?.operatorType === "sltb" ? (
              <FaBuilding className="text-4xl text-blue-300" />
            ) : (
              <FaUserCircle className="text-4xl text-gray-300" />
            )}

            <div className="leading-tight">
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                {user?.operatorType === "sltb"
                  ? "SLTB Depot"
                  : "Private Operator"}
              </p>

              <h1 className="text-lg font-bold truncate max-w-[200px]">
                {user?.organizationName || "Manager"}
              </h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500/20 "
          >
            <FaSignOutAlt />
          </button>
        </div>

        <div className="px-9 pb-0 mt-4 flex items-end justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("buses")}
              className={`pb-4 text-sm font-bold border-b-4 transition-all ${activeTab === "buses" ? "border-brand-brown text-white" : "border-transparent text-gray-500"}`}
            >
              Fleet
            </button>
            <button
              onClick={() => setActiveTab("drivers")}
              className={`pb-4 text-sm font-bold border-b-4 transition-all ${activeTab === "drivers" ? "border-brand-brown text-white" : "border-transparent text-gray-500"}`}
            >
              Drivers
            </button>
          </div>
          {user?.status === "approved" && (
            <button
              onClick={() =>
                activeTab === "buses"
                  ? setIsAddBusOpen(true)
                  : setIsAddDriverOpen(true)
              }
              className="mb-3 flex items-center gap-2 bg-[#3a4149] text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg active:scale-95 transition-all"
            >
              <FaPlus />{" "}
              <span>{activeTab === "buses" ? "Add Bus" : "Add Driver"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10 custom-scrollbar z-0">
        {user?.status === "pending" && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r shadow-md mb-6 animate-fadeIn">
            <div className="flex items-center gap-2 mb-1">
              <FaExclamationTriangle />
              <p className="font-bold">Account Under Review</p>
            </div>
            <p className="text-sm opacity-90">
              An admin must approve your profile before you can manage your
              fleet.
            </p>
          </div>
        )}

        {/* Bus List View */}
        {activeTab === "buses" &&
          (buses.length > 0 ? (
            buses.map((bus) => (
              <div
                key={bus._id}
                onClick={() => setSelectedBus(bus)}
                className="flex items-center justify-between bg-[#f8f8f8] p-4 rounded-[2rem] shadow-md mb-4 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="flex flex-col ml-2">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {bus.plateNumber}
                  </h3>

                  <p className="text-xs text-gray-500 font-bold mb-1 flex items-center gap-1">
                    <FaBus className="text-gray-400" /> {bus.route}
                  </p>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold w-fit uppercase tracking-wide
                            ${bus.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}
                  >
                    <FaCircle className="text-[6px]" />
                    {bus.isActive ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-600">
                  <FaChevronRight className="text-sm" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center mt-10 text-white/80 animate-fadeIn">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <FaBus className="text-4xl text-white" />
              </div>
              <h2 className="text-2xl font-bold">No Buses Yet</h2>
              <p className="text-sm text-center max-w-xs mt-2 opacity-80">
                {user?.status === "approved"
                  ? 'Tap "+ Add Bus" to upload documents and register your first vehicle.'
                  : "Once approved, you will be able to register your vehicles here."}
              </p>
            </div>
          ))}

        {activeTab === "drivers" &&
          (drivers.length > 0 ? (
            drivers.map((driver) => (
              <div
                key={driver._id}
                onClick={() => setSelectedDriver(driver)}
                className="flex items-center justify-between bg-[#f8f8f8] p-4 rounded-[2rem] shadow-md mb-4 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="flex flex-col ml-2">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {driver.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase mb-1">
                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md">
                      {driver.username}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center text-gray-600">
                  <FaChevronRight className="text-sm" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center mt-10 text-white/80 animate-fadeIn">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <FaUserTie className="text-4xl text-white" />
              </div>
              <h2 className="text-2xl font-bold">No Drivers Yet</h2>
              <p className="text-sm text-center max-w-xs mt-2 opacity-80">
                {user?.status === "approved"
                  ? "Tap + Add Drivers to add drivers to your fleet."
                  : "Approval required to add drivers."}
              </p>
            </div>
          ))}
      </div>

      <AddBusModal
        isOpen={isAddBusOpen}
        onClose={() => setIsAddBusOpen(false)}
        onBusAdded={handleBusAdded}
      />

      <BusDetailsModal
        bus={selectedBus}
        isOpen={!!selectedBus}
        onClose={() => setSelectedBus(null)}
        onUpdate={handleBusUpdated}
        onDelete={handleBusDeleted}
      />

      <AddDriverModal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        onDriverAdded={handleDriverAdded}
      />

      <DriverDetailsModal
        driver={selectedDriver}
        isOpen={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        onUpdate={handleDriverUpdated}
        onDelete={handleDriverDeleted}
      />
    </div>
  );
};

export default FleetDashboard;
