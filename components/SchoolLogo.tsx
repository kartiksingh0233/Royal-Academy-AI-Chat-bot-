
import React from 'react';

const SchoolLogo: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
        <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Neon Shield */}
        <path 
          d="M 10 15 L 90 15 L 90 40 L 85 45 L 85 80 L 50 115 L 15 80 L 15 45 L 10 40 Z" 
          fill="rgba(6,182,212,0.1)" 
          stroke="#06b6d4" 
          strokeWidth="2"
          filter="url(#neon-glow)"
        />
        
        {/* Inner Tech Detail */}
        <path 
            d="M 20 25 L 80 25 M 50 25 L 50 100" 
            stroke="#06b6d4" 
            strokeWidth="1"
            opacity="0.5"
        />
        
        {/* Crown Icon */}
        <path 
          d="M 30 35 L 30 20 L 40 30 L 50 15 L 60 30 L 70 20 L 70 35" 
          fill="none" 
          stroke="#fbbf24" 
          strokeWidth="2" 
          strokeLinejoin="round"
          className="animate-pulse"
          filter="url(#neon-glow)"
        />

        {/* Text */}
        <text x="50" y="65" textAnchor="middle" fill="#fff" fontSize="16" fontFamily="Rajdhani" fontWeight="bold" letterSpacing="2">RA</text>
        <text x="50" y="80" textAnchor="middle" fill="#06b6d4" fontSize="8" fontFamily="Rajdhani" letterSpacing="1">LALITPUR</text>
      </svg>
    </div>
  );
};

export default SchoolLogo;
