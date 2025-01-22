import { io, Socket } from 'socket.io-client';
import  appStore  from '../../redux/store/appStore';
import {
  addMessage,
  setTypingStatus,
  updatePatientStatus,
} from '../../redux/slices/chatSlice';


const SOCKET_SERVER_URL = import.meta.env.VITE_WEBRTC_SOCKET_BASE_URL;

class SocketService {
  private socket: Socket | null = null;
  private typingTimeout: NodeJS.Timeout | null = null;

  connect(token: string) {
    this.socket = io(SOCKET_SERVER_URL || 'http://localhost:3000', {
      auth: {
        token,
        userType: 'doctor'
      },
      withCredentials: true,
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('newMessage', (message) => {
      appStore.dispatch(addMessage(message));
    });

    this.socket.on('userTyping', ({ userId }) => {
      appStore.dispatch(setTypingStatus({ userId, isTyping: true }));
      setTimeout(() => {
        appStore.dispatch(setTypingStatus({ userId, isTyping: false }));
      }, 3000);
    });

    this.socket.on('userStatusChange', ({ userId, status }) => {
      appStore.dispatch(updatePatientStatus({ patientId: userId, status }));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });
  }

  sendMessage(receiverId: string, content: string) {
    if (!this.socket) return;
    
    this.socket.emit('sendMessage', {
      receiverId,
      content,
    });
  }

  sendTypingStatus(receiverId: string) {
    if (!this.socket || !this.typingTimeout) return;

    clearTimeout(this.typingTimeout);
    this.socket.emit('typing', { receiverId });

    this.typingTimeout = setTimeout(() => {
      this.socket?.emit('stopTyping', { receiverId });
    }, 2000);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();