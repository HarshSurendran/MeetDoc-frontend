import { io, Socket } from 'socket.io-client';


const SOCKET_SERVER_URL = import.meta.env.VITE_WEBRTC_SOCKET_BASE_URL;

class WebrtcSocketService {
    private socket: Socket | null = null;

    connectWebrtcSocket() {
        if (!this.socket) {
            console.log("requesting connection to webrtc socket");
            this.socket = io(`${SOCKET_SERVER_URL}`, {
            transports: ['websocket'],
            });

            this.socket.on('connect', () => {
                console.log('Connected to WebSocket for webrtc', this.socket?.id);
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from WebSocket for webrtc');
            });
        }
    }
        
    joinRoom(roomId: string) {
        if (this.socket) {
            this.socket.emit('join-room', {roomId});
        }
    }

    sendOffer(payload :{ target: string, offer: RTCSessionDescriptionInit }) {
        if (this.socket) {
            this.socket.emit('offer', payload);
        }
    }

    onOffer(callback: (payload: { target: string, offer: RTCSessionDescriptionInit }) => void) {
        if (this.socket) {
            this.socket.on('offer', callback);
        }
    }

    onAnswer(callback: (payload: { target: string, answer: RTCSessionDescriptionInit }) => void) {
        if (this.socket) {
            this.socket.on('answer', callback);
        }
    }

    sendAnswer(payload: { target: string, answer: RTCSessionDescriptionInit }) {
        if (this.socket) {
            this.socket.emit('answer', payload);
        }
    }
        
    onJoinRoom(callback: (payload: any) => void) {
        if (this.socket) {
            this.socket.on('join-room', callback);
        }
    }

    onPatientJoined(callback: (payload: any) => void) {
        if (this.socket) {
            this.socket.on('NewUserJoined', callback);
        }
    }

    sendNegotiationOffer(payload: { target: string, offer: RTCSessionDescriptionInit }) {
        if (this.socket) {
            this.socket.emit('negotiation-offer', payload);
        }
    }

    onNegotiationOffer(callback: (payload: { target: string, offer: RTCSessionDescriptionInit }) => void) {
        if (this.socket) {
            this.socket.on('negotiation-offer', callback);
        }
    }

    sendNegotiationAnswer(payload: { target: string, answer: RTCSessionDescriptionInit }) {
        if (this.socket) {
            this.socket.emit('negotiation-answer', payload);
        }
    }

    onNegotiationAnswer(callback: (payload: { target: string, answer: RTCSessionDescriptionInit }) => void) {
        if (this.socket) {
            this.socket.on('negotiation-answer', callback);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        };
    };
};

export const webrtcSocketService = new WebrtcSocketService();