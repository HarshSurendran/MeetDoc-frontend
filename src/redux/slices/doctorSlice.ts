import { createSlice } from "@reduxjs/toolkit";

const doctorSlice = createSlice(
    {
        name: "doctors",
        initialState: {
            doctor: {},
            isAuthenticated: false
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
                state.doctor = {}
                state.isAuthenticated = false;
            }
        }
    }
)

export const { addDoctor, toggleAuth, resetDoctor } = doctorSlice.actions
export default doctorSlice.reducer