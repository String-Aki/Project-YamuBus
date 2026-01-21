import React, { useState, useRef } from 'react';
import { FaArrowLeft, FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from '../firebase.js'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InputField = ({ type, name, placeholder, value, icon, toggleIcon, onChange }) => (
  <div className="relative w-full mb-3">
    <input 
      type={type} 
      name={name} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange}
      className="w-full p-4 rounded-full text-gray-800 outline-none shadow-sm focus:ring-2 focus:ring-brand-brown"
    />
    {icon && (
      <div 
        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer" 
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
    fullName: '', email: '', password: '', confirmPassword: '', nicID: '',
    companyName: '', contactPhone: ''
  });

  const [nicFront, setNicFront] = useState(null);
  const [nicBack, setNicBack] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      if (side === 'front') {
        setNicFront(file);
        setPreviewFront(URL.createObjectURL(file));
      } else {
        setNicBack(file);
        setPreviewBack(URL.createObjectURL(file));
      }
    }
  };

  const handleNext = async () => {
    // --- STEP 1 VALIDATION ---
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.password) return alert("Please fill all fields");
      if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");
      setCurrentStep(2);
    } 
    // --- STEP 2 VALIDATION ---
    else if (currentStep === 2) {
      if (!formData.companyName || !formData.contactPhone || !formData.nicID) return alert("Please fill company details and NIC");
      setCurrentStep(3);
    } 
    // --- STEP 3 VALIDATION ---
    else if (currentStep === 3) {
      if (!nicFront || !nicBack) return alert("Please upload both NIC images");
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      const frontRef = ref(storage, `nic/${firebaseUser.uid}_front`);
      const backRef = ref(storage, `nic/${firebaseUser.uid}_back`);

      const [frontSnapshot, backSnapshot] = await Promise.all([
        uploadBytes(frontRef, nicFront),
        uploadBytes(backRef, nicBack)
      ]);

      const frontURL = await getDownloadURL(frontSnapshot.ref);
      const backURL = await getDownloadURL(backSnapshot.ref);

      await axios.post('http://localhost:5000/api/fleetmanagers/register', {
        fullName: formData.fullName,
        companyName: formData.companyName,
        contactEmail: formData.email,
        contactPhone: formData.contactPhone,
        firebaseUID: firebaseUser.uid,
        nicNumber: formData.nicID,
        nicFrontImage: frontURL,
        nicBackImage: backURL
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Account Created & Verified! Please Login.");
      navigate('/login');

    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-brand-brown overflow-hidden">

      <div className="flex-none p-6 pt-8 text-white min-h-[120px]">
        {currentStep > 1 ? (
           <FaArrowLeft className="text-2xl cursor-pointer mb-4" onClick={handleBack} />
        ) : (
           <div className="h-8 mb-4"></div>
        )}
        
        <div className="text-right">
          <h1 className="text-4xl font-semibold leading-tight">Create<br />Account</h1>
        </div>
      </div>

      {/* CARD */}
      <div className="flex-1 bg-brand-dark rounded-tl-[3rem] px-6 py-6 flex flex-col items-center w-full">
        
        {/* STEPPER */}
        <div className="flex gap-6 mb-6 flex-none">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${currentStep === step ? 'bg-brand-brown text-white shadow-lg' : 'bg-gray-200 text-gray-600'}`}>
              {step}
            </div>
          ))}
        </div>

        {/* SCROLLABLE FORM */}
        <div className="w-full flex-1 overflow-y-auto custom-scrollbar pr-1">
          
          {/* STEP 1 */}
          {currentStep === 1 && (
            <>
              <InputField type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
              <InputField type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} />
              <InputField type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} icon={showPassword ? <FaEyeSlash /> : <FaEye />} toggleIcon={() => setShowPassword(!showPassword)} onChange={handleChange} />
              <InputField type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />} toggleIcon={() => setShowConfirmPassword(!showConfirmPassword)} onChange={handleChange} />
            </>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <>
              <InputField type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} />
              <InputField type="tel" name="contactPhone" placeholder="Mobile Number" value={formData.contactPhone} onChange={handleChange} />
              <InputField type="text" name="nicID" placeholder="NIC Number" value={formData.nicID} onChange={handleChange} />
            </>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-3 w-full">
              <input type="file" ref={frontInputRef} onChange={(e) => handleImageChange(e, 'front')} className="hidden" accept="image/*" />
              <input type="file" ref={backInputRef} onChange={(e) => handleImageChange(e, 'back')} className="hidden" accept="image/*" />

              <div onClick={() => frontInputRef.current.click()} className="w-full h-32 bg-white rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-md relative">
                {previewFront ? <img src={previewFront} alt="Front" className="w-full h-full object-cover" /> : <><FaCamera className="text-2xl text-gray-400 mb-1" /><span className="text-gray-500 font-semibold text-sm">Front Side</span></>}
              </div>

              <div onClick={() => backInputRef.current.click()} className="w-full h-32 bg-white rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-md relative">
                {previewBack ? <img src={previewBack} alt="Back" className="w-full h-full object-cover" /> : <><FaCamera className="text-2xl text-gray-400 mb-1" /><span className="text-gray-500 font-semibold text-sm">Back Side</span></>}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BUTTON */}
        <div className="w-full mt-auto pt-4 pb-2">
          <button onClick={handleNext} disabled={isLoading} className={`w-full py-4 rounded-full text-white text-xl font-bold shadow-lg transition-transform ${isLoading ? 'bg-gray-500' : 'bg-brand-brown active:scale-95'}`}>
            {isLoading ? "Processing..." : (currentStep === 3 ? "Submit" : "Next")}
          </button>
          <p className="text-white text-sm mt-4">
            Already have an account? <span className="font-bold underline cursor-pointer" onClick={() => navigate('/login')}>Sign In</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default CreateAccount;