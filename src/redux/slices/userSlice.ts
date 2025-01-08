import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      _id: '',
      name: '',
      email: '',
      gender: '',
    },
    isAuthenticated: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    toggleAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    resetUser: (state) => {
      state.user = {
        _id: '',
        name: '',
        email: '',
        gender: '',
      };
      state.isAuthenticated = false;
    },
  },
});

export const { addUser, toggleAuthentication, resetUser } = userSlice.actions;
export default userSlice.reducer;
