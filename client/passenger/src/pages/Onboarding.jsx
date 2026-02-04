import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bus, Navigation, ArrowRight, Check } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Track Any Bus",
      description: "Real-time location updates for both SLTB and Private buses across Sri Lanka.",
      icon: <MapPin size={80} className="text-white drop-shadow-lg" />,
      color: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Live Estimates",
      description: "Know exactly when your bus will arrive. No more waiting in uncertainty.",
      icon: <Navigation size={80} className="text-white drop-shadow-lg" />,
      color: "bg-emerald-600",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Start Your Journey",
      description: "Find your route, hop on, and travel with confidence.",
      icon: <Bus size={80} className="text-white drop-shadow-lg" />,
      color: "bg-indigo-600"
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/home");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white font-sans">
      
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentStep ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className={`absolute inset-0 ${step.color} mix-blend-multiply opacity-90 z-10`} />
          <img 
            src={step.image}  
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 px-6">
        
        <div className="mb-10 transition-all duration-500 transform translate-y-0">
          <div className="mb-6 flex justify-center">
            <div className="p-6 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-2xl animate-bounce-slow">
              {steps[currentStep].icon}
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-white text-center mb-3 drop-shadow-md tracking-tight">
            {steps[currentStep].title}
          </h1>
          <p className="text-white/80 text-center text-lg leading-relaxed max-w-xs mx-auto font-medium">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
            <button
              onClick={finishOnboarding}
              className={`text-white/70 font-bold text-sm px-4 py-2 hover:text-white transition-colors ${
                currentStep === steps.length - 1 ? "invisible" : ""
              }`}
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] active:scale-95 transition-all"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              {currentStep === steps.length - 1 ? <Check size={20} /> : <ArrowRight size={20} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;