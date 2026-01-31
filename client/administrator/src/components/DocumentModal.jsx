import React from "react";
import { FaFileAlt, FaExternalLinkAlt, FaTimes } from "react-icons/fa";

const DocumentModal = ({ isOpen, title, url, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
            <FaFileAlt /> {title}
          </h3>
          <div className="flex gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-bold flex items-center gap-2 hover:bg-blue-700"
            >
              <FaExternalLinkAlt /> Open Original
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center overflow-hidden">
          {url.toLowerCase().endsWith(".pdf") ? (
            <iframe
              src={url}
              title="Doc"
              className="w-full h-full rounded shadow-sm border"
            />
          ) : (
            <img
              src={url}
              alt="Doc"
              className="max-w-full max-h-full object-contain rounded shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
