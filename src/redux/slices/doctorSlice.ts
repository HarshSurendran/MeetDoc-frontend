import { createSlice } from '@reduxjs/toolkit';

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctor: {
      name: '',
      email: '',
      gender: '',
      phone: '',
      dateOfBirth: '',
      occupation: '',
      qualification: '',
      specialisation: '',
      isVerified: false,
      about: '',
      languages: [],
      address: {
        district: "",
        locality: "",
        pincode: "",
        state: "",
        country: ""
      },
      fee: 0,
      rating: 0,
      _id: '',
      photo: '',
    },
    isAuthenticated: false,
  },
  reducers: {
    addDoctor: (state, action) => {
      console.log("action", action.payload);
      state.doctor.name = action.payload?.name;
      state.doctor.email = action.payload?.email;
      state.doctor.gender = action.payload?.gender;
      state.doctor.phone = action.payload?.phone;
      state.doctor.dateOfBirth = action.payload?.dateOfBirth;
      state.doctor.occupation = action.payload?.occupation;
      state.doctor.qualification = action.payload?.qualification;
      state.doctor.specialisation = action.payload?.specialisation;
      state.doctor.isVerified = action.payload?.isVerified;
      state.doctor.about = action.payload?.about;
      state.doctor.languages = action.payload?.languages;
      state.doctor.address = action.payload.address;
      state.doctor.fee = action.payload?.fee;
      state.doctor.rating = action.payload?.rating;
      state.doctor._id = action.payload?._id;
      state.doctor.photo = action.payload?.photo;
      state.isAuthenticated = true;
    },
    toggleAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    addPhoto: (state, action) => {
      state.doctor.photo = action.payload;
    },
    resetDoctor: (state) => {
      state.doctor = {
        name: '',
        email: '',
        gender: '',
        phone: '',        
        dateOfBirth: '',
        occupation: '',
        qualification: '',
        specialisation: '',
        isVerified: false,
        about: '',
        languages: [],
        address: {
          district: "",
          locality: "",
          pincode: "",
          state: "",
          country: ""
        },
        fee: 0,
        rating: 0,
        _id: '',
        photo: '',
      };
      state.isAuthenticated = false;
    },
  },
});

export const { addDoctor, addPhoto, toggleAuth, resetDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
