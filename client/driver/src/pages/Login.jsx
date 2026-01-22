import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaIdCard, FaVideo, FaExclamationCircle } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL; 

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader", 
      { 
        fps: 8, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    const onScanSuccess = async (decodedText, decodedResult) => {
      scanner.clear();
      setLoading(true);
      setError('');

      try {
        const credentials = JSON.parse(decodedText);

        if (!credentials.u || !credentials.p) {
            throw new Error("Invalid Badge Format");
        }

        const busId = localStorage.getItem('MOUNTED_BUS_ID');
        
        const { data } = await axios.post(`${API_URL}/drivers/login`, {
            username: credentials.u,
            password: credentials.p
        });

        localStorage.setItem('driverInfo', JSON.stringify(data));
        navigate('/dashboard');

      } catch (err) {
        console.error(err);
        setError('Invalid Badge or Login Failed');

        setLoading(false);
      }
    };

    const onScanFailure = (error) => {
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner. ", error));
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-driver-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

      <div className="w-full max-w-md bg-[#22252a] rounded-3xl p-6 shadow-2xl border border-gray-700">

        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white tracking-wide">Driver Login</h1>
            <p className="text-gray-400 text-sm mt-1">Scan your ID Badge to start</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-black aspect-square border-2 border-dashed border-gray-600 flex items-center justify-center">
            
            {loading ? (
                <div className="text-center animate-pulse">
                    <FaIdCard className="text-5xl text-driver-accent mx-auto mb-3" />
                    <p className="text-white font-bold">Verifying Badge...</p>
                </div>
            ) : (
                <div id="reader" className="w-full h-full"></div>
            )}

            {!loading && <div className="absolute inset-0 pointer-events-none border-[30px] border-black/30"></div>}
        </div>

        {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-2 text-red-400 text-sm font-bold animate-pulse">
                <FaExclamationCircle />
                <span>{error}</span>
            </div>
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