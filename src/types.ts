export interface BlobFile {
  name: string;
  size: number;
  width: number;
  height: number;
  url: string;
  createdAt: string;
  category: 'original' | 'resized';
}

export interface GuideStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface TerminalLog {
  timestamp: string;
  type: 'info' | 'error' | 'success' | 'system';
  message: string;
}
