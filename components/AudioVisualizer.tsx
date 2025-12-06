import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  volume: number; // 0 to 1
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, volume }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.1;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);
      
      // Cyber Grid Background
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=0; i<width; i+=20) {
          ctx.moveTo(i, 0); ctx.lineTo(i, height);
      }
      for(let i=0; i<height; i+=20) {
          ctx.moveTo(0, i); ctx.lineTo(width, i);
      }
      ctx.stroke();

      if (!isActive) {
        // Flatline
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.strokeStyle = '#0ea5e9';
        ctx.stroke();
        return;
      }

      // Draw Waveform
      ctx.beginPath();
      ctx.moveTo(0, centerY);

      // Dynamic amplitude based on volume
      const amplitude = Math.max(10, volume * 200); 

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * 0.05 + time) * amplitude * Math.sin(x * 0.01) * (Math.sin(time * 0.5) + 1.5);
        ctx.lineTo(x, y);
      }

      // Glow Effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#06b6d4';
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary Wave
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * 0.03 - time) * (amplitude * 0.6);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'; // Gold
      ctx.lineWidth = 2;
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, volume]);

  return (
    <div className="w-full h-48 md:h-64 bg-black/40 border border-cyber-cyan/30 rounded-lg overflow-hidden relative">
        <canvas ref={canvasRef} width={600} height={256} className="w-full h-full" />
        <div className="absolute top-2 left-2 text-xs text-cyber-cyan font-mono animate-pulse">
            VOICE_UPLINK_ESTABLISHED
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-cyber-gold font-mono">
             FREQ: 16kHz // SECURE
        </div>
    </div>
  );
};

export default AudioVisualizer;
