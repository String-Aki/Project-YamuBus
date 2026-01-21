import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaPlus, FaChevronRight, FaUserCircle, FaCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth';
import axios from 'axios';

const FleetDashboard = () => {
  const [user, setUser] = useState(null);
  const [buses, setBuses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // REPLACE WITH YOUR IP IF ON MOBILE
//   const API_URL = 'http://localhost:5000/api'; 
  const API_URL = 'http://192.168.43.96:5000/api'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) { navigate('/login'); return; }

        const token = await firebaseUser.getIdToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Get User Profile
        const userRes = await axios.get(`${API_URL}/fleetmanagers/me`, config);
        setUser(userRes.data);

        // 2. Get Buses (Mock Data with STATUS added)
        if (userRes.data.status === 'approved') {
            setBuses([
                { _id: '1', licensePlate: 'ND - 5681', status: 'online' },
                { _id: '2', licensePlate: 'ND - 5682', status: 'offline' },
                { _id: '3', licensePlate: 'ND - 5683', status: 'online' },
                { _id: '4', licensePlate: 'ND - 5684', status: 'offline' },
                { _id: '5', licensePlate: 'ND - 5685', status: 'online' },
            ]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
         if(error.response && error.response.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-brand-brown text-white font-bold">Loading...</div>;

  return (
    <div className="flex flex-col h-[100dvh] bg-brand-brown relative">
      
      {/* --- HEADER --- */}
      <div className="bg-brand-dark text-white p-6 pt-12 pb-12 rounded-b-[3rem] flex justify-between items-center shadow-lg flex-none z-10 relative">
        <div className="flex items-center gap-4">
            <FaUserCircle className="text-5xl text-gray-300 cursor-pointer" onClick={handleLogout} /> 
            <div>
                <p className="text-gray-400 text-sm">Welcome</p>
                <h1 className="text-xl font-bold leading-none">{user?.companyName || 'UserName'}</h1>
            </div>
        </div>

        {user?.status === 'approved' && (
            <button 
                onClick={() => alert("Add Bus function coming next!")}
                className="flex items-center gap-2 bg-[#3a4149] hover:bg-gray-700 text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-sm"
            >
                <span>Add Bus</span>
                <FaPlus className="text-sm" />
            </button>
        )}
      </div>

      {/* --- PENDING BANNER --- */}
      {user?.status === 'pending' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mx-4 -mt-8 mb-4 rounded shadow-sm z-20 relative">
          <p className="font-bold">Account Under Review</p>
          <p className="text-sm">Admin approval required to add buses.</p>
        </div>
      )}

      {/* --- BUS LIST --- */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar  z-0">
        {user?.status === 'approved' ? (
             buses.length > 0 ? (
                buses.map((bus) => (
                    <div key={bus._id} className="flex items-center justify-between bg-[#f8f8f8] p-4 rounded-[2rem] shadow-md mb-4 cursor-pointer active:scale-95 transition-transform">
                        
                        {/* Left: Plate + Status */}
                        <div className="flex flex-col ml-2">
                             <h3 className="text-xl font-bold text-gray-800 mb-1">{bus.licensePlate}</h3>
                             
                             {/* Status Pill */}
                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${
                                 bus.status === 'online' 
                                 ? 'bg-green-100 text-green-700' 
                                 : 'bg-gray-200 text-gray-500'
                             }`}>
                                <FaCircle className="text-[8px]" />
                                {bus.status === 'online' ? 'Online' : 'Offline'}
                             </span>
                        </div>
                        
                        {/* Right: Arrow Button */}
                        <div className="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center shadow-sm">
                            <FaChevronRight className="text-gray-600 text-xl" />
                        </div>
                    </div>
                ))
             ) : (
                <div className="text-center text-white mt-10 opacity-80">
                    <p>No buses found.</p>
                </div>
             )
        ) : null}
      </div>

    </div>
  );
};

export default FleetDashboard;