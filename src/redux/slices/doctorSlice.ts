import { createSlice } from '@reduxjs/toolkit';

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctor: {
      name: '',
      email: '',
      gender: '',
      phone: '',
      password: '',
      dateOfBirth: '',
      occupation: '',
      qualification: '',
      specialisation: '',
      isVerified: false,
      about: '',
      languages: [],
      fee: 0,
      rating: 0,
    },
    isAuthenticated: false,
  },
  reducers: {
    addDoctor: (state, action) => {
      state.doctor = action.payload;
      state.isAuthenticated = true;
    },
    toggleAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    resetDoctor: (state) => {
      state.doctor = {
        name: '',
        email: '',
        gender: '',
        phone: '',
        password: '',
        dateOfBirth: '',
        occupation: '',
        qualification: '',
        specialisation: '',
        isVerified: false,
        about: '',
        languages: [],
        fee: 0,
        rating: 0,
      };
      state.isAuthenticated = false;
    },
  },
});

export const { addDoctor, toggleAuth, resetDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
