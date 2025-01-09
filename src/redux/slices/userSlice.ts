import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      _id: '',
      name: '',
      email: '',
      gender: '',
      occupation: '',
    },
    isAuthenticated: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user._id = action.payload._id;
      state.user.name = action.payload.name;
      state.user.email = action.payload.email;
      state.user.gender = action.payload?.gender;
      state.user.occupation = action.payload?.occupation;
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
        occupation: '',
      };
      state.isAuthenticated = false;
    },
  },
});

export const { addUser, toggleAuthentication, resetUser } = userSlice.actions;
export default userSlice.reducer;
