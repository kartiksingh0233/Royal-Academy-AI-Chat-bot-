
import React from 'react';

const FloatingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-cyber-bg">
      {/* High-Res School Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-in-out transform hover:scale-105"
        style={{
            // Using a high-quality representational image for Royal Academy
            backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2572&auto=format&fit=crop')",
        }}
      ></div>
      
      {/* Tech Overlay Gradient (Darkens image for text readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-bg/90 via-cyber-bg/80 to-cyber-bg/90 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-cyber-panel/30 backdrop-blur-[2px]"></div>

      {/* Cyber Grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:60px_60px] opacity-10 transform perspective-1000 rotate-x-12 scale-110"></div>
      
      {/* Scanning Laser Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-primary/10 to-transparent h-full animate-scan opacity-20"></div>

      {/* Floating Holographic Elements */}
      <div className="absolute top-[15%] left-[10%] text-cyber-primary/5 font-tech text-9xl animate-float select-none blur-sm font-bold">ROYAL</div>
      <div className="absolute bottom-[20%] right-[5%] text-cyber-gold/5 font-tech text-9xl animate-float select-none blur-sm font-bold" style={{animationDelay: '1.5s'}}>ACADEMY</div>
      
      {/* Neon Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyber-primary/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyber-secondary/20 rounded-full blur-[120px] animate-pulse-glow" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

export default FloatingBackground;
