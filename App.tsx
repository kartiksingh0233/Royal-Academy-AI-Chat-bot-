
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { createChatSession, sendMessageToGemini } from './services/gemini';
import { LiveClient } from './services/live';
import { Message, Role, FeatureId, Attachment } from './types';
import { INITIAL_GREETING, FEATURES, SUGGESTED_PROMPTS } from './constants';
import ChatBubble from './components/ChatBubble';
import VoiceModal from './components/VoiceModal';
import SchoolLogo from './components/SchoolLogo';
import FloatingBackground from './components/FloatingBackground';

const App: React.FC = () => {
  // --- State ---
  const [activeFeature, setActiveFeature] = useState<FeatureId>(FeatureId.CHAT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Voice State
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [volume, setVolume] = useState(0);
  const liveClientRef = useRef<LiveClient | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---
  useEffect(() => {
    startNewChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const startNewChat = () => {
    const session = createChatSession();
    setChatSession(session);
    setMessages([{
      id: 'init',
      role: Role.MODEL,
      text: INITIAL_GREETING,
      timestamp: new Date(),
    }]);
    setAttachment(null);
  };

  // --- Handlers ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setAttachment({
          mimeType: file.type,
          data: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputText(prompt); 
    handleSendMessage(prompt);
  };

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if ((!textToSend.trim() && !attachment) || loading) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: Role.USER, 
      text: textToSend, 
      timestamp: new Date(),
      attachment: attachment ? { ...attachment } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachment(null);
    setLoading(true);

    try {
      if (!chatSession) return;
      const response = await sendMessageToGemini(chatSession, userMsg.text, userMsg.attachment);
      const botMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          role: Role.MODEL, 
          text: response.text, 
          timestamp: new Date(),
          groundingMetadata: response.groundingMetadata
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: Role.MODEL,
        text: "SYSTEM ERROR: Connection to neural network interrupted. Retrying...",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceMode = async () => {
    if (isVoiceOpen) {
      liveClientRef.current?.disconnect();
      setIsVoiceOpen(false);
    } else {
      setIsVoiceOpen(true);
      const client = new LiveClient({
        onOpen: () => console.log("Voice connected"),
        onClose: () => setIsVoiceOpen(false),
        onVolumeChange: (vol) => setVolume(vol),
        onError: (err) => {
            console.error(err);
            alert("MIC ACCESS DENIED. Check browser permissions.");
            setIsVoiceOpen(false);
        }
      });
      liveClientRef.current = client;
      await client.connect();
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden relative text-cyber-text selection:bg-cyber-primary selection:text-black">
      
      <FloatingBackground />

      {/* Cyber Sidebar - High Glassmorphism */}
      <div className="hidden md:flex flex-col w-[280px] bg-cyber-panel/60 backdrop-blur-xl border-r border-white/5 z-20 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        
        <div className="flex flex-col items-center gap-3 p-8 border-b border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyber-primary/5 group-hover:bg-cyber-primary/10 transition-colors"></div>
            <div className="transform group-hover:scale-110 transition-transform duration-500">
                <SchoolLogo />
            </div>
            <div className="text-center z-10 mt-2">
                <h1 className="font-tech font-bold text-2xl text-white tracking-[0.2em] uppercase drop-shadow-lg">Royal Academy</h1>
                <div className="text-[10px] text-cyber-primary font-mono tracking-widest mt-1">LALITPUR // V2.0</div>
            </div>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-6">
            <button 
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 border border-cyber-primary/50 text-white hover:border-cyber-primary hover:shadow-neon transition-all font-tech font-bold tracking-wider group"
            >
                <span className="text-xl group-hover:rotate-90 transition-transform">+</span> NEW NEURAL SESSION
            </button>

            <div className="space-y-3">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Command Modules</div>
                {FEATURES.map(feature => (
                    <button
                        key={feature.id}
                        onClick={() => setActiveFeature(feature.id)}
                        className={`flex items-center gap-3 px-4 py-3 w-full rounded border transition-all duration-300 ${
                            activeFeature === feature.id 
                            ? 'bg-cyber-primary/10 border-cyber-primary text-cyber-primary shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                            : 'border-transparent hover:bg-white/5 text-gray-400'
                        }`}
                    >
                        <span className="text-xl filter drop-shadow-glow">{feature.icon}</span>
                        <div className="flex flex-col items-start">
                            <span className="font-tech tracking-wide font-bold">{feature.label}</span>
                            <span className="text-[10px] text-white/30 font-mono">{feature.description}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
        
        <div className="p-4 border-t border-white/5 text-center bg-black/20">
            <div className="text-[10px] text-white/30 font-mono">
                SYSTEM STATUS: <span className="text-green-400">ONLINE</span><br/>
                POWERED BY KARTIK_023
            </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col relative z-10 h-full">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-cyber-panel/80 border-b border-white/10 backdrop-blur-xl z-20 sticky top-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8"><SchoolLogo /></div>
                <span className="font-tech font-bold text-white text-lg tracking-wide">RA_BOT</span>
            </div>
            <button onClick={startNewChat} className="w-8 h-8 flex items-center justify-center border border-cyber-primary text-cyber-primary rounded bg-cyber-primary/10">
                +
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto relative p-2 md:p-0 scroll-smooth">
            <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
                
                {messages.length === 1 && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-[fadeIn_0.5s_ease-out]">
                        <div className="w-32 h-32 mb-8 relative group cursor-pointer">
                            <div className="absolute inset-0 border-2 border-cyber-primary rounded-full animate-ping opacity-20"></div>
                            <div className="absolute inset-0 border border-cyber-secondary rounded-full animate-[spin_10s_linear_infinite] opacity-50"></div>
                            <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                                <div className="w-24 h-24"><SchoolLogo /></div>
                            </div>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-tech font-bold text-white mb-2 tracking-tight drop-shadow-2xl">
                            ROYAL ACADEMY
                        </h2>
                        <h3 className="text-2xl font-tech text-cyber-primary tracking-[0.5em] mb-10">AI_ASSISTANT</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                            {SUGGESTED_PROMPTS.map((item, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handlePromptClick(item.prompt)}
                                    className="relative overflow-hidden p-5 bg-cyber-panel/40 border border-white/10 hover:border-cyber-primary/50 hover:bg-cyber-panel/60 rounded-xl flex items-center gap-4 transition-all group text-left backdrop-blur-md"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="text-2xl group-hover:scale-110 transition-transform filter drop-shadow-glow">{idx === 0 ? '⚡' : idx === 1 ? '📅' : idx === 2 ? '💰' : '📍'}</span>
                                    <div className="relative z-10">
                                        <div className="font-tech font-bold text-white text-lg">{item.label}</div>
                                        <div className="text-xs text-cyber-text/60 font-mono truncate max-w-[200px]">{item.prompt}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex-1 p-4 md:p-8 space-y-6">
                    {messages.map(msg => (
                        <ChatBubble key={msg.id} message={msg} />
                    ))}
                    {loading && (
                        <div className="flex items-center gap-2 text-cyber-primary font-mono text-xs animate-pulse ml-12 p-3 bg-cyber-primary/5 border border-cyber-primary/20 rounded-lg inline-flex backdrop-blur-sm">
                            <span>ANALYZING_DATA_STREAMS</span>
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce delay-200"></span>
                            </span>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" /> 
                </div>
            </div>
        </div>

        {/* Futuristic Input Control Deck */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent pt-10 z-20">
            <div className="max-w-3xl mx-auto relative">
                
                {/* Upload Preview */}
                {attachment && (
                    <div className="absolute -top-16 left-0 bg-cyber-panel/90 border border-cyber-gold/50 px-4 py-2 rounded-lg flex items-center gap-3 animate-[slideIn_0.2s_ease-out] backdrop-blur-md shadow-lg">
                        <span className="text-cyber-gold font-mono text-xs font-bold">IMAGE_DATA_LOADED</span>
                        <button onClick={() => setAttachment(null)} className="text-red-400 hover:text-red-300 font-bold">×</button>
                    </div>
                )}

                <div className="flex items-end gap-3 bg-cyber-panel/60 border border-white/10 rounded-2xl p-2 backdrop-blur-xl shadow-2xl focus-within:border-cyber-primary/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300">
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 text-cyber-primary hover:bg-cyber-primary hover:text-black transition-all duration-300"
                        title="Upload Visual Data"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />

                    <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                        placeholder="Enter command or query..."
                        className="flex-1 max-h-[120px] min-h-[48px] bg-transparent border-0 focus:ring-0 text-white placeholder-white/30 resize-none py-3 font-mono text-sm leading-relaxed"
                        rows={1}
                    />

                    <button 
                        onClick={() => handleSendMessage()}
                        disabled={!inputText.trim() && !attachment}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            inputText.trim() || attachment 
                            ? 'bg-gradient-to-tr from-cyber-primary to-cyber-secondary text-white shadow-neon hover:scale-105' 
                            : 'bg-white/5 text-gray-600'
                        }`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Floating Call Button - Futuristic Style */}
      <button
            onClick={toggleVoiceMode}
            title="Initiate Voice Uplink"
            className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] border-2 border-white/20 backdrop-blur-md
            ${isVoiceOpen 
                ? 'bg-red-500/80 animate-pulse border-red-400' 
                : 'bg-cyber-panel/80 hover:bg-cyber-primary hover:text-black text-cyber-primary'
            }`}
        >
            {isVoiceOpen ? (
                 <span className="text-xl font-bold">✖</span>
            ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-[wiggle_2s_infinite]">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
            )}
            
            {/* Ping Effect Ring */}
            {!isVoiceOpen && (
                <>
                    <span className="absolute inset-0 rounded-full border border-cyber-primary animate-ping opacity-30"></span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-gold rounded-full animate-bounce shadow-neon-gold border border-black"></span>
                </>
            )}
      </button>

      <VoiceModal 
            isOpen={isVoiceOpen} 
            onClose={toggleVoiceMode} 
            isSpeaking={false} 
            volume={volume}
      />

    </div>
  );
};

export default App;
