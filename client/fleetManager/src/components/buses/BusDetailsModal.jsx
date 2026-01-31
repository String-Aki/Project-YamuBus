import React, { useState } from "react";
import axios from "axios";
import { FaBus, FaMapSigns, FaTimes, FaTrash, FaCheckCircle, FaClock, FaFileAlt } from "react-icons/fa";
import { auth } from "../../config/firebase.js";
import { handleError, handleSuccess } from "../../utils/toastUtils";

const API_URL = import.meta.env.VITE_API_URL;

const BusDetailsModal = ({ bus, isOpen, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !bus) return null;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`${API_URL}/fleetmanagers/buses/${bus._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(bus._id);
      onClose();
      handleSuccess("Bus deleted successfully");
    } catch (error) {
      handleError(error, "Failed to delete bus");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
      switch(status) {
          case 'verified': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-200"><FaCheckCircle/> Verified</span>;
          case 'rejected': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200"><FaTimes/> Rejected</span>;
          default: return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200"><FaClock/> Pending Review</span>;
      }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes className="text-xl" /></button>

        <div className="flex justify-center mb-6">{getStatusBadge(bus.verificationStatus || 'pending')}</div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 bg-brand-brown text-white shadow-lg"><FaBus className="text-3xl" /></div>
          <h3 className="text-2xl font-black text-gray-800 uppercase tracking-wide">{bus.plateNumber}</h3>
          <p className="text-sm font-bold text-gray-400 flex items-center justify-center gap-1 mt-1"><FaMapSigns /> {bus.route}</p>
        </div>

        <hr className="border-gray-100 mb-6" />

        <div className="space-y-3 mb-8">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Submitted Documents</p>
             <a href={bus.registrationCertificate} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-3"><FaFileAlt className="text-blue-500"/><span className="text-sm font-bold text-gray-700">Registration Cert.</span></div>
                <span className="text-xs font-bold text-blue-500 group-hover:underline">View</span>
             </a>
             <a href={bus.routePermit} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-3"><FaFileAlt className="text-yellow-500"/><span className="text-sm font-bold text-gray-700">Route Permit</span></div>
                <span className="text-xs font-bold text-blue-500 group-hover:underline">View</span>
             </a>
        </div>

        <button onClick={handleDelete} disabled={loading} className="w-full bg-red-50 text-red-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
          <FaTrash /> Delete Bus
        </button>
      </div>
    </div>
  );
};

export default BusDetailsModal;