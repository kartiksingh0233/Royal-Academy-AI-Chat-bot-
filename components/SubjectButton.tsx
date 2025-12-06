import React from 'react';
import { SubjectConfig } from '../types';

interface SubjectButtonProps {
  config: SubjectConfig;
  onClick: () => void;
  disabled?: boolean;
}

const SubjectButton: React.FC<SubjectButtonProps> = ({ config, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative w-full sm:w-auto flex-1 min-w-[120px] h-24 sm:h-32 
        ${config.color} 
        rounded-3xl border-b-[8px] sm:border-b-[12px] ${config.borderColor}
        active:border-b-0 active:translate-y-[8px] sm:active:translate-y-[12px]
        transition-all duration-150 ease-out
        focus:outline-none
        disabled:opacity-70 disabled:cursor-not-allowed disabled:active:border-b-[12px] disabled:active:translate-y-0
      `}
    >
      <div className="flex flex-col items-center justify-center h-full pb-2">
        <span className="text-4xl sm:text-5xl mb-1 filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">
          {config.icon}
        </span>
        <span className="text-edu-dark font-bold text-lg sm:text-xl tracking-wide">
          {config.label}
        </span>
      </div>
      
      {/* Shine effect */}
      <div className="absolute top-2 left-2 right-2 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-2xl pointer-events-none"></div>
    </button>
  );
};

export default SubjectButton;