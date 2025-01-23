
export interface Message {
    _id: string;
    content: string;
    senderId: string;
    receiverId: string;
    senderType: 'doctor' | 'patient';
    receiverType: 'doctor' | 'patient';
    timestamp: Date;
    isRead: boolean;
  }
  
  export interface User {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline';
    lastSeen: Date;
    lastMessage?: string;
    unreadCount: number;
  }
  
  // export interface ChatState {
  //   selectedPatient: Patient | null;
  //   patients: Patient[];
  //   messages: Message[];
  //   isLoading: boolean;
  //   error: string | null;
  //   typingUsers: { [key: string]: boolean };
// }
  
export interface ChatState {  
    selectedUser: User | null,
    peoples: User[],
    messages: Message[],
    isMessagesLoading: boolean,
    isPeopleLoading: boolean,
    error: string | null,
  typingUsers: { [key: string]: boolean },
  onlineUsers: string[],
  incomingVideoCall: {
    isIncoming: boolean,
    from: string,
    to: string,
    videoCallId: string
  },
  redirectToChat: boolean,
}