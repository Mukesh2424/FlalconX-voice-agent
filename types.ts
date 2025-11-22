export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isComplete: boolean;
  timestamp: Date;
}

export interface AudioVisualizerData {
  volume: number; // 0.0 to 1.0
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}
