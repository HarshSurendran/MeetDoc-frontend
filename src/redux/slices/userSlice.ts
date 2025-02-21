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
      isSubscribed: false,
      subscriptionId: '',
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
      state.user.isSubscribed = action.payload.isSubscribed;
      state.user.subscriptionId = action.payload.subscriptionId;
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
        isSubscribed: false,
        subscriptionId: ''
      };
      state.isAuthenticated = false;
    },
    addSubscriptionDetails: (state, action) => {
      state.user.isSubscribed = action.payload.isSubscribed;
      state.user.subscriptionId = action.payload.subscriptionId;
    },
  },
});

export const { addUser, toggleAuthentication, resetUser, addPhoto, addSubscriptionDetails } = userSlice.actions;
export default userSlice.reducer;