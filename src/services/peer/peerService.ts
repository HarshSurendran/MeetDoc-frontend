
// class PeerService {
//     peer!: RTCPeerConnection;
//     constructor() {
//         this.initializePeerConnection();
//     }

//     async initializePeerConnection() {
//         if (this.peer) {
//             this.peer.close();
//         }
//         this.peer = new RTCPeerConnection({
//             iceServers: [{ urls: [ 'stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] }]
//         });
//     }

//     async getOffer() {
//         if (!this.peer || this.peer.signalingState === "closed") {
//             console.warn("Peer connection was closed. Re-initializing...");
//             this.initializePeerConnection();
//         }
        
//         if (this.peer) {
//             const offer = await this.peer.createOffer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//             return offer;
//         }
//     }

//     async getAnswer(offer: RTCSessionDescriptionInit) {
//         if (this.peer) {
//             await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
//             const answer = await this.peer.createAnswer();
//             await this.peer.setLocalDescription(answer);
//             return answer
//         }
//     }

//     async setRemoteDescriptionFn(answer: RTCSessionDescriptionInit) {
//         if (this.peer) {
//             await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
//         }
//     }

//     async addIceCandidate(candidate: RTCIceCandidateInit) {
//         if (this.peer) {
//             await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
//         }
//     }

//     async closeConnection() {
//         if (this.peer) {
//             console.log("Closing peer connection");
//             this.peer.close();
//         }
//     }
// }

// export default new PeerService();

class PeerService {
    peer!: RTCPeerConnection;

    constructor() {
        this.initializePeerConnection();
    }

    async initializePeerConnection() {
        if (this.peer) {
            alert("Peer connection was closed. Re-initializing...");
            this.peer.close();
        }

        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun:global.stun.twilio.com:3478'
                    ]
                }
            ],
            iceCandidatePoolSize: 10,
        });
        
        this.peer.addEventListener('connectionstatechange', () => {
            console.log('Connection state changed:', this.peer.connectionState);
        });

        this.peer.addEventListener('signalingstatechange', () => {
            console.log('Signaling state changed:', this.peer.signalingState);
        });

        this.peer.addEventListener('iceconnectionstatechange', () => {
            console.log('ICE connection state:', this.peer.iceConnectionState);
        });
    }

    async getOffer() {
        try {
            if (!this.peer || this.peer.signalingState === "closed") {
                await this.initializePeerConnection();
            }
            
            const offer = await this.peer.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            
            await this.peer.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }

    async getAnswer(offer: RTCSessionDescriptionInit) {
        try {
            if (!this.peer || this.peer.signalingState === "closed") {
                await this.initializePeerConnection();
            }
            
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error('Error creating answer:', error);
            throw error;
        }
    }

    async setRemoteDescriptionFn(answer: RTCSessionDescriptionInit) {
        try {
            if (this.peer && this.peer.signalingState !== "closed") {
                await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
            }
        } catch (error) {
            console.error('Error setting remote description:', error);
            throw error;
        }
    }

    async addIceCandidate(candidate: RTCIceCandidateInit) {
        try {
            if (this.peer && this.peer.signalingState !== "closed") {
                await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            throw error;
        }
    }

    async closeConnection() {
        if (this.peer) {
            console.log("Closing peer connection");
            this.peer.close();
        }
    }
}

export default new PeerService();