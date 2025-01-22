
export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    senderType: 'doctor' | 'patient';
    receiverType: 'doctor' | 'patient';
    timestamp: Date;
    isRead: boolean;
  }
  
  export interface Patient {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline';
    lastSeen: Date;
    lastMessage?: string;
    unreadCount: number;
  }
  
  export interface ChatState {
    selectedPatient: Patient | null;
    patients: Patient[];
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    typingUsers: { [key: string]: boolean };
  }