import { Dispatch } from "@reduxjs/toolkit";
import { connectSocket, disconnectSocket } from "../reducers/chatSocketReducer";
import { chatSocketService } from "../thunks/chatThunks"
import { Socket } from "socket.io-client"


export const connectChatSocket = () => {
    return () => {
        chatSocketService.connectChatSocket();
    }
}

export const confirmConnection = (socket : Socket) => {
    return (dispatch: Dispatch) => {
        dispatch(connectSocket(socket))
    }
}

export const confirmDisconnection = () => {
    return (dispatch: Dispatch) => {
        dispatch(disconnectSocket())
    }
}