import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaUser, FaIdCard, FaPhone, FaUserSecret, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import { auth } from '../../firebase'; 

const API_URL = import.meta.env.VITE_API_URL; 

const DriverDetailsModal = ({ driver, isOpen, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    phone: ''
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        licenseNumber: driver.licenseNumber || '',
        phone: driver.phone || ''
      });
      setIsEditing(false);
    }
  }, [driver, isOpen]);

  if (!isOpen || !driver) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.put(`${API_URL}/fleetmanagers/drivers/${driver._id}`, formData, config);
      
      onUpdate(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update driver", error);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This driver will be permanently removed and cannot log in anymore.")) return;
    
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`${API_URL}/fleetmanagers/drivers/${driver._id}`, config);
      onDelete(driver._id);
      onClose();
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete driver.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative animate-fadeIn">

        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
          <FaTimes className="text-xl" />
        </button>

        <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FaUser className="text-xl" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 leading-none">{isEditing ? 'Edit Driver' : driver.name}</h2>
                {!isEditing && <p className="text-xs text-gray-500 font-bold uppercase mt-1">Status: Active</p>}
            </div>
        </div>

        {!isEditing ? (
            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                    <FaUserSecret className="text-gray-400" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Username</p>
                        <p className="font-bold text-gray-700">{driver.username}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                    <FaIdCard className="text-gray-400" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">License Number</p>
                        <p className="font-bold text-gray-700">{driver.licenseNumber}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                    <FaPhone className="text-gray-400" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Phone</p>
                        <p className="font-bold text-gray-700">{driver.phone || 'N/A'}</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={() => setIsEditing(true)} className="flex-1 bg-brand-brown text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                        <FaEdit /> Edit Details
                    </button>
                    <button onClick={handleDelete} className="w-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 active:scale-95 transition-transform">
                        <FaTrash />
                    </button>
                </div>
            </div>
        ) : (

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 ml-1">Full Name</label>
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center border border-transparent focus-within:border-brand-brown transition-colors">
                        <FaUser className="text-gray-400 mr-2" />
                        <input name="name" value={formData.name} onChange={handleChange} className="bg-transparent w-full outline-none text-sm font-bold text-gray-700" />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 ml-1">License Number</label>
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center border border-transparent focus-within:border-brand-brown transition-colors">
                        <FaIdCard className="text-gray-400 mr-2" />
                        <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="bg-transparent w-full outline-none text-sm font-bold text-gray-700 uppercase" />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 ml-1">Phone</label>
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center border border-transparent focus-within:border-brand-brown transition-colors">
                        <FaPhone className="text-gray-400 mr-2" />
                        <input name="phone" value={formData.phone} onChange={handleChange} className="bg-transparent w-full outline-none text-sm font-bold text-gray-700" />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={handleSave} disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                        {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold active:scale-95 transition-transform">
                        Cancel
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default DriverDetailsModal;