import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  connected: boolean;
    offer: RTCSessionDescriptionInit | null;
  answer: RTCSessionDescriptionInit | null;
  remoteSocketId: string | null;
}

const initialState: SocketState = {
  connected: false,
    offer: null,
  answer: null,
    remoteSocketId: null
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
      state.remoteSocketId = null;
    },
    answerRecieved: (state, action: PayloadAction<RTCSessionDescriptionInit>) => {
      state.offer = action.payload;
      },
    offerCreated: (state, action: PayloadAction<RTCSessionDescriptionInit>) => {
      state.answer = action.payload;
    },
    // putRemoteSocketId: (state, action: PayloadAction<string>) => {
    //   console.log('putRemoteSocketId', action.payload);
    //   state.remoteSocketId = action.payload;
    // },
  },
});

export const { socketConnected, socketDisconnected, answerRecieved, offerCreated } = webrtcSocketSlice.actions;
export default webrtcSocketSlice.reducer;
