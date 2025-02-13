import { io, Socket } from 'socket.io-client';
import appStore from '../../redux/store/appStore';
import { addMessage, changeLastMessage, incomingVideoCall, resetVideoCall, toggleRedicrectToChat, updateOnlineUsers, updateUnreadCount } from '../../redux/slices/chatSlice';
const SOCKET_SERVER_URL = import.meta.env.VITE_CHAT_SOCKET_URL;

class ChatSocketService {
  private socket: Socket | null = null;
  // private typingTimeout: NodeJS.Timeout | null = null;

  connect(token: string, id: string) {
    console.log('Reached connect function');
    this.socket = io(SOCKET_SERVER_URL || 'http://localhost:3000/chat', {
      auth: {
        token,
        userId: id,
      },
      withCredentials: true,
      transports: ['websocket'],
    });
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket for chat');
    });

    this.socket.on('newMessage', (message) => {
      const state = appStore.getState();
      const selectedUser = state.chat.selectedUser;
      console.log('Received new message:', message, "selected user is", selectedUser?.name);
      console.log('message sender Id ', message.senderId)
      if (selectedUser?.id !== message.receiverId) {
        //todo: Handle this situation when message recived is not from the selected user
        appStore.dispatch(changeLastMessage({ userId: message.receiverId, message: message.content }));
        appStore.dispatch(updateUnreadCount({ userId: message.receiverId }));

        console.log('Received new but not from selected user', message);
        return;
      }

      appStore.dispatch(addMessage(message));
      appStore.dispatch(changeLastMessage({ userId: message.receiverId, message: message.content }));
      //todo: Handle is read change situtation
      // const result = toggleIsRead(message.senderId, message.receiverId);
    });

    this.socket.on('onlineUsers', (payload) => {
      console.log('Online users:', payload.onlineUsers);
      appStore.dispatch(updateOnlineUsers( payload.onlineUsers))
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    this.socket.on('VideoCallInitiated', ({ from, to, videoCallId }) => {
      console.log("VideoCallInitiated", { from, to, videoCallId });
      appStore.dispatch(incomingVideoCall({ from, to, videoCallId }));
    });

    this.socket.on('RecieverNotOnline', ({ from, to, videoCallId }) => {
      console.log("RecieverNotOnline", { from, to, videoCallId });
      appStore.dispatch(toggleRedicrectToChat(true));
      appStore.dispatch(resetVideoCall());
    });

    this.socket.on('VideoCallAccepted', ({ from, to, videoCallId }) => {
      console.log("VideoCallAccepted", { from, to, videoCallId });
      //todo: Handle navigation to video call screen
      appStore.dispatch(resetVideoCall());
    });

    this.socket.on('VideoCallRejected', ({ from, to, videoCallId }) => {
      console.log("VideoCallRejected -----------", { from, to, videoCallId });
      appStore.dispatch(toggleRedicrectToChat(true));
      appStore.dispatch(resetVideoCall());
    })

  }

  sendMessage(senderId: string, senderType: 'patient' | 'doctor', receiverId: string, content: string) {
    if (!this.socket) return;
    this.socket.emit('sendMessage', {
      senderId,
      senderType,
      receiverId,
      content,
    });
  }

  sendVideoCallId(from: string, to: string, videoCallId: string) {
    if (!this.socket) return;
    this.socket.emit('VideoCallInitiated', {
      from,
      to,
      videoCallId,
    });
    appStore.dispatch(incomingVideoCall({ from, to, videoCallId }));
  }

  rejectVideoCall(from: string, to: string, videoCallId: string) {
    console.log("VideoCallRejected", { from, to, videoCallId });
    if (!this.socket) return;
    this.socket.emit('VideoCallRejected', {
      from,
      to,
      videoCallId,
    });
  }

  acceptVideoCall(from: string, to: string, videoCallId: string) {
    if (!this.socket) return;
    this.socket.emit('VideoCallAccepted', {
      from,
      to,
      videoCallId,
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const chatSocketService = new ChatSocketService();
