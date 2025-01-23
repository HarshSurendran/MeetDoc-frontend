// import { io, Socket } from 'socket.io-client';
// import  appStore  from '../../redux/store/appStore';
// import {
//   addMessage,
//   setTypingStatus,
  
// } from '../../redux/slices/chatSlice';
// import { Message } from 'react-hook-form';
// import { useSelector } from 'react-redux';


// const SOCKET_SERVER_URL = import.meta.env.VITE_WEBRTC_SOCKET_BASE_URL;

// class ChatSocketService {
//   private socket: Socket | null = null;
//   private typingTimeout: NodeJS.Timeout | null = null;
//   const chat = useSelector((state)=> state.chat.chat)

//   connect(token: string) {
//     console.log("Reached conenct function")
//     this.socket = io(SOCKET_SERVER_URL || 'http://localhost:3000/chat', {
//       auth: {
//         token,
//         userType: 'doctor'
//       },
//       withCredentials: true,
//       transports: ['websocket'],
//     });
//     this.setupListeners();
//   }

//   private setupListeners() {
//     if (!this.socket) return;

//     this.socket.on('connect', () => {
//       console.log('Connected to WebSocket for chat');
//     });

//     this.socket.on('newMessage', (message) => {
//       if (this.chat.selectedUser?.id !== message.senderId) {
//         //todo: Handle this situation
//         console.log("Recieved new but not form seleceted user", message)
//       }
//       appStore.dispatch(addMessage(message));
//     });

//     // this.socket.on('userTyping', ({ userId }) => {
//     //   appStore.dispatch(setTypingStatus({ userId, isTyping: true }));
//     //   setTimeout(() => {
//     //     appStore.dispatch(setTypingStatus({ userId, isTyping: false }));
//     //   }, 3000);
//     // });

    

//     // this.socket.on('userStatusChange', ({ userId, status }) => {
//     //   appStore.dispatch(updatePatientStatus({ patientId: userId, status }));
//     // });

//     this.socket.on('disconnect', () => {
//       console.log('Disconnected from WebSocket');
//     });
//   }

//   // onNewMessage(callback: (data: { newMessage: Message }) => void) {
//   //   if (!this.socket) return;
//   //   this.socket.on('newMessage', callback);
//   // }

//   // offNewMessage() {
//   //   if (!this.socket) return;
//   //   this.socket.off('newMessage');
//   // }

//   onPassUserDetails(userId: string, userType: "patient" | "doctor") {
//     if (!this.socket) return;
//     this.socket.on('PassUserDetails', ({ clientId }) => {
//         this.userDetails(userId, userType);
//     })
//   }

//   offPassuserDetails() {
//     if (!this.socket) return;
//     this.socket.off('PassUserDetails');
//   }

//   userDetails(userId: string, userType: "patient" | "doctor") {
//     if (!this.socket) return;
//     this.socket.emit('userDetails', { userId, userType });
//   }

//   sendMessage(senderId: string, senderType: "patient" | "doctor", receiverId: string, content: string) {
//     if (!this.socket) return;
    
//     this.socket.emit('sendMessage', {
//       senderId,
//       senderType,
//       receiverId,
//       content,
//     });

//   }

  

//   offMessageSent() {
//     if (!this.socket) return;
//     this.socket.off('messageSent');
//   }

//   // sendTypingStatus(receiverId: string) {
//   //   if (!this.socket || !this.typingTimeout) return;

//   //   clearTimeout(this.typingTimeout);
//   //   this.socket.emit('typing', { receiverId });

//   //   this.typingTimeout = setTimeout(() => {
//   //     this.socket?.emit('stopTyping', { receiverId });
//   //   }, 2000);
//   // }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }
// }

// export const chatSocketService = new ChatSocketService();


import { io, Socket } from 'socket.io-client';
import appStore from '../../redux/store/appStore';
import { addMessage, incomingVideoCall, resetVideoCall, setTypingStatus, toggleRedicrectToChat, updateOnlineUsers } from '../../redux/slices/chatSlice';
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
      console.log('Received new message:', message,"selected user is", selectedUser);
      if (selectedUser?.id !== message.receiverId) {
        //todo: Handle this situation when message recived is not from the selected user
        console.log('Received new but not from selected user', message);
        return;
      }

      appStore.dispatch(addMessage(message));
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
