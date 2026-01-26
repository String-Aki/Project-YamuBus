import React, { useState, useRef } from "react";
import axios from "axios";
import { FaBus, FaMapSigns, FaTimes, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { auth, storage } from "../../config/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const API_URL = import.meta.env.VITE_API_URL;

const AddBusModal = ({ isOpen, onClose, onBusAdded }) => {
  const [formData, setFormData] = useState({ plateNumber: "", route: "" });
  
  const [regFile, setRegFile] = useState(null);
  const [permitFile, setPermitFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const regInputRef = useRef(null);
  const permitInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (value.length > formData[name].length) {
      if (value.endsWith(" ") && !value.endsWith(" - ")) {
        newValue = value.slice(0, -1) + " - ";
      }
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "reg") setRegFile(file);
      if (type === "permit") setPermitFile(file);
    }
  };

  const createSafeFileName = (prefix, plate, file) => {
    const fileExt = file.name.split('.').pop();
    const safePlate = plate.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase(); 
    
    const timestamp = Date.now();
    return `bus_docs_${prefix}_${safePlate}_${timestamp}.${fileExt}`;
  };

  const handleSubmit = async () => {
    if (!formData.plateNumber || !formData.route || !regFile || !permitFile)
      return alert("Please fill all fields and upload both documents.");

    setLoading(true);
    setUploadProgress("Uploading Docs...");

    try {
      const token = await auth.currentUser.getIdToken();

      const regPath = createSafeFileName("reg", formData.plateNumber, regFile);
      const permitPath = createSafeFileName("permit", formData.plateNumber, permitFile);

      const regRef = ref(storage, regPath);
      const permitRef = ref(storage, permitPath);

      const [regSnap, permitSnap] = await Promise.all([
        uploadBytes(regRef, regFile),
        uploadBytes(permitRef, permitFile)
      ]);

      setUploadProgress("Verifying...");

      const regUrl = await getDownloadURL(regSnap.ref);
      const permitUrl = await getDownloadURL(permitSnap.ref);

      const res = await axios.post(
        `${API_URL}/fleetmanagers/buses`, 
        {
          plateNumber: formData.plateNumber.toUpperCase(),
          route: formData.route,
          registrationCertificate: regUrl,
          routePermit: permitUrl
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onBusAdded(res.data);
      
      setFormData({ plateNumber: "", route: "" });
      setRegFile(null);
      setPermitFile(null);
      onClose();
      alert("Bus Submitted for Verification!");

    } catch (error) {
      console.error("Error adding bus:", error);
      alert(error.response?.data?.message || "Failed to add bus");
    } finally {
      setLoading(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-2xl font-bold text-brand-brown mb-1 text-center">Add New Bus</h2>
        <p className="text-xs text-gray-400 text-center mb-6 uppercase tracking-wider font-bold">Submit for Verification</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-3">License Plate</label>
            <div className="relative mt-1">
              <FaBus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="plateNumber" placeholder="ND - 5681" value={formData.plateNumber} onChange={handleChange} className="w-full pl-12 p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-brown font-bold text-gray-700 uppercase" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-3">Route</label>
            <div className="relative mt-1">
              <FaMapSigns className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="route" placeholder="177 Kandy - Colombo" value={formData.route} onChange={handleChange} className="w-full pl-12 p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-brown font-medium text-gray-700" />
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Required Documents</p>
            
            <input type="file" ref={regInputRef} onChange={(e) => handleFileChange(e, "reg")} className="hidden" accept="image/*,.pdf" />
            <div onClick={() => regInputRef.current.click()} className={`border-2 border-dashed rounded-xl p-4 flex items-center gap-3 cursor-pointer ${regFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${regFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {regFile ? <FaCheckCircle /> : <FaCloudUploadAlt />}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className={`text-sm font-bold ${regFile ? 'text-green-700' : 'text-gray-600'}`}>Registration Certificate</p>
                    <p className="text-xs text-gray-400 truncate">{regFile ? regFile.name : "Tap to upload PDF or Image"}</p>
                </div>
            </div>

            <input type="file" ref={permitInputRef} onChange={(e) => handleFileChange(e, "permit")} className="hidden" accept="image/*,.pdf" />
            <div onClick={() => permitInputRef.current.click()} className={`mt-3 border-2 border-dashed rounded-xl p-4 flex items-center gap-3 cursor-pointer ${permitFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${permitFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {permitFile ? <FaCheckCircle /> : <FaCloudUploadAlt />}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className={`text-sm font-bold ${permitFile ? 'text-green-700' : 'text-gray-600'}`}>Route Permit</p>
                    <p className="text-xs text-gray-400 truncate">{permitFile ? permitFile.name : "Tap to upload PDF or Image"}</p>
                </div>
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg mt-8 transition-transform ${loading ? "bg-gray-400" : "bg-brand-brown active:scale-95"}`}>
          {loading ? (uploadProgress || "Processing...") : "Submit Bus"}
        </button>
      </div>
    </div>
  );
};

export default AddBusModal;