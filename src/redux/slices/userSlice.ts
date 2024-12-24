import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice(
    {
        name: "user",
        initialState: {
            user: {},
            isAuthenticated: false,
        },
        reducers: {
            addUser: (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            },
            toggleAuthentication: (state, action) => {
                state.isAuthenticated = action.payload 
            },
            resetUser: (state) => {
                state.user = {};
                state.isAuthenticated = false;
            }
        }
    }
) 

export const { addUser, toggleAuthentication, resetUser  } = userSlice.actions
export default userSlice.reducer