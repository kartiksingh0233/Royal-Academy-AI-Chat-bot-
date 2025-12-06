import React from 'react';
import { FeatureId, FeatureConfig } from '../types';
import SchoolLogo from './SchoolLogo';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeFeature: FeatureId;
  onNavigate: (id: FeatureId) => void;
  features: FeatureConfig[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeFeature, onNavigate, features }) => {
  return (
    <div className="flex h-screen w-screen bg-cyber-black text-white relative overflow-hidden">
      
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-cyber-blue/20 bg-cyber-dark/80 backdrop-blur-md z-20">
        <div className="p-6 flex items-center gap-3 border-b border-cyber-blue/10">
          <SchoolLogo />
          <div>
            <h1 className="font-display font-bold text-cyber-blue tracking-wider text-sm">ROYAL ACADEMY</h1>
            <div className="text-[10px] text-cyber-gold tracking-[0.2em] animate-pulse">SYSTEM ONLINE</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => onNavigate(feature.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 group border ${
                activeFeature === feature.id
                  ? 'bg-cyber-blue/10 border-cyber-blue text-cyber-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border-transparent hover:bg-white/5 hover:border-white/10 text-slate-400'
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{feature.icon}</span>
              <div className="flex flex-col">
                <span className="font-display font-semibold text-sm tracking-wide">{feature.label}</span>
                <span className="text-[10px] opacity-60 truncate">{feature.description}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-cyber-blue/10">
          <div className="bg-gradient-to-r from-red-900/20 to-transparent p-3 rounded border border-red-500/30">
             <div className="text-[10px] text-red-400 font-bold mb-1">ALERT: EXAM WEEK</div>
             <div className="h-1 w-full bg-red-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[70%] animate-pulse"></div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
         {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-cyber-blue/20 flex items-center justify-between px-4 bg-cyber-dark/90 backdrop-blur">
           <SchoolLogo />
           <span className="font-display text-cyber-blue">EDU_BOT v2.0</span>
        </header>
        
        <div className="flex-1 overflow-hidden relative p-4 md:p-6 bg-grid-pattern bg-[length:40px_40px]">
           <div className="absolute inset-0 bg-radial-glow pointer-events-none"></div>
           {children}
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;
