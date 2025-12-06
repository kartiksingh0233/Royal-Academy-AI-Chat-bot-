

export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  attachment?: Attachment; // For user uploads
  groundingMetadata?: GroundingMetadata; // For search sources
}

export enum FeatureId {
  CHAT = 'chat',
}

export interface FeatureConfig {
  id: FeatureId;
  label: string;
  icon: string;
  description?: string;
}

export interface SubjectConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  borderColor: string;
}

export interface LiveConnectionState {
  isConnected: boolean;
  isSpeaking: boolean;
  volume: number;
}
