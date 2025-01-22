import { createSlice } from '@reduxjs/toolkit';
import socketio from 'socket.io-client'

interface ChatSocketState {
    connected: boolean;
    socket: typeof socketio | null;    
}

const initialState : ChatSocketState = {
    connected: false,
    socket: null
}

const chatSocketSlice = createSlice({
    name: 'chatSocket',
    initialState,
    reducers: {
        connectSocket: (state, action) => {
            state.socket = action.payload;
            state.connected = true;
        },
        disconnectSocket: (state) => {
            state.socket = null;
            state.connected = false;
        }
    }
});

export const { connectSocket, disconnectSocket } = chatSocketSlice.actions;
export default chatSocketSlice.reducer