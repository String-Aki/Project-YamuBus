import React from "react";
import {
  FaTimes,
  FaIdCard,
  FaBus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
} from "react-icons/fa";

const VerificationModal = ({
  isOpen,
  type,
  data,
  onClose,
  onAction,
  onInspectOwner,
}) => {
  if (!isOpen || !data) return null;

  const isManager = type === "manager";
  const isBus = type === "bus";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl animate-fadeIn relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 text-white p-6 relative flex-none">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-lg font-bold flex items-center gap-2">
            {isManager ? (
              <FaIdCard className="text-orange-400" />
            ) : (
              <FaBus className="text-red-400" />
            )}
            {isManager ? "Investigate Application" : "Investigate Vehicle"}
          </h2>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isBus && data.fleetManager && (
            <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">
                    Owner Context
                  </p>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {data.fleetManager.organizationName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {data.fleetManager.status === "approved" ? (
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FaCheckCircle /> Verified Owner
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FaExclamationTriangle /> Unverified Owner
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onInspectOwner}
                  className="text-xs font-bold bg-white border border-blue-200 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
                >
                  Inspect Owner
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <DetailBox
              label={isManager ? "Manager Name" : "License Plate"}
              value={isManager ? data.organizationName : data.plateNumber}
            />
            <DetailBox
              label={isManager ? "NIC Number" : "Route Number"}
              value={isManager ? data.nicNumber : data.route}
            />
            {isManager && (
              <DetailBox label="Contact" value={data.contactPhone} />
            )}
            {isManager && (
              <DetailBox label="Operator Type" value={data.operatorType} />
            )}
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
            Submitted Documents
          </p>
          <div className="space-y-3 mb-8">
            {isManager ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <DocLink
                    href={data.nicFrontImage}
                    label="NIC Front"
                    color="orange"
                  />
                  <DocLink
                    href={data.nicBackImage}
                    label="NIC Back"
                    color="orange"
                  />
                </div>
                <DocLink
                  href={data.verificationDocument}
                  label="Verification Document"
                  color="blue"
                  fullWidth
                />
              </>
            ) : (
              <>
                <DocLink
                  href={data.registrationCertificate}
                  label="Registration Certificate"
                  color="blue"
                  fullWidth
                />
                <DocLink
                  href={data.routePermit}
                  label="Route Permit"
                  color="purple"
                  fullWidth
                />
              </>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => onAction(isManager ? "approved" : "verified")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-200 text-sm"
            >
              {isManager ? "Approve Entity" : "Verify Vehicle"}
            </button>
            <button
              onClick={() => onAction("rejected")}
              className="flex-1 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 py-3.5 rounded-xl font-bold transition-all text-sm"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailBox = ({ label, value }) => (
  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
      {label}
    </p>
    <p className="font-bold text-slate-800 text-sm truncate">
      {value || "N/A"}
    </p>
  </div>
);

const DocLink = ({ href, label, color, fullWidth }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all group ${fullWidth ? "col-span-2" : ""}`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-500`}>
        <FaExternalLinkAlt size={12} />
      </div>
      <span className="text-xs font-bold text-slate-700">{label}</span>
    </div>
    {!href && (
      <span className="text-[10px] font-bold text-red-400">Missing</span>
    )}
  </a>
);

export default VerificationModal;
