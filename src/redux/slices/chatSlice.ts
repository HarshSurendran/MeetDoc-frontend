import { ChatState, Message, User } from '@/types/chatTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ChatState = {
  selectedUser: null,
  peoples: [],
  messages: [],
  isMessagesLoading: false,
  isPeopleLoading: false,
  error: null,
  typingUsers: {},
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setPeoples: (state, action: PayloadAction<User[]>) => {
      state.peoples = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setTypingStatus: (state, action: PayloadAction<{ userId: string; isTyping: boolean }>) => {
      state.typingUsers[action.payload.userId] = action.payload.isTyping;
    },
    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    updatePeopleStatus: (state, action: PayloadAction<{ patientId: string; status: 'online' | 'offline' }>) => {
      const patient = state.peoples.find(p => p.id === action.payload.patientId);
      if (patient) {
        patient.status = action.payload.status;
        if (action.payload.status === 'offline') {
          patient.lastSeen = new Date();
        }
      }
    },
    // setLoading: (state, action: PayloadAction<boolean>) => {
    //   state.isLoading = action.payload;
    // },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setIsPeopleLoading: (state, action: PayloadAction<boolean>) => {
      state.isPeopleLoading = action.payload;
    },
    setIsMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.isMessagesLoading = action.payload;
    },
  },
});

export const {
  setPeoples,
  setSelectedUser,
  setMessages,
  addMessage,
  setTypingStatus,
  updatePeopleStatus,
  setError,
  setIsPeopleLoading,
  setIsMessagesLoading
} = chatSlice.actions;

export default chatSlice.reducer;