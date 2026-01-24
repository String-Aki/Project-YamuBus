import React, { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaIdCard,
  FaVideo,
  FaExclamationCircle,
  FaFileUpload,
  FaCamera,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const startCamera = () => {
    setIsCameraOpen(true);
    setError("");

    const html5QrCode = new Html5Qrcode("reader");

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          html5QrCode.stop().then(() => {
            setIsCameraOpen(false);
            html5QrCode.clear();
            handleLogin(decodedText);
          });
        },
        (errorMessage) => {},
      )
      .catch((err) => {
        setIsCameraOpen(false);
        setError("Camera failed to start. Please use Image Upload.");
      });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("reader");
    setError("");
    setLoading(true);

    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      handleLogin(decodedText);
    } catch (err) {
      setLoading(false);
      setError("Could not read QR from this image. Try another.");
    }
  };

  const handleLogin = async (qrData) => {
    setLoading(true);
    setError('');

    try {
        let credentials;
        try {
            credentials = JSON.parse(qrData);
        } catch (e) {
            throw new Error("Bad QR: This is not a valid Driver Badge.");
        }

        if (!credentials.u || !credentials.p) {
            throw new Error("Incomplete Badge: Missing name or ID.");
        }

        const busId = localStorage.getItem('MOUNTED_BUS_ID');
        
        const { data } = await axios.post(`${API_URL}/drivers/login`, {
            username: credentials.u,
            password: credentials.p,
            busId: busId
        });

        localStorage.setItem('driverInfo', JSON.stringify(data));
        navigate('/dashboard');

    } catch (err) {
        console.error(err);
        
        let friendlyMsg = "Login failed. Please try again.";

        if (err.response) {
            const status = err.response.status;
            
            if (status === 400) friendlyMsg = "Invalid Badge Data. Please rescan.";
            if (status === 401) friendlyMsg = "Wrong Badge! Access Denied.";
            if (status === 403) friendlyMsg = "You are not authorized for this specific bus.";
            if (status === 404) friendlyMsg = "Driver account not found.";
            if (status === 500) friendlyMsg = "Server is having trouble. Try again later.";
        
        } else if (err.request) {
            friendlyMsg = "No Internet! Check your data connection.";
        } else {
            friendlyMsg = err.message;
        }

        setError(friendlyMsg);
        setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        if (html5QrCode.isScanning) {
          html5QrCode.stop().catch((err) => {});
        }
      } catch (e) {}
    };
  }, []);

  return (
    <div className="min-h-screen bg-driver-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

      <div className="w-full max-w-md bg-[#22252a] rounded-3xl p-6 shadow-2xl border border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Driver Login
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Scan your ID Badge to start
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-2 text-red-400 text-sm font-bold animate-pulse">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        <div className="relative overflow-hidden rounded-2xl bg-black aspect-square border-2 border-dashed border-gray-600 flex flex-col items-center justify-center">
          {loading && !isCameraOpen && (
            <div className="text-center animate-pulse">
              <FaIdCard className="text-5xl text-blue-500 mx-auto mb-3" />
              <p className="text-white font-bold">Verifying Badge...</p>
            </div>
          )}

          <div
            id="reader"
            className={`w-full h-full ${!isCameraOpen && "hidden"}`}
          ></div>

          {!isCameraOpen && !loading && (
            <div className="flex flex-col gap-4 w-full px-8">
              <button
                onClick={startCamera}
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all"
              >
                <FaCamera size={20} />
                Scan with Camera
              </button>

              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <div className="h-px bg-gray-700 flex-1"></div>
                OR
                <div className="h-px bg-gray-700 flex-1"></div>
              </div>

              <label className="flex items-center justify-center gap-3 bg-[#2a2e35] hover:bg-[#32363e] text-gray-300 py-3 rounded-xl font-bold cursor-pointer transition-all border border-gray-600">
                <FaFileUpload size={20} />
                Upload QR Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          )}
        </div>

        {isCameraOpen && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition"
          >
            Cancel Scan
          </button>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Place your QR code inside the frame.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
