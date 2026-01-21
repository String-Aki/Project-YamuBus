import React, { useState } from 'react';
import axios from 'axios';
import { FaBus, FaMapSigns, FaTimes } from 'react-icons/fa';
import { auth } from '../firebase'; 

// REPLACE WITH YOUR IP IF ON MOBILE
// const API_URL = 'http://localhost:5000/api'; 
const API_URL = 'http://192.168.43.96:5000/api'; 

const AddBusModal = ({ isOpen, onClose, onBusAdded }) => {
  const [formData, setFormData] = useState({ licensePlate: '', route: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if(value.length > formData[name].length){
        if(value.endsWith(' ') && !value.endsWith(' - ')){
            newValue = value.slice(0, -1) + ' - ';
        }
    }

    setFormData(prev => ({...prev, [name]: newValue}))
  }

  const handleSubmit = async () => {
    if (!formData.licensePlate || !formData.route) return alert("Please fill all fields");

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      
      const res = await axios.post(
        `${API_URL}/fleetmanagers/buses`, 
        {
          licensePlate: formData.licensePlate.toUpperCase(),
          route: formData.route
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onBusAdded(res.data); 
      setFormData({ licensePlate: '', route: '' });
      onClose();
      alert("Bus Added Successfully!");

    } catch (error) {
      console.error("Error adding bus:", error);
      alert(error.response?.data?.message || "Failed to add bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">

      <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative animate-fadeIn">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-2xl font-bold text-brand-brown mb-6 text-center">Add New Bus</h2>

        {/* License Plate Input */}
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-500 uppercase ml-3">License Plate</label>
          <div className="relative mt-1">
            <FaBus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              name="licensePlate" 
              placeholder="ND-5681" 
              value={formData.licensePlate}
              onChange={handleChange}
              className="w-full pl-12 p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-brown font-bold text-gray-700 uppercase"
            />
          </div>
        </div>

        {/* Route Input */}
        <div className="mb-8">
          <label className="text-xs font-bold text-gray-500 uppercase ml-3">Route Number/Name</label>
          <div className="relative mt-1">
            <FaMapSigns className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              name="route" 
              placeholder="Kandy - Colombo" 
              value={formData.route}
              onChange={handleChange}
              className="w-full pl-12 p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-brown font-medium text-gray-700"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-transform ${
            loading ? 'bg-gray-400' : 'bg-brand-brown active:scale-95'
          }`}
        >
          {loading ? "Saving..." : "Add to Fleet"}
        </button>

      </div>
    </div>
  );
};

export default AddBusModal;