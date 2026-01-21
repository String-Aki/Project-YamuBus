import React, { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import {
  FaUser,
  FaIdCard,
  FaPhone,
  FaLock,
  FaUserSecret,
  FaTimes,
  FaPrint,
  FaCheckCircle,
} from "react-icons/fa";
import { auth } from "../../firebase";

const API_URL = import.meta.env.VITE_API_URL;

const AddDriverModal = ({ isOpen, onClose, onDriverAdded }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    username: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = await auth.currentUser.getIdToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.post(
        `${API_URL}/fleetmanagers/drivers`,
        formData,
        config,
      );

      onDriverAdded(res.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add driver");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      name: "",
      licenseNumber: "",
      phone: "",
      username: "",
      password: "",
    });
    setError("");
    onClose();
  };

  const qrValue = JSON.stringify({
    u: formData.username,
    p: formData.password,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative animate-fadeIn">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
        >
          <FaTimes className="text-xl" />
        </button>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Add New Driver
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Create credentials for a new driver.
            </p>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-4 font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Info */}
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 rounded-xl p-3 flex items-center border border-transparent focus-within:border-brand-brown">
                  <FaUser className="text-gray-400 mr-2" />
                  <input
                    name="name"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-transparent w-full outline-none text-sm font-bold text-gray-700"
                  />
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3 flex items-center border border-transparent focus-within:border-brand-brown">
                  <FaPhone className="text-gray-400 mr-2" />
                  <input
                    name="phone"
                    placeholder="Phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-transparent w-full outline-none text-sm font-bold text-gray-700"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 flex items-center border border-transparent focus-within:border-brand-brown">
                <FaIdCard className="text-gray-400 mr-2" />
                <input
                  name="licenseNumber"
                  placeholder="License Number"
                  required
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none text-sm font-bold text-gray-700 uppercase"
                />
              </div>

              <hr className="border-gray-100 my-2" />

              {/* Login Credentials */}
              <p className="text-xs font-bold text-gray-400 uppercase">
                App Credentials
              </p>
              <div className="bg-blue-50 rounded-xl p-3 flex items-center border border-transparent focus-within:border-blue-500">
                <FaUserSecret className="text-blue-400 mr-2" />
                <input
                  name="username"
                  placeholder="Username (e.g. driver01)"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none text-sm font-bold text-gray-700 lowercase"
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-3 flex items-center border border-transparent focus-within:border-blue-500">
                <FaLock className="text-blue-400 mr-2" />
                <input
                  type="text"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none text-sm font-bold text-gray-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold text-lg mt-4 active:scale-95 transition-transform shadow-lg"
              >
                {loading ? "Creating..." : "Create Driver"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <FaCheckCircle className="text-3xl" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Driver Created!
            </h2>
            <p className="text-sm text-gray-500 mb-6 px-4">
              This QR code is their <b>Login Key</b>. Capture it now, as for
              security reasons, it cannot be recovered later.
            </p>

            <div id="printable-card" className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-xl mb-6 w-full flex flex-col items-center shadow-sm">
              <h3 className="font-bold text-xl uppercase tracking-widest text-brand-dark mb-1">
                Driver ID
              </h3>
              <p className="font-bold text-brand-brown text-lg mb-4">
                {formData.name}
              </p>

              <div className="p-2 bg-white border-2 border-black rounded-lg">
                <QRCodeSVG value={qrValue} size={160} />
              </div>

              <p className="text-xs font-mono text-gray-400 mt-4">
                USER: {formData.username}
              </p>
              <p className="text-xs font-mono text-gray-400 mt-4">
                PASS: {formData.password}
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <FaPrint /> Print
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-brand-brown text-white py-3 rounded-xl font-bold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDriverModal;
