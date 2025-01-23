
class PeerService {
    peer: RTCPeerConnection;
    constructor() {
        this.peer = new RTCPeerConnection({
            iceServers: [{ urls: [ 'stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] }]
        });
    }

    async getOffer() {
        if (this.peer) {          
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }

    async getAnswer(offer: RTCSessionDescriptionInit) {
        if (this.peer) {            
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(answer);
            return answer
        }
    }

    async setRemoteDescriptionFn(answer: RTCSessionDescriptionInit) {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }
}

export default new PeerService();