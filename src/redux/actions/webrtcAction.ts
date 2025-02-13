import { Dispatch } from 'redux';
import { webrtcSocketService } from '../thunks/webrtcThunks';
import { socketConnected, socketDisconnected, offerCreated } from '../reducers/webrtcReducer';


export const connectwebrtcSocket = () => {
  return (dispatch: Dispatch) => {
    webrtcSocketService.connectWebrtcSocket();
    dispatch(socketConnected())
  };
};

export const joinRoom = (roomId: string) => {
return () => {
    webrtcSocketService.joinRoom(roomId);
  };
};

export const sendSDP = ( target: string, sdp: RTCSessionDescriptionInit ) => {
  console.log('sendSDP', target, sdp);
  return (dispatch: Dispatch) => {
      webrtcSocketService.sendOffer({ target, offer: sdp });
      dispatch(offerCreated(sdp))
  };
};

export const onOffer = (callback: (payload: { target: string, offer: RTCSessionDescriptionInit }) => void ) => {
  return () => {
    webrtcSocketService.onOffer(callback);
  };
}

export const sendAnswer = ( target: string, sdp: RTCSessionDescriptionInit ) => {
  return () => {
      webrtcSocketService.sendAnswer({ target, answer: sdp });
  };
}

export const onJoinRoom = (callback: (payload: any) => void) => {
    return () => {
      webrtcSocketService.onJoinRoom(callback);
  };
};

export const onPatientJoined = (callback: (payload: any) => void) => {
    return () => {
        webrtcSocketService.onPatientJoined(callback);
    };
} 

export const onAnswer = (callback: (payload: { target: string, answer: RTCSessionDescriptionInit }) => void) => {
    return () => {
        webrtcSocketService.onAnswer(callback);
    };
}

export const onEndCall = (Callback: () => void ) => {
  return (dispatch: Dispatch) => {
    webrtcSocketService.onEndCall(Callback);
    dispatch(socketDisconnected());
  }
}

export const negotiationNeeded = (to: string, offer: RTCSessionDescriptionInit, ) => {
  return () => {
    webrtcSocketService.sendNegotiationOffer({ target: to, offer });
  };
}

export const onNegotiationOffer = (callback: (payload: { target: string, offer: RTCSessionDescriptionInit }) => void) => {
    return () => {
        webrtcSocketService.onNegotiationOffer(callback);
    };
}

export const sendNegotiationAnswer = (target: string, answer: RTCSessionDescriptionInit) => {
  return () => {
    webrtcSocketService.sendNegotiationAnswer({ target, answer });
  };
}

export const onNegotiationAnswer = (callback: (payload: { target: string, answer: RTCSessionDescriptionInit }) => void) => {
  return () => {
    webrtcSocketService.onNegotiationAnswer(callback);
  };
}

export const sendIceCandidate = (target: string, candidate: RTCIceCandidateInit) => {
  return () => {
    webrtcSocketService.sendIceCandidate({ target, candidate });
  };
}

export const onIceCandidate = (callback: (payload: RTCIceCandidateInit) => void) => {
  return () => {
    webrtcSocketService.onIceCandidate(callback);
  };
}

export const disconnectwebrtcSocket = (payload: { target: string }) => {
  return (dispatch: Dispatch) => {
    webrtcSocketService.disconnect(payload);
    dispatch(socketDisconnected());
  };
};


