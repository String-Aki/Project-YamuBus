import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaChevronRight, FaUserCircle, FaCircle, FaUserTie, 
  FaBus, FaSignOutAlt, FaIdCard, FaExclamationTriangle 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth';
import axios from 'axios';

import AddBusModal from './AddBusModal';
import BusDetailsModal from './BusDetailsModal'; 

const FleetDashboard = () => {
  const [user, setUser] = useState(null);
  const [buses, setBuses] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('buses'); 
  const [selectedBus, setSelectedBus] = useState(null);
  const [isAddBusOpen, setIsAddBusOpen] = useState(false);

  const navigate = useNavigate();
  // const API_URL = 'http://localhost:5000/api';
  const API_URL = 'http://192.168.43.96:5000/api'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return; 

        const token = await firebaseUser.getIdToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const userRes = await axios.get(`${API_URL}/fleetmanagers/me`, config);
        setUser(userRes.data);

        if (userRes.data.status === 'approved') {
            const busRes = await axios.get(`${API_URL}/fleetmanagers/buses`, config);
            if(Array.isArray(busRes.data)){
                const sortedBuses = busRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setBuses(sortedBuses);
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
    if(window.confirm("Are you sure you want to sign out?")){
        await signOut(auth);
        navigate('/login');
    }
  };

  const handleBusAdded = (newBus) => {
    setBuses([newBus, ...buses]);
  };

  const handleBusUpdated = (updatedBus) => {
    setBuses(buses.map(b => b._id === updatedBus._id ? updatedBus : b));
  };

  const handleBusDeleted = (busId) => {
    setBuses(buses.filter(b => b._id !== busId));
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-brand-brown text-white font-bold">Loading...</div>;

  return (
    <div className="flex flex-col h-[100dvh] bg-brand-brown relative">
      
      {/* ---- HEADER ----*/}
      <div className="bg-brand-dark text-white rounded-b-[2.5rem] shadow-xl flex-none z-20 overflow-hidden">
        
        <div className="flex justify-between items-center p-6 pb-2">
            <div className="flex items-center gap-3">
                <FaUserCircle className="text-4xl text-gray-300" /> 
                <div className="leading-tight">
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Fleet Manager</p>
                    <h1 className="text-lg font-bold truncate max-w-[150px]">{user?.companyName || 'Manager'}</h1>
                </div>
            </div>
            
            <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500/20 active:scale-95 transition-all"
            >
                <FaSignOutAlt className="text-sm text-gray-300 hover:text-red-400" />
            </button>
        </div>

        <div className="px-9 pb-0 mt-4 flex items-end justify-between">
            <div className="flex gap-4">
                <button 
                    onClick={() => setActiveTab('buses')}
                    className={`pb-4 text-sm font-bold border-b-4 transition-all ${activeTab === 'buses' ? 'border-brand-brown text-white' : 'border-transparent text-gray-500'}`}
                >
                    Fleet
                </button>
                <button 
                    onClick={() => setActiveTab('drivers')}
                    className={`pb-4 text-sm font-bold border-b-4 transition-all ${activeTab === 'drivers' ? 'border-brand-brown text-white' : 'border-transparent text-gray-500'}`}
                >
                    Drivers
                </button>
            </div>

            {user?.status === 'approved' && (
                <button 
                    onClick={() => activeTab === 'buses' ? setIsAddBusOpen(true) : alert("Add Driver Coming Soon!")}
                    className="mb-3 flex items-center gap-2 bg-[#3a4149] active:bg-gray-600 text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg border border-gray-600 active:scale-95 transition-all"
                >
                    {activeTab === 'buses' ? <FaPlus /> : <FaUserTie />}
                    <span>{activeTab === 'buses' ? 'Add Bus' : 'Add Driver'}</span>
                </button>
            )}
        </div>
      </div>

      {/* ---- MAIN CONTENT ---- */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10 custom-scrollbar z-0">
        
        {user?.status === 'pending' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r shadow-md mb-6 animate-fadeIn">
                <div className="flex items-center gap-2 mb-1">
                    <FaExclamationTriangle />
                    <p className="font-bold">Account Under Review</p>
                </div>
                <p className="text-sm opacity-90">You can browse the app, but you cannot add buses or drivers until an admin approves your request.</p>
            </div>
        )}

        {/* BUS LIST VIEW */}
        {activeTab === 'buses' && (
            buses.length > 0 ? (
                buses.map((bus) => (
                    <div 
                        key={bus._id} 
                        onClick={() => setSelectedBus(bus)}
                        className="flex items-center justify-between bg-[#f8f8f8] p-4 rounded-[2rem] shadow-md mb-4 cursor-pointer active:scale-95 transition-transform"
                    >
                        <div className="flex flex-col ml-2">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{bus.licensePlate}</h3>
                            {bus.currentDriver && (
                                <div className="flex items-center gap-1 text-xs text-gray-600 font-bold mb-1">
                                    <FaUserTie className="text-brand-brown" />
                                    <span>{bus.currentDriver}</span>
                                </div>
                            )}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${
                                bus.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                            }`}>
                                <FaCircle className="text-[8px]" />
                                {bus.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        <div className="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center shadow-sm">
                            <FaChevronRight className="text-gray-600 text-xl" />
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
                        {user?.status === 'approved' 
                           ? 'Tap the "+ Add Bus" button above to register your first vehicle.' 
                           : 'Once approved, you will be able to register your vehicles here.'}
                    </p>
                </div>
            )
        )}

        {/* DRIVERS LIST VIEW */}
        {activeTab === 'drivers' && (
             <div className="flex flex-col items-center justify-center mt-10 text-white/80 animate-fadeIn">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <FaUserTie className="text-4xl text-white" />
                </div>
                <h2 className="text-2xl font-bold">No Drivers Found</h2>
                <p className="text-sm text-center max-w-xs mt-2 opacity-80">
                    {user?.status === 'approved' 
                        ? 'Tap "+ Add Driver" to add drivers to your fleet and start your first trip.' 
                        : 'Once approved, you can add drivers to your fleet here.'}
                </p>
            </div>
        )}

      </div>

      {/* MODALS */}
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

    </div>
  );
};

export default FleetDashboard;