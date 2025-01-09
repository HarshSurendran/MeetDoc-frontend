import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      _id: '',
      name: '',
      email: '',
      gender: '',
      phone: '',
      date_of_birth: new Date(), 
      occupation: '',
      address: {
        district: "",
        locality: "",
        pincode: "",
        state: "",
        country: ""
      },
      rating: 0,    
      photo: '',
    },
    isAuthenticated: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user._id = action.payload._id;
      state.user.name = action.payload.name;
      state.user.email = action.payload.email;
      state.user.gender = action.payload?.gender;
      state.user.phone = action.payload?.phone;
      state.user.date_of_birth = action.payload.date_of_birth;
      state.user.occupation = action.payload?.occupation;
      state.user.address = action.payload.address;
      state.user.rating = action.payload.rating;
      state.user.photo = action.payload.photo;
    },
    toggleAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    addPhoto: (state, action) => {
      state.user.photo = action.payload;
    },
    resetUser: (state) => {
      state.user = {
        _id: '',
        name: '',
        email: '',
        gender: '',
        phone: '',
        date_of_birth: new Date(), 
        occupation: '',
        address: {
          district: "",
          locality: "",
          pincode: "",
          state: "",
          country: ""
        },
        rating: 0,    
        photo: '',
      };
      state.isAuthenticated = false;
    },
  },
});

export const { addUser, toggleAuthentication, resetUser, addPhoto } = userSlice.actions;
export default userSlice.reducer;