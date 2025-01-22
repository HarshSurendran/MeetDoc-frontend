import { io, Socket } from 'socket.io-client';
import { confirmConnection, confirmDisconnection } from '../actions/chatSocketAction';


const SOCKET_SERVER_URL = import.meta.env.VITE_WEBRTC_SOCKET_BASE_URL;


class ChatSocketService {
    private socket : Socket | null = null;

    connectChatSocket() {
        if (!this.socket) {
            console.log("requesting connection to chat socket");
            this.socket = io(`${SOCKET_SERVER_URL}/chat`, {
            transports: ['websocket'],
            });

            this.socket.on('connect', () => {
                console.log('Connected to Chat Socket', this.socket?.id);
                if (this.socket) {
                    confirmConnection(this.socket);
                }
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from Chat Socket.');
                confirmDisconnection();
            });
        }
    }

    

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            confirmDisconnection();
        };
    };



}


export const chatSocketService = new ChatSocketService;
