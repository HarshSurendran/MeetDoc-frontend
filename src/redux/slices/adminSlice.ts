import { createSlice } from "@reduxjs/toolkit";



const adminSlice = createSlice({
    name: "admin",
    initialState: {
        admin: {
            _id: "",
            name: "",
            email: "",
        }
    },
    reducers: {
        addAdmin: (state, action) => {
            state.admin = action.payload;
        },
        resetAdmin: (state) => {
            state.admin._id = "";
            state.admin.name = "";
            state.admin.email = "";
        }
    }
});

export const { addAdmin, resetAdmin } = adminSlice.actions;
export default adminSlice.reducer; 







