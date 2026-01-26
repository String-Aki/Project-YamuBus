import React, { useState } from "react";
import axios from "axios";
import {
  FaBus,
  FaMapSigns,
  FaTimes,
  FaTrash,
  FaSave,
  FaUserTie,
} from "react-icons/fa";
import { auth } from "../../config/firebase.js";

const API_URL = import.meta.env.VITE_API_URL;

const BusDetailsModal = ({ bus, isOpen, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    licensePlate: bus?.licensePlate || "",
    route: bus?.route || "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !bus) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (
      name === "licensePlate" &&
      value.length > formData.licensePlate.length
    ) {
      if (value.endsWith(" ") && !value.endsWith(" - ")) {
        newValue = value.slice(0, -1) + " - ";
      }
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.put(
        `${API_URL}/fleetmanagers/buses/${bus._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate(res.data);
      setIsEditing(false);
      onClose();
    } catch (error) {
      alert("Failed to update bus");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this bus? This cannot be undone.",
      )
    )
      return;

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`${API_URL}/fleetmanagers/buses/${bus._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(bus._id);
      onClose();
    } catch (error) {
      alert("Failed to delete bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${bus.currentDriver ? "bg-brand-brown text-white" : "bg-gray-100 text-gray-400"}`}
          >
            <FaUserTie className="text-3xl" />
          </div>
          <p className="text-xs font-bold uppercase text-gray-400">
            Current Driver
          </p>
          <h3 className="text-lg font-bold text-gray-800">
            {bus.currentDriver ? bus.currentDriver : "No Driver Assigned"}
          </h3>
          {bus.status === "online" && (
            <span className="text-xs text-green-600 font-bold animate-pulse">
              ● Currently Driving
            </span>
          )}
        </div>

        <hr className="border-gray-100 mb-6" />

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-2">
              License Plate
            </label>
            <div className="flex items-center bg-gray-50 rounded-xl p-3 border border-transparent focus-within:border-brand-brown">
              <FaBus className="text-gray-400 mr-3" />
              <input
                type="text"
                name="licensePlate"
                value={isEditing ? formData.licensePlate : bus.licensePlate}
                onChange={handleChange}
                disabled={!isEditing}
                className="bg-transparent font-bold text-gray-700 w-full outline-none uppercase disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-2">
              Route
            </label>
            <div className="flex items-center bg-gray-50 rounded-xl p-3 border border-transparent focus-within:border-brand-brown">
              <FaMapSigns className="text-gray-400 mr-3" />
              <input
                type="text"
                name="route"
                value={isEditing ? formData.route : bus.route}
                onChange={handleChange}
                disabled={!isEditing}
                className="bg-transparent font-medium text-gray-700 w-full outline-none disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 bg-brand-brown text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <FaSave /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold active:scale-95 transition-transform"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setFormData({
                    licensePlate: bus.licensePlate,
                    route: bus.route,
                  });
                }}
                className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform"
              >
                Edit Details
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDetailsModal;
