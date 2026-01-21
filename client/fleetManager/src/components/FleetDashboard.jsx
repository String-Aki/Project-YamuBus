import React, { useState, useEffect } from "react";
import {
  FaSignOutAlt,
  FaPlus,
  FaBus,
  FaMapMarkerAlt,
  FaCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import axios from "axios";

const FleetDashboard = () => {
  const [user, setUser] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // REPLACE THIS WITH YOUR LAPTOP IP IF TESTING ON MOBILE
  const API_URL = "http://localhost:5000/api";
  // const API_URL = 'http://192.168.1.5:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          navigate("/login");
          return;
        }

        const token = await firebaseUser.getIdToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Get User Profile (to check status)
        const userRes = await axios.get(`${API_URL}/fleetmanagers/me`, config);
        setUser(userRes.data);

        // 2. Get Buses (Only if approved)
        if (userRes.data.status === "approved") {
          // We haven't built this route yet, so this will fail gracefully for now
          // const busRes = await axios.get(`${API_URL}/buses`, config);
          // setBuses(busRes.data);

          // Temporary Dummy Data for UI Testing
          setBuses([
            {
              _id: "1",
              licensePlate: "ND-4589",
              routeName: "Colombo - Kandy",
              status: "online",
            },
            {
              _id: "2",
              licensePlate: "WP-1122",
              routeName: "Galle - Matara",
              status: "offline",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 text-brand-brown font-bold">
        Loading Fleet...
      </div>
    );

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-100 relative">
      {/* 1. HEADER */}
      <div className="bg-brand-dark text-white p-5 flex justify-between items-center shadow-md z-10">
        <div>
          <h1 className="text-xl font-bold">Fleet Command</h1>
          <p className="text-xs text-gray-400">Welcome, {user?.companyName}</p>
        </div>
        <FaSignOutAlt
          className="text-xl cursor-pointer hover:text-red-400"
          onClick={handleLogout}
        />
      </div>

      {/* 2. STATUS BANNER (Dynamic) */}
      {user?.status === "pending" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-4 rounded shadow-sm">
          <p className="font-bold">Account Under Review</p>
          <p className="text-sm">
            You cannot add buses until an Admin approves your account.
          </p>
        </div>
      )}

      {user?.status === "approved" && (
        <div className="bg-white p-4 m-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs uppercase font-bold">
              Total Fleet
            </p>
            <h2 className="text-3xl font-bold text-brand-brown">
              {buses.length}
            </h2>
          </div>
          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <FaBus />
          </div>
        </div>
      )}

      {/* 3. BUS LIST (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 custom-scrollbar">
        {user?.status === "approved" ? (
          buses.length > 0 ? (
            buses.map((bus) => (
              <div
                key={bus._id}
                className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {bus.licensePlate}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${bus.status === "online" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    <FaCircle className="text-[8px]" />
                    {bus.status === "online" ? "Broadcasting" : "Offline"}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaMapMarkerAlt className="mr-2 text-brand-brown" />
                  {bus.routeName}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 mt-10">
              <p>No buses added yet.</p>
              <p className="text-sm">Tap the + button to start.</p>
            </div>
          )
        ) : (
          <div className="text-center text-gray-400 mt-20 opacity-50">
            <FaBus className="text-6xl mx-auto mb-4" />
            <p>Features Locked</p>
          </div>
        )}
      </div>

      {/* 4. FAB (Floating Action Button) - Only show if approved */}
      {user?.status === "approved" && (
        <button
          onClick={() => alert("Add Bus Modal Coming Soon!")}
          className="absolute bottom-6 right-6 w-14 h-14 bg-brand-brown text-white rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-90 transition-transform hover:bg-[#8a4525]"
        >
          <FaPlus />
        </button>
      )}
    </div>
  );
};

export default FleetDashboard;
