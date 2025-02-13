import React from 'react';
import { Stethoscope } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      {/* Main container with breathing animation */}
      <div className="relative animate-pulse">
        {/* Circular background with ripple effect */}
        <div className="absolute -inset-4 rounded-full bg-blue-200 animate-ping opacity-25" />
        <div className="absolute -inset-4 rounded-full bg-blue-100 opacity-50" />
        
        {/* Stethoscope icon with rotation */}
        <div className="relative p-4 bg-white rounded-full shadow-lg animate-spin-slow">
          <Stethoscope className="w-12 h-12 text-blue-600" />
        </div>
      </div>
      
      {/* Loading text with fade animation */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold text-blue-600 animate-fade-in">
          MeetDoc
        </h2>
        <p className="mt-2 text-gray-600 animate-fade-in delay-200">
          Connecting you with healthcare professionals
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation;