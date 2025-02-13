
export const initializePeerConnection = async () => {
    console.log('Initializing peer connection function called.');
    // if (this.peer) {
    //     alert("Peer connection was closed. Re-initializing...");
    //     this.peer.close();
    // }
    
    const peer = new RTCPeerConnection({
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

    // peer.onicecandidate = event => {
    //     if (event.candidate) {
    //         console.log("New ICE candidate", event.candidate);
    //     }
    // };
    
    // // Handle track events (receiving remote stream)
    // peer.ontrack = event => {
    //     const remoteStream = event.streams[0];
    //     console.log("Remote stream received", remoteStream);
    //     onRemoteStream(remoteStream);
    // };
    
    
    return peer
}