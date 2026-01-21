import React, { useState } from 'react';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) return alert("Please fill in all fields");

    setIsLoading(true);
    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      console.log("Logged in!", firebaseUser.uid);
      alert("Login Successful!");
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Login Error:", error);
      alert("Invalid Email or Password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-brand-brown overflow-hidden">
      
      {/* HEADER */}
      <div className="flex-none p-6 pt-12 text-white min-h-[150px] flex flex-col justify-end">
        <div className="text-right">
          <h1 className="text-4xl font-semibold leading-tight">Welcome<br />Back</h1>
        </div>
      </div>

      {/* DARK CARD */}
      <div className="flex-1 bg-brand-dark rounded-tl-[3rem] px-6 py-10 flex flex-col items-center w-full">
        
        <div className="w-full flex-1 mt-4">
          
          {/* Email Input */}
          <div className="relative w-full mb-6">
            <input 
              type="email" 
              name="email" 
              placeholder="E-mail" 
              value={formData.email} 
              onChange={handleChange}
              className="w-full p-4 rounded-full text-gray-800 outline-none shadow-sm focus:ring-2 focus:ring-brand-brown"
            />
          </div>

          {/* Password Input */}
          <div className="relative w-full mb-8">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange}
              className="w-full p-4 rounded-full text-gray-800 outline-none shadow-sm focus:ring-2 focus:ring-brand-brown"
            />
            <div 
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Sign In Button */}
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-4 rounded-full text-white text-xl font-bold shadow-lg transition-transform ${isLoading ? 'bg-gray-500' : 'bg-brand-brown active:scale-95'}`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* Links */}
          <div className="mt-6 text-center text-white space-y-4">
            <p className="text-sm text-gray-400 cursor-pointer">Forgot Password?</p>
            <p className="text-sm">
              Don't have an account? <span className="font-bold underline cursor-pointer" onClick={() => navigate('/register')}>Sign Up</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;