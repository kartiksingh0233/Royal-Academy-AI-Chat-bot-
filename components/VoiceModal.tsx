
import React from 'react';
import AudioVisualizer from './AudioVisualizer';
import SchoolLogo from './SchoolLogo';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSpeaking: boolean;
  volume: number;
}

const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, volume }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]">
      
      {/* Background Grid Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="w-full h-full bg-grid-pattern bg-[length:30px_30px] animate-[pulse-glow_4s_infinite]"></div>
      </div>

      {/* Main HUD Container */}
      <div className="w-full max-w-3xl h-[85vh] bg-cyber-panel/95 border border-cyber-primary/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col relative overflow-hidden">
        
        {/* Top HUD Bar */}
        <div className="h-14 border-b border-cyber-primary/30 bg-cyber-bg/80 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                <span className="text-cyber-primary font-tech tracking-[0.2em] font-bold text-sm">SECURE_CHANNEL // ENCRYPTED</span>
            </div>
            <div className="text-cyber-text/50 font-mono text-xs border border-white/10 px-2 py-1 rounded">FREQ: 16.0 kHz</div>
        </div>

        {/* Central Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative p-8">
            
            {/* Holographic Circle */}
            <div className="relative w-72 h-72 flex items-center justify-center mb-10">
                {/* Rotating Rings */}
                <div className="absolute inset-0 border border-dashed border-cyber-primary/40 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-4 border border-cyber-secondary/40 rounded-full animate-[spin_7s_linear_infinite_reverse]"></div>
                <div className="absolute inset-0 rounded-full shadow-[0_0_80px_rgba(6,182,212,0.15)]"></div>
                
                {/* Visualizer inside circle */}
                <div className="w-56 h-56 rounded-full overflow-hidden bg-black border-4 border-cyber-panel relative shadow-inner">
                     <div className="absolute inset-0 opacity-90">
                        <AudioVisualizer isActive={true} volume={volume} />
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-20 h-20 opacity-80"><SchoolLogo /></div>
                     </div>
                </div>
            </div>

            <div className="text-center space-y-3 z-10">
                <h2 className="text-4xl font-tech font-bold text-white tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    VOICE UPLINK ACTIVE
                </h2>
                <div className="inline-block px-4 py-1 bg-cyber-primary/10 rounded-full border border-cyber-primary/30">
                    <p className="text-cyber-primary font-mono text-sm animate-pulse">
                        &lt; Listening for audio input... &gt;
                    </p>
                </div>
            </div>
        </div>

        {/* Bottom Controls */}
        <div className="p-8 flex justify-center border-t border-cyber-primary/30 bg-cyber-bg/80 relative">
            {/* Tech Decoration */}
            <div className="absolute bottom-3 left-4 text-[10px] text-cyber-text/30 font-mono">SYS_V2.0.4 // ID_492</div>

            <button 
                onClick={onClose}
                className="group relative px-10 py-4 bg-red-500/10 border border-red-500 hover:bg-red-500/20 text-red-400 font-tech font-bold tracking-[0.2em] uppercase transition-all overflow-hidden rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            >
                <span className="relative z-10 flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-sm animate-pulse"></span>
                    Terminate Connection
                </span>
                {/* Glitch Effect on Hover */}
                <div className="absolute inset-0 bg-red-500/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></div>
            </button>
        </div>

      </div>
    </div>
  );
};

export default VoiceModal;
