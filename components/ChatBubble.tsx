
import React from 'react';
import { Message, Role } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;

  return (
    <div className="flex w-full py-2 animate-[slideIn_0.3s_ease-out]">
      <div className={`max-w-4xl mx-auto flex gap-4 px-4 w-full ${!isModel && 'flex-row-reverse'}`}>
        
        {/* Avatar / Icon */}
        <div className="flex-shrink-0 flex flex-col items-center justify-start mt-1">
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl border backdrop-blur-md shadow-lg ${
            isModel 
            ? 'bg-cyber-primary/20 border-cyber-primary/50 text-cyber-primary' 
            : 'bg-cyber-gold/20 border-cyber-gold/50 text-cyber-gold'
          }`}>
            <span className="text-xl">{isModel ? '🤖' : '👤'}</span>
          </div>
        </div>

        {/* Content Box */}
        <div className={`relative px-6 py-4 min-w-[120px] backdrop-blur-xl shadow-lg transition-all hover:scale-[1.01] duration-300 ${
            isModel 
            ? 'bg-cyber-panel/80 border-l-2 border-cyber-primary text-cyber-text rounded-tr-2xl rounded-br-2xl rounded-bl-2xl' 
            : 'bg-cyber-secondary/30 border-r-2 border-cyber-gold text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
        } ${isModel ? 'border-y border-r border-white/5' : 'border-y border-l border-white/5'}`}>
            
            {/* Header / Timestamp */}
            <div className={`flex items-center gap-2 mb-2 text-[10px] font-tech tracking-wider uppercase opacity-80 ${isModel ? 'text-cyber-primary' : 'text-cyber-gold justify-end'}`}>
               {isModel ? 'AI_RESPONSE_LOG' : 'USER_INPUT_STREAM'}
            </div>

            <div className={`prose prose-invert max-w-none leading-relaxed text-sm md:text-base font-light`}>
                {message.attachment && (
                <div className="mb-4">
                    <div className="relative inline-block border border-cyber-gold/50 rounded-lg overflow-hidden group shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        <img 
                        src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} 
                        alt="User Upload" 
                        className="max-h-60 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute bottom-0 right-0 bg-cyber-gold text-black text-[10px] px-2 py-1 font-bold font-mono">IMG_DATA</div>
                    </div>
                </div>
                )}

                {message.text}

                {/* Grounding / Sources */}
                {message.groundingMetadata?.groundingChunks && message.groundingMetadata.groundingChunks.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-cyber-primary">
                        <span className="text-[10px] font-tech tracking-widest uppercase border border-cyber-primary/50 px-2 py-0.5 rounded-full bg-cyber-primary/10">SOURCES_DETECTED</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {message.groundingMetadata.groundingChunks.map((chunk, idx) => (
                        chunk.web?.uri ? (
                        <a 
                            key={idx} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] font-mono bg-black/40 border border-cyber-primary/30 hover:bg-cyber-primary hover:text-black rounded px-2 py-1 text-cyber-primary transition-all group"
                        >
                            <span className="truncate max-w-[150px] group-hover:underline">{chunk.web.title || "External Link"}</span>
                            <span>↗</span>
                        </a>
                        ) : null
                    ))}
                    </div>
                </div>
                )}
            </div>
            
            {/* Decorative Tech Corners */}
            <div className={`absolute top-0 w-3 h-3 border-t border-white/30 ${isModel ? 'left-0 border-l' : 'right-0 border-r'}`}></div>
            <div className={`absolute bottom-0 w-3 h-3 border-b border-white/30 ${isModel ? 'right-0 border-r' : 'left-0 border-l'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
