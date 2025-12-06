import React from 'react';

const EduBotMascot: React.FC = () => {
  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64 animate-float flex justify-center items-center">
      {/* Glow behind */}
      <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl transform scale-75 animate-pulse"></div>
      
      {/* Robot Container */}
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        {/* Antenna */}
        <line x1="100" y1="50" x2="100" y2="20" stroke="#494D5F" strokeWidth="4" />
        <circle cx="100" cy="15" r="8" fill="#FF6B6B" className="animate-pulse" />
        
        {/* Head */}
        <rect x="50" y="50" width="100" height="80" rx="20" fill="white" stroke="#494D5F" strokeWidth="3" />
        
        {/* Face Screen */}
        <rect x="60" y="60" width="80" height="50" rx="10" fill="#333" />
        
        {/* Eyes (Animated) */}
        <g className="animate-[blink_4s_infinite]">
          <circle cx="80" cy="80" r="8" fill="#00E5FF" />
          <circle cx="120" cy="80" r="8" fill="#00E5FF" />
        </g>
        
        {/* Mouth */}
        <path d="M 85 95 Q 100 105 115 95" stroke="#00E5FF" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* Body */}
        <path d="M 60 140 L 140 140 L 130 190 L 70 190 Z" fill="#D0BDF4" stroke="#494D5F" strokeWidth="3" />
        
        {/* Arms */}
        <path d="M 50 150 Q 30 160 40 180" stroke="#494D5F" strokeWidth="8" fill="none" strokeLinecap="round" className="animate-[wave_3s_ease-in-out_infinite] origin-[50px_150px]" />
        <path d="M 150 150 Q 170 160 160 180" stroke="#494D5F" strokeWidth="8" fill="none" strokeLinecap="round" />
      </svg>
      
      <style>{`
        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-20deg); }
        }
      `}</style>
    </div>
  );
};

export default EduBotMascot;