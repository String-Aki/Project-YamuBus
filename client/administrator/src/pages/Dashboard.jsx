// client/src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaShieldAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import StatsOverview from "../components/StatsOverview";
import ApprovalLists from "../components/ApprovalLists";
import VerificationModal from "../components/VerificationModal";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalManagers: 0,
    pendingManagers: 0,
    totalBuses: 0,
    pendingBuses: 0,
  });
  const [pendingManagers, setPendingManagers] = useState([]);
  const [pendingBuses, setPendingBuses] = useState([]);
  const [allManagers, setAllManagers] = useState([]);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return navigate("/admin/login");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get(`${API_URL}/admin/dashboard`, config);

      if (res.data?.stats) setStats(res.data.stats);
      if (res.data?.pendingManagers)
        setPendingManagers(res.data.pendingManagers);
      if (res.data?.pendingBuses) setPendingBuses(res.data.pendingBuses);

      if (activeTab === "directory") {
        const dirRes = await axios.get(`${API_URL}/admin/managers`, config);
        setAllManagers(dirRes.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      if (error.response?.status === 401) navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const handleAction = async (status, routeId = null) => {
    if (!selectedItem || !modalType) return;

    const isManager = modalType === "manager";
    const endpoint = isManager
      ? `${API_URL}/admin/managers/${selectedItem._id}/status`
      : `${API_URL}/admin/buses/${selectedItem._id}/verify`;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        endpoint,
        { status, routeId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(`${isManager ? "Manager" : "Bus"} ${status}`);

      if (status !== "pending") {
        if (isManager) {
          setPendingManagers((prev) =>
            prev.filter((m) => m._id !== selectedItem._id),
          );
          setStats((prev) => ({
            ...prev,
            pendingManagers: prev.pendingManagers - 1,
            totalManagers:
              status === "approved"
                ? prev.totalManagers + 1
                : prev.totalManagers,
          }));
        } else {
          setPendingBuses((prev) =>
            prev.filter((b) => b._id !== selectedItem._id),
          );
          setStats((prev) => ({
            ...prev,
            pendingBuses: prev.pendingBuses - 1,
            totalBuses:
              status === "verified" ? prev.totalBuses + 1 : prev.totalBuses,
          }));
        }
      }
      setSelectedItem(null);
    } catch (error) {
      toast.error("Action Failed");
    }
  };

  const handleDeleteManager = async (id) => {
    if (
      !window.confirm(
        "WARNING: This will delete the manager and ALL their buses. Continue?",
      )
    )
      return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_URL}/admin/managers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Manager Deleted");
      setAllManagers((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const handleInspectOwner = () => {
    if (selectedItem?.fleetManager) {
      setSelectedItem(selectedItem.fleetManager);
      setModalType("manager");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
        Loading Console...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Admin Console
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            System Overview & Compliance
          </p>
        </div>
        <div className="flex gap-2 bg-white p-1.5 rounded-full shadow-sm border border-slate-200">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<FaClipboardList />}
            label="Overview"
          />
          <TabButton
            active={activeTab === "approvals"}
            onClick={() => setActiveTab("approvals")}
            icon={<FaShieldAlt />}
            label="Approvals"
            badge={stats.pendingManagers + stats.pendingBuses}
          />
          <TabButton
            active={activeTab === "directory"}
            onClick={() => setActiveTab("directory")}
            icon={<FaUsers />}
            label="Directory"
          />
        </div>
      </div>

      {activeTab === "overview" && (
        <StatsOverview stats={stats} setActiveTab={setActiveTab} />
      )}

      {activeTab === "approvals" && (
        <ApprovalLists
          pendingManagers={pendingManagers}
          pendingBuses={pendingBuses}
          onSelect={(item, type) => {
            setSelectedItem(item);
            setModalType(type);
          }}
        />
      )}

      {activeTab === "directory" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 animate-fadeIn p-6">
          <p className="font-bold text-slate-400 uppercase text-xs mb-4">
            Active Fleet Managers
          </p>
          {allManagers.map((mgr) => (
            <div
              key={mgr._id}
              className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0"
            >
              <div>
                <h4 className="font-bold text-slate-800">
                  {mgr.organizationName}
                </h4>
                <p className="text-xs text-slate-500">{mgr.contactPhone}</p>
              </div>
              <button
                onClick={() => handleDeleteManager(mgr._id)}
                className="text-red-400 hover:text-red-600 text-xs font-bold border border-red-100 px-3 py-1 rounded-full hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <VerificationModal
        isOpen={!!selectedItem}
        type={modalType}
        data={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAction={handleAction}
        onInspectOwner={handleInspectOwner}
      />
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${active ? "bg-slate-900 text-white shadow-lg" : "bg-transparent text-slate-500 hover:bg-slate-100"}`}
  >
    {icon} {label}
    {badge > 0 && (
      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
        {badge}
      </span>
    )}
  </button>
);

export default Dashboard;
