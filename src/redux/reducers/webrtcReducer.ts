// import {
//     SOCKET_CONNECT,
//     SOCKET_DISCONNECT,
//     SOCKET_MESSAGE_RECEIVED,
//   } from '../actions/webrtcAction';
  
//   const initialState = {
//     connected: false,
//     messages: [],
//   };
  
//   const socketReducer = (state = initialState, action: any) => {
//     switch (action.type) {
//       case SOCKET_CONNECT:
//         return { ...state, connected: true };
  
//       case SOCKET_DISCONNECT:
//         return { ...state, connected: false };
  
//       case SOCKET_MESSAGE_RECEIVED:
//         return { ...state, messages: [...state.messages, action.payload] };
  
//       default:
//         return state;
//     }
//   };
  
//   export default socketReducer;
  

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  connected: boolean;
    offer: RTCSessionDescriptionInit | null;
    answer: RTCSessionDescriptionInit | null;
}

const initialState: SocketState = {
  connected: false,
    offer: null,
    answer: null  
};

const webrtcSocketSlice = createSlice({
  name: 'webrtcSocket',
  initialState,
  reducers: {
    socketConnected: (state) => {
      state.connected = true;
    },
    socketDisconnected: (state) => {
      state.connected = false;
        state.offer = null;
        state.answer = null;
    },
    answerRecieved: (state, action: PayloadAction<RTCSessionDescriptionInit>) => {
      state.offer = action.payload;
      },
    offerCreated: (state, action: PayloadAction<RTCSessionDescriptionInit>) => {
      state.answer = action.payload;
    }
  },
});

export const { socketConnected, socketDisconnected, answerRecieved, offerCreated } = webrtcSocketSlice.actions;
export default webrtcSocketSlice.reducer;
