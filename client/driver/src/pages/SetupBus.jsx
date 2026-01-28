import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBus,
  FaSave,
  FaLink,
  FaCheckCircle,
  FaLock,
  FaEnvelope,
  FaServer,
} from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase.js";

const API_URL = import.meta.env.VITE_API_URL;

const SetupBus = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLoadFleet = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      const { data } = await axios.post(
        `${API_URL}/fleetmanagers/setup/buses`,
        {
          idToken: idToken,
        },
      );

      if (data.length === 0) {
        alert("No buses found for this manager.");
      } else {
        setBuses(data);
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.code
        ? error.code.replace("auth/", "")
        : "Authentication Failed";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!selectedBus) return;
    localStorage.setItem("MOUNTED_BUS_ID", selectedBus._id);
    localStorage.setItem("MOUNTED_BUS_PLATE", selectedBus.plateNumber);
    if (selectedBus.route) {
      localStorage.setItem("MOUNTED_ROUTE_INFO", selectedBus.route);
    } else {
      localStorage.setItem("MOUNTED_ROUTE_INFO", "No Route");
    }
    alert(`Device successfully bound to ${selectedBus.plateNumber}`);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-6 flex flex-col items-center justify-center font-sans">
      <div className="absolute top-6 left-6 flex items-center gap-2 opacity-50">
        <FaServer />{" "}
        <span className="text-xs font-mono tracking-widest uppercase">
          System Config v1.0
        </span>
      </div>

      <div className="w-full max-w-md bg-[#1a1d21] p-8 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>

        <div className="text-center mb-10 mt-2">
          <div className="w-20 h-20 bg-[#252830] rounded-full flex items-center justify-center mx-auto mb-5 text-yellow-500 shadow-inner border border-gray-700">
            {step === 1 ? (
              <FaLock className="text-3xl" />
            ) : (
              <FaLink className="text-3xl" />
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Device Kiosk Setup
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {step === 1
              ? "Authenticate as Fleet Manager to retrieve vehicle list."
              : "Select the physical vehicle to bind this hardware to."}
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                Manager Credentials
              </label>

              <div className="flex items-center bg-[#0f1115] rounded-lg border border-gray-700 px-4 py-3 mt-1 focus-within:border-yellow-500/50 focus-within:ring-1 focus-within:ring-yellow-500/50 transition-all">
                <FaEnvelope className="text-gray-600 mr-3" />
                <input
                  type="email"
                  placeholder="Manager Email"
                  className="bg-transparent w-full text-sm text-white outline-none placeholder-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex items-center bg-[#0f1115] rounded-lg border border-gray-700 px-4 py-3 mt-3 focus-within:border-yellow-500/50 focus-within:ring-1 focus-within:ring-yellow-500/50 transition-all">
                <FaLock className="text-gray-600 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-transparent w-full text-sm text-white outline-none placeholder-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleLoadFleet}
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-4 transition-all active:scale-95 shadow-lg shadow-yellow-900/10"
            >
              {loading ? "Verifying Credentials..." : "Authenticate"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#252830] p-3 rounded-lg border border-gray-700 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Account
              </p>
              <p className="text-white font-mono text-sm truncate px-4">
                {email}
              </p>
            </div>

            <div className="text-xs font-bold text-gray-500 uppercase ml-1 mt-4">
              Available Vehicles
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {buses.map((bus) => (
                <div
                  key={bus._id}
                  onClick={() => setSelectedBus(bus)}
                  className={`p-4 rounded-lg border flex justify-between items-center cursor-pointer transition-all ${
                    selectedBus?._id === bus._id
                      ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                      : "bg-[#0f1115] border-gray-800 hover:border-gray-600 hover:bg-[#15181c]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaBus />
                    <span className="font-mono text-sm font-bold tracking-wide">
                      {bus.plateNumber}
                    </span>
                  </div>
                    {selectedBus?._id === bus._id && <FaCheckCircle />}

                  <div className="ml-7 mt-1 text-xs text-gray-500 flex items-center gap-1">
                    {bus.route ? (
                        <span className="truncate max-w-[180px] font-medium text-gray-400">
                        {bus.route}
                      </span>
                    ) : (
                        <span className="italic opacity-50">
                        No Route Assigned
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-transparent border border-gray-700 text-gray-400 py-3 rounded-lg text-sm font-bold hover:text-white hover:border-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedBus}
                className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-black transition-all ${
                  selectedBus
                    ? "bg-yellow-500 hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                <FaLink /> Confirm Binding
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-center opacity-30 text-[10px] max-w-xs leading-relaxed">
        <p>
          WARNING: This action permanently associates this hardware ID with the
          selected vehicle database record.
        </p>
      </div>
    </div>
  );
};

export default SetupBus;
