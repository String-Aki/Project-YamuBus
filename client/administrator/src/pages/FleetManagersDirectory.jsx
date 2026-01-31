import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserTie,
  FaChevronDown,
  FaChevronUp,
  FaPhone,
  FaEnvelope,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import DocumentModal from "../components/DocumentModal";
import ManagerAssets from "../components/ManagerAssets";

const API_URL = import.meta.env.VITE_API_URL;

const FleetManagersDirectory = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedManagerId, setExpandedManagerId] = useState(null);

  const [docModal, setDocModal] = useState({
    isOpen: false,
    title: "",
    url: "",
  });

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/admin/managers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManagers(res.data);
    } catch (error) {
      toast.error("Failed to load managers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteManager = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("WARNING: Delete Manager AND all their Buses/Drivers?"))
      return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_URL}/admin/managers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Manager deleted");
      fetchManagers();
    } catch (error) {
      toast.error("Failed to delete manager");
    }
  };

  const openDoc = (e, title, url) => {
    e?.stopPropagation();
    if (!url) return toast.error("Document not found");
    setDocModal({ isOpen: true, title, url });
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-400 font-bold">
        Loading Directory...
      </div>
    );

  return (
    <div className="p-8 min-h-screen bg-slate-50 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Fleet Directory
        </h1>
        <p className="text-slate-500 font-medium">
          Manage Owners, Vehicles, and Personnel
        </p>
      </div>

      <div className="space-y-4">
        {managers.map((mgr) => (
          <div
            key={mgr._id}
            className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${
              expandedManagerId === mgr._id
                ? "border-brand shadow-lg ring-1 ring-brand/20"
                : "border-slate-200 shadow-sm hover:shadow-md"
            }`}
          >
            <div
              onClick={() =>
                setExpandedManagerId(
                  expandedManagerId === mgr._id ? null : mgr._id,
                )
              }
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    expandedManagerId === mgr._id
                      ? "bg-brand text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <FaUserTie />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    {mgr.organizationName}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-bold ${
                        mgr.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {mgr.status}
                    </span>
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <FaEnvelope size={10} /> {mgr.contactEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaPhone size={10} /> {mgr.contactPhone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1 mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => openDoc(e, "NIC Front", mgr.nicFrontImage)}
                    className="p-2 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-bold"
                  >
                    NIC (F)
                  </button>
                  <button
                    onClick={(e) => openDoc(e, "NIC Back", mgr.nicBackImage)}
                    className="p-2 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-bold"
                  >
                    NIC (B)
                  </button>
                  <button
                    onClick={(e) =>
                      openDoc(e, "Business Reg", mgr.verificationDocument)
                    }
                    className="p-2 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-bold"
                  >
                    Docs
                  </button>
                </div>
                <button
                  onClick={(e) => handleDeleteManager(e, mgr._id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <FaTrash />
                </button>
                <div className="text-slate-400 ml-2">
                  {expandedManagerId === mgr._id ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
              </div>
            </div>

            {expandedManagerId === mgr._id && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-6 animate-fadeIn">
                <ManagerAssets managerId={mgr._id} onOpenDoc={openDoc} />
              </div>
            )}
          </div>
        ))}
      </div>

      <DocumentModal
        isOpen={docModal.isOpen}
        title={docModal.title}
        url={docModal.url}
        onClose={() => setDocModal({ ...docModal, isOpen: false })}
      />
    </div>
  );
};

export default FleetManagersDirectory;
