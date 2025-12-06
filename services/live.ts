
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

interface LiveClientConfig {
  onOpen: () => void;
  onClose: () => void;
  onVolumeChange: (volume: number) => void;
  onError: (error: Error) => void;
}

export class LiveClient {
  private config: LiveClientConfig;
  private audioContext: AudioContext | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private stream: MediaStream | null = null;
  private nextStartTime = 0;
  private session: any = null; // Session promise
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  
  constructor(config: LiveClientConfig) {
    this.config = config;
  }

  async connect() {
    // Create client here to ensure it uses the latest API Key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 16000, // Gemini Live expects 16kHz input usually, but we can resample if needed. 
                         // Note: The example uses 16k for input context.
    });
    
    // Output context for playback (higher quality)
    const outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000,
    });

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log("Live Session Connected");
            this.config.onOpen();
            this.startAudioInput(sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output from Model
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
               await this.playAudioChunk(base64Audio, outputContext);
            }
            
            // Handle Interruption
            if (message.serverContent?.interrupted) {
              this.stopAudioPlayback();
            }
          },
          onclose: () => {
            console.log("Live Session Closed");
            this.disconnect();
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            this.config.onError(new Error(err.message));
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      this.session = sessionPromise;

    } catch (err) {
      this.config.onError(err as Error);
    }
  }

  private startAudioInput(sessionPromise: Promise<any>) {
    if (!this.audioContext || !this.stream) return;

    this.inputSource = this.audioContext.createMediaStreamSource(this.stream);
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Calculate volume for visualization
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.config.onVolumeChange(rms);

      // Create PCM Blob
      const pcmBlob = this.createBlob(inputData);
      
      sessionPromise.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    this.inputSource.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  private async playAudioChunk(base64Audio: string, ctx: AudioContext) {
    try {
        const audioBuffer = await this.decodeAudioData(this.decodeBase64(base64Audio), ctx);
        
        this.nextStartTime = Math.max(this.nextStartTime, ctx.currentTime);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(this.nextStartTime);
        
        this.nextStartTime += audioBuffer.duration;
        this.activeSources.add(source);
        
        source.onended = () => {
            this.activeSources.delete(source);
        };
        
        // Also visualize output volume
        // (Simplified: we rely on input volume for the visualizer mostly, or we could add an analyzer here)
    } catch (e) {
        console.error("Audio Decode Error", e);
    }
  }

  private stopAudioPlayback() {
    this.activeSources.forEach(source => source.stop());
    this.activeSources.clear();
    this.nextStartTime = 0;
  }

  disconnect() {
    this.stopAudioPlayback();
    if (this.processor) {
        this.processor.disconnect();
        this.processor.onaudioprocess = null;
    }
    if (this.inputSource) this.inputSource.disconnect();
    if (this.stream) this.stream.getTracks().forEach(track => track.stop());
    if (this.audioContext) this.audioContext.close();
    
    // Close session if method exists (it doesn't on the promise directly, but the session obj)
    this.session?.then((s: any) => {
        if(s.close) s.close();
    });

    this.config.onClose();
  }

  // --- Utils ---
  
  private createBlob(data: Float32Array): any {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: this.encodeBase64(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private encodeBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }
}
