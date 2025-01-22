import { ChatState, Message, Patient } from '@/types/chatTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ChatState = {
  selectedPatient: null,
  patients: [],
  messages: [],
  isLoading: false,
  error: null,
  typingUsers: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
    },
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
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
    updatePatientStatus: (state, action: PayloadAction<{ patientId: string; status: 'online' | 'offline' }>) => {
      const patient = state.patients.find(p => p.id === action.payload.patientId);
      if (patient) {
        patient.status = action.payload.status;
        if (action.payload.status === 'offline') {
          patient.lastSeen = new Date();
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPatients,
  setSelectedPatient,
  setMessages,
  addMessage,
  setTypingStatus,
  updatePatientStatus,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;