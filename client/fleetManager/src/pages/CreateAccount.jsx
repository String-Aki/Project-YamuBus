import React, { useState, useRef } from "react";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaFileAlt,
  FaBuilding,
  FaChevronDown,
} from "react-icons/fa";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { handleError, handleSuccess } from '../utils/toastUtils';

const API_URL = import.meta.env.VITE_API_URL;

const InputField = ({
  type,
  name,
  placeholder,
  value,
  icon,
  toggleIcon,
  onChange,
}) => (
  <div className="relative w-full mb-3">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-4 rounded-full text-gray-800 outline-none shadow-sm focus:ring-2 focus:ring-brand-brown transition-all"
    />
    {icon && (
      <div
        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer hover:text-brand-brown"
        onClick={toggleIcon}
      >
        {icon}
      </div>
    )}
  </div>
);

const CreateAccount = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    nicID: "",
    contactPhone: "",
    operatorType: "private",
    organizationName: "",
  });

  // Image States
  const [nicFront, setNicFront] = useState(null);
  const [nicBack, setNicBack] = useState(null);
  const [verificationDoc, setVerificationDoc] = useState(null);

  // Preview States
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const docInputRef = useRef(null);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      if (type === "front") {
        setNicFront(file);
        setPreviewFront(previewURL);
      } else if (type === "back") {
        setNicBack(file);
        setPreviewBack(previewURL);
      } else if (type === "doc") {
        setVerificationDoc(file);
        setPreviewDoc(previewURL);
      }
    }
  };

  // --- VALIDATION ---
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.password)
        return toast.error("Please fill all fields");
      if (formData.password !== formData.confirmPassword)
        return toast.error("Passwords do not match");
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (
        !formData.organizationName ||
        !formData.contactPhone ||
        !formData.nicID
      )
        return toast.error("Please complete all details");
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!nicFront || !nicBack || !verificationDoc)
        return toast.error("All verification documents are required.");
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    let userCredential = null;

    try {
      userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("contactEmail", formData.email);
      data.append("contactPhone", formData.contactPhone);
      data.append("nicNumber", formData.nicID);
      data.append("firebaseUID", firebaseUser.uid);
      data.append("operatorType", formData.operatorType);
      data.append("organizationName", formData.organizationName);
      
      if(nicFront) data.append("nicFrontImage", nicFront); 
      if(nicBack) data.append("nicBackImage", nicBack);
      if(verificationDoc) data.append("verificationDocument", verificationDoc);

      await axios.post(`${API_URL}/fleetmanagers/register`, data, {
        headers: { 
            Authorization: `Bearer ${token}`,
        }
      });

      handleSuccess("Account Application Submitted! Please wait for Admin Approval.");
      navigate('/login');

    } catch (error) {
      console.error("Registration Error:", error);
      
      if (userCredential && userCredential.user) {
          try {
              await deleteUser(userCredential.user);
              console.log("Cleanup: Deleted orphaned Firebase user.");//Remove on prod
          } catch (cleanupError) {
              console.error("Cleanup Failed: Could not delete Firebase user.", cleanupError);
          }
      }
      handleError(error, "Registration Failed. Please try again.");
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // --- Dynamic UX Helpers ---
  const isPrivate = formData.operatorType === "private";
  const namePlaceholder = isPrivate
    ? "Company Name (e.g. Kandy Super Line)"
    : "Depot Name (e.g. Kandy South)";
  const docTitle = isPrivate
    ? "Business Registration / Permit"
    : "Appointment Letter / ID";
  const docBg = isPrivate
    ? "bg-yellow-50 border-yellow-400"
    : "bg-blue-50 border-blue-400";
  const docColor = isPrivate ? "text-yellow-700" : "text-blue-700";

  return (
    <div className="flex flex-col h-[100dvh] bg-brand-brown overflow-hidden font-sans">
      <div className="flex-none p-6 pt-8 text-white min-h-[120px]">
        {currentStep > 1 ? (
          <FaArrowLeft
            className="text-2xl cursor-pointer mb-4"
            onClick={handleBack}
          />
        ) : (
          <div className="h-8 mb-4"></div>
        )}
        <div className="text-right">
          <h1 className="text-4xl font-semibold leading-tight drop-shadow-md">
            {currentStep === 1
              ? "Create\nAccount"
              : currentStep === 2
                ? "Operator\nDetails"
                : "Verify\nIdentity"}
          </h1>
        </div>
      </div>

      <div className="flex-1 bg-brand-dark rounded-tl-[3rem] px-6 py-6 flex flex-col items-center w-full shadow-2xl relative">
        <div className="flex gap-4 mb-6 flex-none">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`transition-all duration-300 ${currentStep === step ? "w-12 bg-brand-brown" : "w-3 bg-gray-600"} h-3 rounded-full shadow-sm`}
            ></div>
          ))}
        </div>

        <div className="w-full flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <InputField
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
              <InputField
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                toggleIcon={() => setShowPassword(!showPassword)}
                onChange={handleChange}
              />
              <InputField
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                toggleIcon={() => setShowConfirmPassword(!showConfirmPassword)}
                onChange={handleChange}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="relative w-full">
                <select
                  name="operatorType"
                  value={formData.operatorType}
                  onChange={handleChange}
                  className="w-full p-4 rounded-full text-gray-800 outline-none shadow-sm focus:ring-2 focus:ring-brand-brown appearance-none bg-white font-bold cursor-pointer"
                >
                  <option value="private">Private Bus Operator</option>
                  <option value="sltb">SLTB / Government Depot</option>
                </select>
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  <FaChevronDown />
                </div>
              </div>

              <InputField
                type="text"
                name="organizationName"
                placeholder={namePlaceholder}
                value={formData.organizationName}
                onChange={handleChange}
                icon={<FaBuilding />}
              />

              <InputField
                type="tel"
                name="contactPhone"
                placeholder="Mobile Number"
                value={formData.contactPhone}
                onChange={handleChange}
              />
              <InputField
                type="text"
                name="nicID"
                placeholder="NIC Number"
                value={formData.nicID}
                onChange={handleChange}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-4 w-full animate-fadeIn">
              <input
                type="file"
                ref={frontInputRef}
                onChange={(e) => handleImageChange(e, "front")}
                className="hidden"
                accept="image/*"
              />
              <input
                type="file"
                ref={backInputRef}
                onChange={(e) => handleImageChange(e, "back")}
                className="hidden"
                accept="image/*"
              />

              <input
                type="file"
                ref={docInputRef}
                onChange={(e) => handleImageChange(e, "doc")}
                className="hidden"
                accept="image/*,application/pdf"
              />

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => frontInputRef.current.click()}
                  className="h-32 bg-white rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-md relative"
                >
                  {previewFront ? (
                    <img
                      src={previewFront}
                      alt="Front"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <FaCamera className="text-2xl text-gray-400 mb-2" />
                      <span className="text-gray-500 font-bold text-xs">
                        NIC Front
                      </span>
                    </>
                  )}
                </div>
                <div
                  onClick={() => backInputRef.current.click()}
                  className="h-32 bg-white rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-md relative"
                >
                  {previewBack ? (
                    <img
                      src={previewBack}
                      alt="Back"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <FaCamera className="text-2xl text-gray-400 mb-2" />
                      <span className="text-gray-500 font-bold text-xs">
                        NIC Back
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div
                onClick={() => docInputRef.current.click()}
                className={`w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-md relative group hover:opacity-80 transition-all ${docBg}`}
              >
                {previewDoc ? (
                  verificationDoc?.type === "application/pdf" ? (
                    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 p-2">
                      <FaFileAlt className="text-3xl text-red-500 mb-1" />
                      <span className="text-xs font-bold text-gray-700 text-center truncate w-full">
                        {verificationDoc.name}
                      </span>
                      <span className="text-[10px] text-red-500 font-bold mt-1">
                        PDF Selected
                      </span>
                    </div>
                  ) : (
                    <img
                      src={previewDoc}
                      alt="Doc"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <>
                    <FaFileAlt className={`text-3xl mb-2 ${docColor}`} />
                    <span className={`font-bold text-sm ${docColor}`}>
                      {docTitle}
                    </span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">
                      Required Verification
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full mt-auto pt-4 pb-2">
          <button
            onClick={handleNext}
            disabled={isLoading}
            className={`w-full py-4 rounded-full text-white text-xl font-bold shadow-lg transition-transform ${isLoading ? "bg-gray-500" : "bg-brand-brown active:scale-95"}`}
          >
            {isLoading
              ? "Processing..."
              : currentStep === 3
                ? "Submit Application"
                : "Next"}
          </button>

          {currentStep === 1 && (
            <p className="text-white text-sm mt-4 text-center opacity-80">
              Already have an account?{" "}
              <span
                className="font-bold underline cursor-pointer hover:text-brand-brown"
                onClick={() => navigate("/login")}
              >
                Sign In
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
